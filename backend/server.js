require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,   // your Gmail address
        pass: process.env.SMTP_PASS    // Gmail app password (not your login password)
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'priyankac.work@gmail.com',
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h2 style="font-size: 18px; font-weight: 500; margin-bottom: 16px;">New message from your portfolio</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b6b6b; width: 80px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b6b6b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding: 8px 0; color: #6b6b6b;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 0.5px solid #e5e5e5; margin: 16px 0;" />
          <p style="font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Fallback: serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
