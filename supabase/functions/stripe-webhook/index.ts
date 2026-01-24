import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = stripe.webhooks.constructEvent(body, signature, endpointSecret ?? '')

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const bookingId = session.metadata?.bookingId

            if (bookingId) {
                const supabaseClient = createClient(
                    Deno.env.get('SUPABASE_URL') ?? '',
                    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                )

                // 1. Get booking details for the email
                const { data: booking, error: fetchError } = await supabaseClient
                    .from('bookings')
                    .select('*')
                    .eq('id', bookingId)
                    .single()

                if (fetchError) throw fetchError

                // 2. Update status to confirmed
                const { error: updateError } = await supabaseClient
                    .from('bookings')
                    .update({ status: 'confirmed' })
                    .eq('id', bookingId)

                if (updateError) throw updateError
                console.log(`✅ Booking ${bookingId} confirmed via Stripe Webhook`)

                // 3. Trigger Luxury Email to Client & Admin Notification
                // We'll use the send-notification function via internal fetch to avoid duplication
                const firstName = booking.name.split(' ')[0]
                const bookingCode = booking.id?.slice(-6).toUpperCase() || 'REF-PENDING'
                const adminEmail = "michael@insolitoprive.it" // Ideally fetched from env

                const clientHtml = `
                    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 20px auto; padding: 60px; background: #ffffff; border: 1px solid #D4AF37; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 60px;">
                            <h1 style="letter-spacing: 12px; font-weight: 300; margin: 0; text-transform: uppercase; font-size: 28px;">INSOLITO PRIVÉ</h1>
                            <div style="width: 50px; height: 1px; background: #D4AF37; margin: 25px auto;"></div>
                            <p style="letter-spacing: 4px; font-size: 10px; color: #D4AF37; text-transform: uppercase; font-style: italic;">The Guardian of your Lifestyle</p>
                        </div>
                        <p style="font-size: 18px; line-height: 1.8; margin-bottom: 30px;">Egregio <strong>${firstName}</strong>,</p>
                        <p style="font-size: 15px; line-height: 1.8; color: #444;">È un onore confermarLe che il Suo mandato è stato acquisito con successo. La Sua scelta di affidarsi a <strong>Insolito Privé</strong> è un attestato di ricerca della perfezione logistica.</p>
                        <div style="margin: 50px 0; padding: 40px; background: #fcfbf7; border: 1px solid #efece3;">
                            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #888; margin-bottom: 25px; border-bottom: 1px solid #efece3; padding-bottom: 10px;">Dettaglio Protocollo</h3>
                            <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Codice Riferimento:</strong> <span style="letter-spacing: 2px; color: #D4AF37;">${bookingCode}</span></p>
                            <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Data & Ora:</strong> ${booking.date} @ ${booking.time}</p>
                            <p style="margin: 0; font-size: 14px;"><strong>Onorario:</strong> €${booking.estimated_price}</p>
                        </div>
                        <div style="background: #000; color: #D4AF37; padding: 40px; text-align: center; margin-bottom: 50px;">
                            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; font-style: italic;">"La fedeltà merita di essere onorata."</p>
                            <div style="border: 1px dashed #D4AF37; padding: 15px; display: inline-block; margin-bottom: 15px;">
                                <span style="font-size: 18px; letter-spacing: 5px; font-weight: bold;">INSOLITO10</span>
                            </div>
                            <p style="font-size: 12px; color: #fff; margin: 0;">Usufruisca di uno <strong style="color: #D4AF37;">sconto del 10%</strong> sulla Sua prossima richiesta.</p>
                        </div>
                        <p style="font-size: 14px; text-align: center; font-style: italic; color: #666;">"Il vero lusso conclude se stesso nel silenzio della certezza."</p>
                    </div>
                `

                // INTERNAL CALL to send-notification
                await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
                    },
                    body: JSON.stringify({
                        to: booking.email,
                        subject: `CONFIRMATION: ${bookingCode} | INSOLITO PRIVÉ`,
                        html: clientHtml
                    })
                })

                // NOTIFY ADMIN
                await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
                    },
                    body: JSON.stringify({
                        to: adminEmail,
                        subject: `🔔 INCASSO RICEVUTO: ${booking.name} (€${booking.estimated_price})`,
                        html: `<h3>Michael, un cliente ha appena pagato!</h3><p><strong>Cliente:</strong> ${booking.name}</p><p><strong>Importo:</strong> €${booking.estimated_price}</p><p><strong>Data Missione:</strong> ${booking.date} @ ${booking.time}</p><p>Accedi alla dashboard per i dettagli.</p>`
                    })
                })
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (err) {
        console.error(`❌ Webhook Error: ${err.message}`)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
})
