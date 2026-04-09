const nodemailer = require('nodemailer');
const { env } = require('../config/env');

const isMailerConfigured = () => {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.emailFrom);
};

const getTransporter = () => {
  if (!isMailerConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

const buildVerificationEmail = ({ name, verifyUrl }) => {
  const subject = 'Verify your FocusoraHQ email';
  const safeName = name || 'there';

  return {
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 16px">Verify your email</h2>
        <p>Hi ${safeName},</p>
        <p>Welcome to FocusoraHQ. Click the button below to verify your email address.</p>
        <p style="margin:24px 0">
          <a href="${verifyUrl}" style="background:#2563eb;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Verify email</a>
        </p>
        <p>If the button does not work, paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
    text: `Verify your email: ${verifyUrl}`,
  };
};

const sendVerificationEmail = async ({ to, name, verifyUrl }) => {
  const { subject, html, text } = buildVerificationEmail({ name, verifyUrl });
  const transporter = getTransporter();

  if (!transporter) {
    // Development fallback: keep the flow testable even without SMTP.
    // The URL is still generated and can be opened manually from logs.
    // eslint-disable-next-line no-console
    console.log('[Email] Verification link for', to, verifyUrl);
    return { sent: false, previewUrl: verifyUrl };
  }

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
};

module.exports = { sendVerificationEmail, isMailerConfigured };
