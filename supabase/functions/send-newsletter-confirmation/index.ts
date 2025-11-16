import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterSubscription {
  email: string;
  name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const subscription: NewsletterSubscription = await req.json();

    const emailBody = `
      <h2>Welcome to Acari!</h2>
      <p>Hi${subscription.name ? ` ${subscription.name}` : ''},</p>
      <p>Thanks for subscribing to our newsletter! You'll now receive:</p>
      <ul>
        <li>Business tips and insights</li>
        <li>Product updates and new features</li>
        <li>Exclusive offers and resources</li>
        <li>Success stories from entrepreneurs like you</li>
      </ul>
      <p>We're excited to have you in our community!</p>
      <p>Best regards,<br>The Acari Team</p>
      <p style="font-size: 12px; color: #666; margin-top: 30px;">
        Don't want to receive these emails? You can unsubscribe at any time.
      </p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acari <newsletter@acari.ai>",
        to: [subscription.email],
        subject: "Welcome to the Acari Newsletter!",
        html: emailBody,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending newsletter confirmation:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});