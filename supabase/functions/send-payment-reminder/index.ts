import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      throw new Error('Admin access required');
    }

    // Get failure ID from request
    const { failureId } = await req.json();

    console.log('Sending payment reminder for failure:', failureId);

    // Get failure details
    const { data: failure, error: failureError } = await supabase
      .from('subscription_payment_failures')
      .select(`
        *,
        profiles!inner(email),
        user_subscriptions!inner(block_name, monthly_price_cents, grace_period_end)
      `)
      .eq('id', failureId)
      .single();

    if (failureError || !failure) {
      throw new Error('Payment failure not found');
    }

    if (failure.resolved) {
      throw new Error('Payment already resolved');
    }

    // Check if a reminder was sent recently (within last 24 hours)
    if (failure.last_reminder_sent_at) {
      const lastReminderTime = new Date(failure.last_reminder_sent_at).getTime();
      const now = Date.now();
      const hoursSinceLastReminder = (now - lastReminderTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastReminder < 24) {
        throw new Error(`A reminder was already sent ${Math.floor(hoursSinceLastReminder)} hours ago. Please wait 24 hours between reminders.`);
      }
    }

    // Calculate grace period days remaining
    const gracePeriodEnd = new Date(failure.user_subscriptions.grace_period_end);
    const now = new Date();
    const daysRemaining = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Send reminder email
    const { error: emailError } = await resend.emails.send({
      from: 'Acari <support@acari.ai>',
      to: failure.profiles.email,
      subject: '⏰ Reminder: Update Payment Method for Your Acari Subscription',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Payment Reminder</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            This is a friendly reminder that your payment for the <strong>${failure.user_subscriptions.block_name}</strong> subscription failed.
          </p>

          <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 25px 0;">
            <h2 style="color: #856404; font-size: 18px; margin: 0 0 10px 0;">Action Required</h2>
            <p style="color: #856404; margin: 0; font-size: 14px;">
              You have <strong>${Math.max(0, daysRemaining)} day${daysRemaining !== 1 ? 's' : ''}</strong> remaining to update your payment method.
              ${daysRemaining <= 0 ? '<br/><strong style="color: #dc3545;">Your grace period has expired.</strong>' : ''}
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;"><strong>Subscription Details:</strong></p>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Block: ${failure.user_subscriptions.block_name}</p>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Amount: $${(failure.user_subscriptions.monthly_price_cents / 100).toFixed(2)}/month</p>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Reason: ${failure.failure_reason}</p>
          </div>

          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 25px 0;">
            To continue your subscription and avoid service interruption, please update your payment method as soon as possible.
          </p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard/subscriptions" 
               style="display: inline-block; background-color: #007bff; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Update Payment Method
            </a>
          </div>

          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated reminder sent by Acari admin.
          </p>
        </div>
      `
    });

    if (emailError) {
      throw emailError;
    }

    // Update the failure record with reminder timestamp
    await supabase
      .from('subscription_payment_failures')
      .update({
        last_reminder_sent_at: new Date().toISOString(),
        reminder_count: (failure.reminder_count || 0) + 1,
      })
      .eq('id', failureId);

    console.log('Payment reminder sent successfully to:', failure.profiles.email);

    return new Response(
      JSON.stringify({ success: true, message: 'Reminder email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});