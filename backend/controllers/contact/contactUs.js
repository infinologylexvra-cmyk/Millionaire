const Contact = require('../../models/Contact');
const { success } = require('../../helpers/response');
const { sendEmail } = require('../../services/emailService');

const contactUs = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({ name, email, phone, subject, message });

    sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission - ' + (subject || 'General'),
      html: '<p>From: ' + name + ' (' + email + ', ' + (phone || '-') + ')</p><p>' + message + '</p>',
    }).catch(() => {});

    return success(
      res,
      201,
      'Thank you for reaching out! We will get back to you within 24 hours.',
      contact
    );
  } catch (err) {
    next(err);
  }
};

module.exports = contactUs;
