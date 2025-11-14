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

    console.log('Starting automated grace period reminder check...');

    // Get all unresolved payment failures with grace periods
    const { data: failures, error: failuresError } = await supabase
      .from('subscription_payment_failures')
      .select(`
        *,
        profiles!inner(email),
        user_subscriptions!inner(block_name, monthly_price_cents, grace_period_end)
      `)
      .eq('resolved', false)
      .not('user_subscriptions.grace_period_end', 'is', null);

    if (failuresError) {
      console.error('Error fetching failures:', failuresError);
      throw failuresError;
    }

    console.log(`Found ${failures?.length || 0} unresolved payment failures with grace periods`);

    let emailsSent = 0;
    const now = new Date();

    for (const failure of failures || []) {
      const gracePeriodEnd = new Date(failure.user_subscriptions.grace_period_end);
      const daysRemaining = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Check if we should send a reminder today
      let shouldSendReminder = false;
      let reminderType = '';

      if (daysRemaining === 5) {
        shouldSendReminder = true;
        reminderType = '5-day';
      } else if (daysRemaining === 3) {
        shouldSendReminder = true;
        reminderType = '3-day';
      } else if (daysRemaining === 1) {
        shouldSendReminder = true;
        reminderType = 'final';
      } else if (daysRemaining <= 0) {
        // Grace period expired - skip (another process should handle this)
        console.log(`Grace period expired for failure ${failure.id}`);
        continue;
      }

      if (!shouldSendReminder) {
        continue;
      }

      // Check if reminder was already sent in the last 24 hours
      if (failure.last_reminder_sent_at) {
        const lastReminderTime = new Date(failure.last_reminder_sent_at).getTime();
        const hoursSinceLastReminder = (now.getTime() - lastReminderTime) / (1000 * 60 * 60);
        
        if (hoursSinceLastReminder < 24) {
          console.log(`Skipping - reminder sent ${Math.floor(hoursSinceLastReminder)} hours ago for failure ${failure.id}`);
          continue;
        }
      }

      // Determine urgency and messaging
      const isUrgent = daysRemaining <= 1;
      const urgencyLevel = daysRemaining === 1 ? 'URGENT' : daysRemaining === 3 ? 'Important' : 'Reminder';

      console.log(`Sending ${reminderType} reminder for failure ${failure.id} (${daysRemaining} days remaining)`);

      // Send reminder email
      try {
        await resend.emails.send({
          from: 'Acari <support@acari.ai>',
          to: failure.profiles.email,
          subject: `${isUrgent ? '🚨 URGENT: ' : '⏰ '}${urgencyLevel} - Update Payment Method (${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} Remaining)`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              ${isUrgent ? `
                <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">⚠️ URGENT ACTION REQUIRED</h1>
                </div>
              ` : ''}
              
              <div style="background-color: #f9fafb; padding: 30px; ${isUrgent ? '' : 'border-radius: 8px 8px 0 0;'}">
                <h1 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">
                  ${daysRemaining === 1 ? 'Final Notice' : `${daysRemaining}-Day Reminder`}
                </h1>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  This is ${daysRemaining === 1 ? 'your final reminder' : `a ${reminderType} reminder`} that your payment for the <strong>${failure.user_subscriptions.block_name}</strong> subscription failed.
                </p>

                <div style="background-color: ${isUrgent ? '#fee2e2' : '#fff3cd'}; padding: 20px; border-left: 4px solid ${isUrgent ? '#dc2626' : '#f59e0b'}; margin: 25px 0; border-radius: 4px;">
                  <h2 style="color: ${isUrgent ? '#991b1b' : '#92400e'}; font-size: 18px; margin: 0 0 10px 0;">
                    ${daysRemaining === 1 ? '⏰ Access Ends Tomorrow!' : `⏰ ${daysRemaining} Days Remaining`}
                  </h2>
                  <p style="color: ${isUrgent ? '#991b1b' : '#92400e'}; margin: 0; font-size: 14px;">
                    ${daysRemaining === 1 
                      ? 'Your access will be revoked tomorrow if payment is not updated.' 
                      : `You have ${daysRemaining} days to update your payment method to continue access.`
                    }
                  </p>
                </div>

                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
                  <p style="color: #374151; margin: 0 0 10px 0; font-size: 14px;"><strong>Subscription Details:</strong></p>
                  <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Block: ${failure.user_subscriptions.block_name}</p>
                  <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Amount: $${(failure.user_subscriptions.monthly_price_cents / 100).toFixed(2)}/month</p>
                  <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Failed Reason: ${failure.failure_reason}</p>
                  <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Grace Period Ends: ${gracePeriodEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                ${daysRemaining === 1 ? `
                  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0;">
                    <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">
                      ⚠️ What happens if I don't update my payment?
                    </p>
                    <p style="color: #92400e; margin: 10px 0 0 0; font-size: 14px;">
                      Your access to ${failure.user_subscriptions.block_name} will be revoked, and your subscription will be cancelled. You'll need to subscribe again to regain access.
                    </p>
                  </div>
                ` : ''}

                <div style="text-align: center; margin: 35px 0;">
                  <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard/subscriptions" 
                     style="display: inline-block; background-color: ${isUrgent ? '#dc2626' : '#2563eb'}; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    ${isUrgent ? '⚡ Update Payment Now' : 'Update Payment Method'}
                  </a>
                </div>

                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                  Need help? Our support team is here to assist you. Just reply to this email or contact us through your dashboard.
                </p>
              </div>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This is an automated ${reminderType} reminder from Acari
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                  ${daysRemaining === 1 ? 'Final reminder before access revocation' : `Reminder ${daysRemaining} of 7 days grace period`}
                </p>
              </div>
            </div>
          `
        });

        // Update the failure record
        await supabase
          .from('subscription_payment_failures')
          .update({
            last_reminder_sent_at: now.toISOString(),
            reminder_count: (failure.reminder_count || 0) + 1,
          })
          .eq('id', failure.id);

        emailsSent++;
        console.log(`Successfully sent ${reminderType} reminder to ${failure.profiles.email}`);
      } catch (emailError) {
        console.error(`Failed to send email for failure ${failure.id}:`, emailError);
        // Continue with other failures even if one fails
      }
    }

    console.log(`Automated reminder check complete. Sent ${emailsSent} emails.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${emailsSent} automated reminder emails`,
        failuresChecked: failures?.length || 0,
        emailsSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in automated grace period reminders:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});