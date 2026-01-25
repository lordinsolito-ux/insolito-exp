import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// NOTE: Deploy this function using: npx supabase functions deploy create-proposal-payment --no-verify-jwt
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

// STRIPE PRICE IDS - Configurati tramite constants.ts
const STRIPE_PRICE_IDS = {
    essentials: 'price_1Sshp1RQyWAZgAKdf78GeEWY',  // €180/h
    signature: 'price_1Sshp2RQyWAZgAKdzPMsFoZK',   // €280/h
    elite: 'price_1Sshp2RQyWAZgAKdkUmtOvgb'        // €6000/mese
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { bookingId, amount, customerEmail, customerName, description, tier, hours, returnUrl } = await req.json()

        // Determina quale Price ID usare in base al tier
        let priceId: string;
        let quantity: number = 1;

        if (tier === 'elite') {
            // Elite è subscription mensile (€6000/mese)
            priceId = STRIPE_PRICE_IDS.elite;
            quantity = 1; // 1 mese
        } else if (tier === 'essentials') {
            // Essentials: €180/ora
            priceId = STRIPE_PRICE_IDS.essentials;
            quantity = hours || 3; // Minimo 3 ore
        } else if (tier === 'signature') {
            // Signature: €280/ora
            priceId = STRIPE_PRICE_IDS.signature;
            quantity = hours || 4; // Minimo 4 ore
        } else {
            // Fallback: usa creazione dinamica per booking legacy senza tier
            console.warn('⚠️ Booking senza tier specificato, usando creazione dinamica');

            const product = await stripe.products.create({
                name: `${description}`,
            })

            const price = await stripe.prices.create({
                unit_amount: Math.round(amount * 100), // in cents
                currency: 'eur',
                product: product.id,
            })

            priceId = price.id;
            quantity = 1;
        }

        // 2. Crea Payment Link usando il Price ID pre-configurato
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: priceId, quantity: quantity }],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${returnUrl || 'https://insolitoprive.it'}/grazie?name=${encodeURIComponent(customerName)}&tier=${encodeURIComponent(tier || 'lifestyle')}&price=${amount}`
                }
            },
            metadata: {
                bookingId,
                tier: tier || 'legacy',
                hours: hours?.toString() || '0'
            },
        })

        // 3. Update booking in Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: updateError } = await supabaseClient
            .from('bookings')
            .update({
                stripe_link: paymentLink.url,
                status: 'proposed'
            })
            .eq('id', bookingId)

        if (updateError) throw updateError

        console.log(`✅ Payment Link creato per Tier ${tier}: ${paymentLink.url}`)

        return new Response(
            JSON.stringify({ url: paymentLink.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error('❌ Errore Edge Function:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
