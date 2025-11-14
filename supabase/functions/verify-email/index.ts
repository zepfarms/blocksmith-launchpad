import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    console.log(`Verification attempt for: ${email}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the verification record
    const { data: verificationRecords, error: fetchError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching verification:", fetchError);
      throw new Error("Verification lookup failed");
    }

    if (!verificationRecords || verificationRecords.length === 0) {
      console.warn(`Invalid code for ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid verification code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verification = verificationRecords[0];

    // Check if expired
    if (new Date(verification.expires_at) < new Date()) {
      console.warn(`Expired code for ${email}`);
      return new Response(
        JSON.stringify({ error: "Verification code has expired. Please request a new one." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check attempts
    if (verification.attempts >= 5) {
      console.warn(`Too many attempts for ${email}`);
      return new Response(
        JSON.stringify({ error: "Too many failed attempts. Please request a new code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark code as used
    const { error: updateCodeError } = await supabase
      .from("email_verifications")
      .update({ used: true })
      .eq("id", verification.id);

    if (updateCodeError) {
      console.error("Error updating verification code:", updateCodeError);
    }

    // Update profile to mark email as verified
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("email", email);

    if (updateProfileError) {
      console.error("Error updating profile:", updateProfileError);
      throw new Error("Failed to verify email");
    }

    console.log(`Email verified successfully for ${email}`);

    return new Response(
      JSON.stringify({ 
        message: "Email verified successfully",
        verified: true 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});