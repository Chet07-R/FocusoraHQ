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

const sendContactEmail = async ({ name, email, category, subject, message }) => {
  const transporter = getTransporter();
  const mailSubject = `[FocusoraHQ Contact] ${subject || 'New Message'} (${category || 'General'})`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px">
      <div style="background:#2563eb;padding:16px 20px;border-radius:8px;color:#ffffff;margin-bottom:20px">
        <h2 style="margin:0;font-size:20px">New Contact Inquiry from FocusoraHQ</h2>
      </div>
      
      <p style="margin:0 0 12px"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p style="margin:0 0 12px"><strong>Topic Category:</strong> ${category || 'General Inquiry'}</p>
      <p style="margin:0 0 12px"><strong>Subject:</strong> ${subject || 'N/A'}</p>
      
      <div style="margin:20px 0;padding:16px;background:#f8fafc;border-left:4px solid #2563eb;border-radius:4px">
        <p style="margin:0 0 8px;font-weight:bold">Message:</p>
        <p style="margin:0;white-space:pre-wrap;color:#334155">${message}</p>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
      <p style="font-size:12px;color:#64748b;margin:0">Received via FocusoraHQ Contact Portal.</p>
    </div>
  `;

  const text = `New Contact Form Message:\n\nFrom: ${name} (${email})\nCategory: ${category}\nSubject: ${subject}\n\nMessage:\n${message}`;

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log('[Email - Fallback] Contact message for focusorahq@gmail.com:', { name, email, category, subject, message });
    return { sent: false };
  }

  await transporter.sendMail({
    from: env.emailFrom,
    to: 'focusorahq@gmail.com',
    replyTo: email,
    subject: mailSubject,
    text,
    html,
  });

  return { sent: true };
};

const sendNewsletterEmail = async ({ email }) => {
  const transporter = getTransporter();

  const subscriberHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff">
      <div style="background:linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);padding:20px;border-radius:12px;color:#ffffff;text-align:center;margin-bottom:20px">
        <h1 style="margin:0;font-size:24px">Welcome to FocusoraHQ!</h1>
      </div>
      <p>Hi there,</p>
      <p>Thank you for subscribing to the <strong>FocusoraHQ Newsletter</strong>! You will now receive our curated study tips, deep work strategies, and new feature drops straight to your inbox.</p>
      <p style="margin:24px 0;text-align:center">
        <a href="${env.clientUrl || 'http://localhost:5173'}/my-space" style="background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Open Your Study Space</a>
      </p>
      <p style="color:#64748b;font-size:12px;text-align:center;margin-top:24px">© 2026 FocusoraHQ. All rights reserved.</p>
    </div>
  `;

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log('[Email - Fallback] Newsletter subscription for', email);
    return { sent: false };
  }

  // Send confirmation to user
  await transporter.sendMail({
    from: env.emailFrom,
    to: email,
    subject: 'Welcome to FocusoraHQ — Subscription Confirmed!',
    text: 'Thank you for subscribing to FocusoraHQ updates! Welcome aboard.',
    html: subscriberHtml,
  });

  // Notify focusorahq@gmail.com
  await transporter.sendMail({
    from: env.emailFrom,
    to: 'focusorahq@gmail.com',
    subject: `[FocusoraHQ Newsletter] New Subscriber: ${email}`,
    text: `New user subscribed to newsletter: ${email}`,
    html: `<p><strong>New Subscriber:</strong> ${email}</p><p>Subscribed on ${new Date().toUTCString()}</p>`,
  });

  return { sent: true };
};

module.exports = { sendVerificationEmail, sendContactEmail, sendNewsletterEmail, isMailerConfigured };
