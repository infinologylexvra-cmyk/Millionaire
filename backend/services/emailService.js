const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const emailWrapper = (title, bodyHtml) => `
  <div style="background:#0a0a0a;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#121212;border:1px solid #2a2210;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#d4af37,#f5d76e);padding:24px;text-align:center;">
        <h1 style="margin:0;color:#0a0a0a;font-size:22px;letter-spacing:2px;">MILLIONAIRE NUMBERS</h1>
        <p style="margin:4px 0 0;color:#3a2f06;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Exclusive Numbers &middot; Exclusive You</p>
      </div>
      <div style="padding:32px;color:#eae0c4;">
        <h2 style="color:#f5d76e;font-size:18px;margin-top:0;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:16px 32px;color:#6b6248;font-size:12px;text-align:center;border-top:1px solid #2a2210;">
        &copy; ${new Date().getFullYear()} Millionaire Numbers. All rights reserved.
      </div>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`[emailService] Email not configured - skipping send to ${to} ("${subject}")`);
    return { skipped: true };
  }
  const mailTransporter = getTransporter();
  return mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || `"Millionaire Numbers" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendOTPEmail = (to, otp, name = '') => {
  const html = emailWrapper(
    'Your Verification Code',
    `<p>Hi ${name || 'there'},</p>
     <p>Use the code below to verify your account. This code expires in 10 minutes.</p>
     <p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#f5d76e;text-align:center;margin:24px 0;">${otp}</p>
     <p>If you didn't request this, you can safely ignore this email.</p>`
  );
  return sendEmail({ to, subject: 'Your Millionaire Numbers verification code', html });
};

const sendWelcomeEmail = (to, name) => {
  const html = emailWrapper(
    `Welcome, ${name}!`,
    `<p>Your account has been created successfully. Start browsing India's most exclusive VIP and fancy mobile numbers.</p>`
  );
  return sendEmail({ to, subject: 'Welcome to Millionaire Numbers', html });
};

const sendOrderConfirmationEmail = (to, order) => {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;color:#eae0c4;">${i.phoneNumber}</td><td style="padding:8px 0;text-align:right;color:#f5d76e;">Rs. ${i.price.toLocaleString('en-IN')}</td></tr>`
    )
    .join('');
  const html = emailWrapper(
    'Order Confirmed',
    `<p>Thank you for your purchase! Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;">${itemsHtml}</table>
     <p style="text-align:right;font-size:18px;color:#f5d76e;">Total: Rs. ${order.totalAmount.toLocaleString('en-IN')}</p>
     <p>Our team will contact you shortly to complete SIM delivery / porting formalities.</p>`
  );
  return sendEmail({ to, subject: `Order Confirmed - ${order.orderNumber}`, html });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
};
