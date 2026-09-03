const { sendContactEmail, sendNewsletterEmail } = require('../utils/mailer');
const { ok, fail } = require('../utils/apiResponse');

const submitContactMessage = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const category = String(req.body.category || 'General Inquiry').trim();
  const subject = String(req.body.subject || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return fail(res, 400, 'MISSING_FIELDS', 'Name, email, and message are required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return fail(res, 400, 'INVALID_EMAIL', 'Please provide a valid email address.');
  }

  try {
    const result = await sendContactEmail({
      name,
      email,
      category,
      subject,
      message,
    });

    return ok(res, {
      success: true,
      delivered: Boolean(result.sent),
      message: 'Your message has been sent to focusorahq@gmail.com. We will get back to you shortly!',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Contact Error]', error);
    return fail(res, 500, 'EMAIL_SEND_FAILED', 'Failed to dispatch email. Please try again or email focusorahq@gmail.com directly.');
  }
};

const subscribeNewsletter = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!email) {
    return fail(res, 400, 'EMAIL_REQUIRED', 'Please enter your email address.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return fail(res, 400, 'INVALID_EMAIL', 'Please enter a valid email address.');
  }

  try {
    await sendNewsletterEmail({ email });

    return ok(res, {
      success: true,
      message: 'Subscription successful! Check your email for confirmation.',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Newsletter Error]', error);
    return fail(res, 500, 'SUBSCRIPTION_FAILED', 'Failed to subscribe. Please try again.');
  }
};

module.exports = { submitContactMessage, subscribeNewsletter };
