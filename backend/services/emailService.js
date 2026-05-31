const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter();
  if (!transport) {
    const err = new Error(
      'Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env'
    );
    err.statusCode = 503;
    throw err;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return transport.sendMail({
    from: `"HireGenie AI" <${from}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });
}

async function sendLearningReminder({ to, name, message }) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0f0c29;color:#e2e8f0;border-radius:16px;">
      <h2 style="color:#38bdf8;margin:0 0 12px;">Daily Learning Reminder</h2>
      <p>Hi ${name || 'there'},</p>
      <p>${message}</p>
      <p style="margin-top:24px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/growth" style="background:linear-gradient(90deg,#38bdf8,#a855f7);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Open Growth Hub
        </a>
      </p>
      <p style="color:#64748b;font-size:12px;margin-top:32px;">HireGenie AI — From Resume to Recruitment</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Your daily learning reminder — HireGenie AI',
    html,
  });
}

module.exports = { sendEmail, sendLearningReminder, getTransporter };
