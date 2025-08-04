import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (ctx, { to, subject, html }) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set. Skipping email sending.");
      return { success: false, message: "Resend API key not configured." };
    }

    const resend = new Resend(resendApiKey);

    try {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified Resend domain
        to: to,
        subject: subject,
        html: html,
      });

      if (error) {
        console.error("Failed to send email:", error);
        return { success: false, message: error.message };
      }

      console.log("Email sent successfully:", data);
      return { success: true, message: "Email sent successfully." };
    } catch (error) {
      console.error("Error in sendEmail action:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  },
});