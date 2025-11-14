import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Verification email requested for: ${email}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting: check if user has requested too many codes recently
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentCodes, error: checkError } = await supabase
      .from("email_verifications")
      .select("id")
      .eq("email", email)
      .gte("created_at", oneHourAgo);

    if (checkError) {
      console.error("Error checking recent codes:", checkError);
    }

    if (recentCodes && recentCodes.length >= 3) {
      console.warn(`Rate limit exceeded for ${email}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many verification emails requested. Please try again in an hour." 
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate and store verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error: upsertError } = await supabase
      .from("email_verifications")
      .upsert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        created_ip: clientIp,
        used: false,
        attempts: 0,
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error("Error storing verification code:", upsertError);
      throw new Error("Failed to create verification code");
    }

    console.log(`Verification code generated for ${email}`);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Acari <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thanks for signing up! Please use the verification code below to confirm your email address:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Acari - Build your business faster</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        message: "Verification code sent successfully",
        expiresIn: 600 // seconds
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});