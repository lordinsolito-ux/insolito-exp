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
        const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
        const { to, subject, html } = await req.json()

        console.log(`📧 Sending email to ${to} with subject: ${subject}`)

        const data = await resend.emails.send({
            from: "Insolito Privé <onboarding@resend.dev>",
            to: [to],
            subject: subject,
            html: html,
        })

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }
})
