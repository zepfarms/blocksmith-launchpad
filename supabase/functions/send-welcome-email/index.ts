import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  businessName: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, businessName, userName }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', email);

    const emailResponse = await resend.emails.send({
      from: "SpaceBlocks.ai <hello@spaceblocks.ai>",
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
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #0A0A0A; color: #FAFAFA;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;">
                    
                    <!-- Header with gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #22D3EE 0%, #7B61FF 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0A0A0A; letter-spacing: -0.02em;">
                          SpaceBlocks.ai
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Main content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800; color: #FAFAFA; letter-spacing: -0.02em;">
                          Welcome aboard! 🎉
                        </h2>
                        
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: rgba(250, 250, 250, 0.8);">
                          ${userName ? `Hi ${userName}!` : 'Hey there!'} We're excited to help you build <strong style="color: #22D3EE;">${businessName}</strong> and get your first customer.
                        </p>
                        
                        <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.2); border-radius: 16px; padding: 24px; margin: 24px 0;">
                          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #22D3EE;">
                            What's happening now?
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: rgba(250, 250, 250, 0.8);">
                            <li style="margin-bottom: 8px;">Your business dashboard is ready</li>
                            <li style="margin-bottom: 8px;">We're building your assets (logo, website, etc.)</li>
                            <li style="margin-bottom: 8px;">You can review everything before launch</li>
                            <li>You only pay when you're ready to go live</li>
                          </ul>
                        </div>
                        
                        <p style="margin: 24px 0; font-size: 16px; line-height: 1.6; color: rgba(250, 250, 250, 0.8);">
                          <strong style="color: #FAFAFA;">You're not doing this alone.</strong> Your AI co-founder plus our team is building your business with you.
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 32px 0;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="https://spaceblocks.ai/dashboard" style="display: inline-block; background: linear-gradient(135deg, #22D3EE 0%, #5D50FE 100%); color: #0A0A0A; text-decoration: none; padding: 16px 48px; border-radius: 999px; font-weight: 700; font-size: 16px; box-shadow: 0 0 40px rgba(34, 211, 238, 0.4);">
                                View My Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; margin-top: 32px;">
                          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(250, 250, 250, 0.6);">
                            Need help? Just reply to this email — we're here for you.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; text-align: center; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(250, 250, 250, 0.4);">
                          © ${new Date().getFullYear()} SpaceBlocks.ai
                        </p>
                        <p style="margin: 0; font-size: 12px; color: rgba(250, 250, 250, 0.3);">
                          Meet your new business partner
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

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
