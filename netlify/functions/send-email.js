// /netlify/functions/send-email.js
import { Resend } from "resend";

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const { email, message, captchaToken } = JSON.parse(event.body || "{}");

  if (!email || !message || !captchaToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fields" })
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "no-reply@imformaltime.com",
      to: "support@imformaltime.com",
      subject: `New message from ${email}`,
      text: `From: ${email}\n\n${message}`
    });

    if (result.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Resend error", details: result.error })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
}
