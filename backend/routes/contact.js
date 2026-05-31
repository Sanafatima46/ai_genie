const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { protect } = require('../middleware/authMiddleware');
const { sendEmail } = require('../services/emailService');

// @route   POST /api/contact
// @desc    Submit contact form (public)
router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400);
      return next(new Error('All fields are required'));
    }

    const entry = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `New contact message from ${entry.firstName} ${entry.lastName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</p>
            <p><strong>Email:</strong> ${entry.email}</p>
            <p><strong>Message:</strong></p>
            <p>${entry.message.replace(/\n/g, '<br>')}</p>
            <p><small>Stored in MongoDB — collection: contactmessages</small></p>
          `,
        });
      } catch {
        // Save succeeded; email is optional
      }
    }

    res.status(201).json({
      message: 'Message sent successfully',
      id: entry._id,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/contact
// @desc    List all contact messages (admin only)
router.get('/', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Admin access required to view messages'));
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
