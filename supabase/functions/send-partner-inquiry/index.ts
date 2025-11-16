import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartnerInquiry {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website: string;
  partnershipType: string;
  productDescription: string;
  integrationScope: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiry: PartnerInquiry = await req.json();

    const emailBody = `
      <h2>New Partnership Inquiry</h2>
      <p><strong>Company:</strong> ${inquiry.companyName}</p>
      <p><strong>Contact Person:</strong> ${inquiry.contactPerson}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
      <p><strong>Website:</strong> ${inquiry.website}</p>
      <p><strong>Partnership Type:</strong> ${inquiry.partnershipType}</p>
      <p><strong>Product/Service Description:</strong></p>
      <p>${inquiry.productDescription.replace(/\n/g, '<br>')}</p>
      <p><strong>Integration Scope:</strong></p>
      <p>${inquiry.integrationScope.replace(/\n/g, '<br>')}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acari Partners <notifications@acari.ai>",
        to: ["support@acari.ai"],
        subject: `Partnership Inquiry from ${inquiry.companyName}`,
        html: emailBody,
      }),
    });

    const data = await res.json();

    // Send auto-response to partner
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acari <noreply@acari.ai>",
        to: [inquiry.email],
        subject: "Thanks for your partnership interest!",
        html: `
          <h2>Thank you for your interest in partnering with Acari!</h2>
          <p>Hi ${inquiry.contactPerson},</p>
          <p>We've received your partnership application and are excited to review it. Our team will get back to you within 3-5 business days.</p>
          <p>In the meantime, feel free to explore our platform and see how we're helping entrepreneurs launch their businesses.</p>
          <p>Best regards,<br>The Acari Team</p>
        `,
      }),
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending partner inquiry:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});