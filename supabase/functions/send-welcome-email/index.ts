import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const requestSchema = z.object({
  email: z.string().email().max(255),
  businessName: z.string().trim().min(1).max(100),
  userName: z.string().trim().max(100).optional()
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, businessName, userName } = requestSchema.parse(body);

    const emailResponse = await resend.emails.send({
      from: "SpaceBlocks.ai <support@spaceblocks.ai>",
      to: [email],
      subject: "Welcome to SpaceBlocks.ai! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to SpaceBlocks.ai</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 90%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #0A0A0A;">
                          Welcome to SpaceBlocks.ai! 🚀
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 40px;">
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4B5563;">
                          Hi ${userName || 'there'},
                        </p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4B5563;">
                          Thanks for starting your journey with <strong>${businessName}</strong>! We're excited to help you turn your idea into a real business.
                        </p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4B5563;">
                          Your business plan is being built, and you can access your dashboard anytime to see your progress. Remember, you only pay when you're ready to launch — no pressure, just progress!
                        </p>
                        <table role="presentation" style="margin: 30px 0; width: 100%;">
                          <tr>
                            <td align="center">
                              <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '') || 'https://spaceblocks.ai'}" 
                                 style="display: inline-block; padding: 14px 32px; background-color: #0A0A0A; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                                View Your Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 20px 0 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                          Need help? Just reply to this email or reach out at <a href="mailto:support@spaceblocks.ai" style="color: #4E8BFF;">support@spaceblocks.ai</a>.
                        </p>
                        <p style="margin: 20px 0 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                          Best,<br>
                          <strong>The SpaceBlocks.ai Team</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9CA3AF; text-align: center;">
                          P.O. Box 1234, Shawnee, OK 74802<br>
                          © ${new Date().getFullYear()} SpaceBlocks.ai. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
