import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactNotification {
  type: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  phone?: string;
  subject?: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: ContactNotification = await req.json();

    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Type:</strong> ${notification.type}</p>
      <p><strong>Name:</strong> ${notification.name}</p>
      <p><strong>Email:</strong> ${notification.email}</p>
      ${notification.company ? `<p><strong>Company:</strong> ${notification.company}</p>` : ''}
      ${notification.website ? `<p><strong>Website:</strong> ${notification.website}</p>` : ''}
      ${notification.phone ? `<p><strong>Phone:</strong> ${notification.phone}</p>` : ''}
      ${notification.subject ? `<p><strong>Subject:</strong> ${notification.subject}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${notification.message.replace(/\n/g, '<br>')}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acari Contact <notifications@acari.ai>",
        to: ["support@acari.ai"],
        subject: `New ${notification.type} inquiry from ${notification.name}`,
        html: emailBody,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending contact notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});