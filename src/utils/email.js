import emailjs from '@emailjs/browser';

let initialized = false;

function ensureInit() {
  if (initialized) return;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    console.warn('[EmailJS] Missing VITE_EMAILJS_PUBLIC_KEY; email sending disabled.');
    return;
  }
  try {
    emailjs.init(publicKey);
    initialized = true;
    // console.debug('[EmailJS] Initialized');
  } catch (e) {
    console.warn('[EmailJS] Init failed:', e);
  }
}

export async function sendEmail(params = {}, templateId) {
  ensureInit();
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const resolvedTemplateId = templateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  if (!serviceId || !resolvedTemplateId) {
    console.warn('[EmailJS] Missing service/template ID; skipping send.');
    return;
  }

  try {
    await emailjs.send(serviceId, resolvedTemplateId, params);
  } catch (err) {
    console.warn('[EmailJS] Send failed:', err);
  }
}

export function sendWelcomeEmail({ email, name }) {
  // Templates commonly expect keys like user_email, user_name
  return sendEmail({ user_email: email, user_name: name, email_type: 'welcome' });
}

export function sendSignInAlert({ email, name, provider = 'password' }) {
  return sendEmail({ user_email: email, user_name: name, provider, email_type: 'signin' });
}
