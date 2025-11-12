import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const requestSchema = z.object({
  userEmail: z.string().email().max(255),
  businessName: z.string().trim().min(1).max(100),
  businessIdea: z.string().trim().min(5).max(500),
  selectedBlocks: z.array(z.string().max(100)).max(50),
  aiAnalysis: z.string().max(2000).optional()
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      userEmail,
      businessName,
      businessIdea,
      selectedBlocks,
      aiAnalysis,
    } = requestSchema.parse(body);

    const emailResponse = await resend.emails.send({
      from: "SpaceBlocks.ai <no-reply@spaceblocks.ai>",
      to: ["support@spaceblocks.ai"],
      subject: `🎉 New Business Signup: ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Business Signup</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 90%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px;">
                        <h1 style="margin: 0 0 10px; font-size: 24px; font-weight: bold; color: #0A0A0A;">
                          New Business Signup
                        </h1>
                        <p style="margin: 0; font-size: 14px; color: #6B7280;">
                          ${new Date().toLocaleString()}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none;">
                              <strong style="color: #374151;">User Email:</strong>
                            </td>
                            <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-bottom: none; border-left: none;">
                              ${userEmail}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none;">
                              <strong style="color: #374151;">Business Name:</strong>
                            </td>
                            <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-bottom: none; border-left: none;">
                              ${businessName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none;">
                              <strong style="color: #374151;">Business Idea:</strong>
                            </td>
                            <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-bottom: none; border-left: none;">
                              ${businessIdea}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; vertical-align: top;">
                              <strong style="color: #374151;">Selected Blocks:</strong>
                            </td>
                            <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-left: none;">
                              <ul style="margin: 0; padding-left: 20px;">
                                ${selectedBlocks.map(block => `<li>${block}</li>`).join('')}
                              </ul>
                            </td>
                          </tr>
                          ${aiAnalysis ? `
                          <tr>
                            <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; vertical-align: top;">
                              <strong style="color: #374151;">AI Analysis:</strong>
                            </td>
                            <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-left: none;">
                              ${aiAnalysis}
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                          This is an automated notification from SpaceBlocks.ai
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
