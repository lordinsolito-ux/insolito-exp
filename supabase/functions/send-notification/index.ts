import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Gestione Preflight CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const apiKey = Deno.env.get("RESEND_API_KEY")
        if (!apiKey) {
            throw new Error("RESEND_API_KEY not found in environment")
        }

        const resend = new Resend(apiKey)
        const { to, subject, html } = await req.json()

        console.log(`📧 Attempting to send email to ${to} via Resend...`)

        const { data, error } = await resend.emails.send({
            from: "Insolito Privé <onboarding@resend.dev>",
            to: [to],
            subject: subject,
            html: html,
        })

        if (error) {
            console.error(`❌ Resend API Error:`, error)
            return new Response(JSON.stringify({ error }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            })
        }

        console.log(`✅ Email sent successfully:`, data)
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })
    } catch (error) {
        console.error(`❌ Function error: ${error.message}`)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }
})
