import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { bookingId, amount, customerEmail, customerName, description } = await req.json()

        // 1. Create a Stripe Price dynamically (or use a product_id if you have one)
        // For simplicity, we create a one-time product and price
        const product = await stripe.products.create({
            name: `${description}`,
        })

        const price = await stripe.prices.create({
            unit_amount: Math.round(amount * 100), // in cents
            currency: 'eur',
            product: product.id,
        })

        // 2. Create a Payment Link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            after_completion: {
                type: 'redirect',
                redirect: { url: 'https://insolitoprive.it/grazie' }
            },
            metadata: { bookingId },
        })

        // 3. Update the booking in Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '' // We use service role if you want to bypass RLS
        )

        const { error: updateError } = await supabaseClient
            .from('bookings')
            .update({
                stripe_link: paymentLink.url,
                status: 'proposed'
            })
            .eq('id', bookingId)

        if (updateError) throw updateError

        return new Response(
            JSON.stringify({ url: paymentLink.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
