import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  userEmail: string;
  businessName: string;
  businessIdea: string;
  selectedBlocks: string[];
  aiAnalysis?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userEmail, 
      businessName, 
      businessIdea, 
      selectedBlocks,
      aiAnalysis 
    }: AdminNotificationRequest = await req.json();

    console.log('Sending admin notification for new business:', businessName);

    // You can configure this email address via environment variable or hardcode it
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@spaceblocks.ai";

    const emailResponse = await resend.emails.send({
      from: "SpaceBlocks.ai <notifications@spaceblocks.ai>",
      to: [adminEmail],
      subject: `🚀 New Business: ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Business Signup</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #F7F9FB; color: #0A0A0A;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #22D3EE 0%, #7B61FF 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF;">
                          New Business Signup! 🎉
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Main content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #0A0A0A;">
                          ${businessName}
                        </h2>
                        
                        <div style="margin-bottom: 24px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                            User Email
                          </h3>
                          <p style="margin: 0; font-size: 16px; color: #0A0A0A;">
                            ${userEmail}
                          </p>
                        </div>
                        
                        <div style="margin-bottom: 24px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Business Idea
                          </h3>
                          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #0A0A0A; background: #F7F9FB; padding: 16px; border-radius: 8px;">
                            ${businessIdea}
                          </p>
                        </div>
                        
                        ${aiAnalysis ? `
                        <div style="margin-bottom: 24px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                            AI Analysis
                          </h3>
                          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #0A0A0A; background: #EFF6FF; padding: 16px; border-radius: 8px; border-left: 4px solid #22D3EE;">
                            ${aiAnalysis}
                          </p>
                        </div>
                        ` : ''}
                        
                        <div style="margin-bottom: 24px;">
                          <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Selected Blocks (${selectedBlocks.length})
                          </h3>
                          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${selectedBlocks.map(block => `
                              <span style="display: inline-block; background: linear-gradient(135deg, #22D3EE 0%, #7B61FF 100%); color: #FFFFFF; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600;">
                                ${block}
                              </span>
                            `).join('')}
                          </div>
                        </div>
                        
                        <div style="border-top: 2px solid #F7F9FB; padding-top: 24px; margin-top: 32px;">
                          <p style="margin: 0; font-size: 14px; color: #666;">
                            <strong>Next steps:</strong> Review the business details and start building their assets.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 30px; text-align: center; background: #F7F9FB; border-top: 1px solid #E5E7EB;">
                        <p style="margin: 0; font-size: 12px; color: #999;">
                          SpaceBlocks.ai Admin Notification System
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

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
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
