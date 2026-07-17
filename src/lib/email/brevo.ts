// Email sending via Gmail SMTP (nodemailer).
// Keeps the same exported interface the rest of the app expects
// (this module was previously backed by the Brevo API).
import nodemailer, { type Transporter } from 'nodemailer';

interface EmailParams {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}

interface SendResponse {
  messageId: string;
}

// Gmail's daily sending cap for a regular account (~500 recipients/day).
// SMTP has no "credits" concept, so we surface this constant to the
// admin dashboard in place of the old Brevo credit balance.
const GMAIL_DAILY_LIMIT = 500;

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user) throw new Error('SMTP_USER is not set');
  if (!pass) throw new Error('SMTP_PASS is not set');

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true, // implicit TLS on 465
    auth: { user, pass },
  });

  return transporter;
}

export async function getRemainingCredits(): Promise<number> {
  // No provider-side credit balance with SMTP; report the nominal daily cap.
  return GMAIL_DAILY_LIMIT;
}

export async function sendEmail(params: EmailParams): Promise<SendResponse> {
  const senderName = process.env.SENDER_NAME || 'KSAE 공지봇';
  // Gmail requires the From address to be the authenticated account
  // (or one of its verified aliases), so fall back to SMTP_USER.
  const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;
  if (!senderEmail) throw new Error('SENDER_EMAIL / SMTP_USER is not set');

  const info = await getTransporter().sendMail({
    from: { name: senderName, address: senderEmail },
    to: params.to.name
      ? { name: params.to.name, address: params.to.email }
      : params.to.email,
    subject: params.subject,
    html: params.htmlContent,
  });

  return { messageId: info.messageId };
}
