import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);

  try {
    const {
      user,
      email_data: { token, email_action_type }
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    // Only send code-only emails for signup
    if (email_action_type !== 'signup') {
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Sending code-only signup email to ${user.email} with code ${token}`);

    const { error } = await resend.emails.send({
      from: 'SpaceBlocks.ai <no-reply@spaceblocks.ai>',
      to: [user.email],
      subject: 'Your SpaceBlocks.ai Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm your signup</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 90%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #0A0A0A;">
                          Confirm your signup
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 40px;">
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4B5563; text-align: center;">
                          Thanks for signing up for <strong>SpaceBlocks.ai</strong>!
                        </p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4B5563; text-align: center;">
                          Enter this code on the verification page:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                          <div style="display: inline-block; padding: 20px 40px; background-color: #f3f4f6; border-radius: 8px; border: 2px solid #e5e7eb;">
                            <span style="font-size: 32px; font-weight: bold; color: #0A0A0A; letter-spacing: 8px; font-family: monospace;">
                              ${token}
                            </span>
                          </div>
                        </div>
                        <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #9CA3AF; text-align: center;">
                          This code will expire in 10 minutes.
                        </p>
                        <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #9CA3AF; text-align: center;">
                          If you didn't create an account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                          SpaceBlocks.ai • Turn Ideas Into Companies
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

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Code-only email sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in send-signup-code function:', error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
