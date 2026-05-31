const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendEmail, getTransporter } = require('../services/emailService');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const authResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Please add all fields'));
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({ name, email, password, authProvider: 'local' });
    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide email and password'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    if (!user.password) {
      res.status(401);
      return next(new Error('This account uses Google sign-in. Please continue with Google.'));
    }

    if (await user.matchPassword(password)) {
      res.json(authResponse(user));
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/google
router.post('/google', async (req, res, next) => {
  const { credential } = req.body;
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();

  if (!clientId) {
    res.status(503);
    return next(new Error('Google sign-in is not configured. Add GOOGLE_CLIENT_ID to backend/.env and restart server.'));
  }

  if (!credential) {
    res.status(400);
    return next(new Error('Google credential is required'));
  }

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    if (!email) {
      res.status(400);
      return next(new Error('Google account email not available'));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, { email: emailRegex }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.avatar = picture;
        if (user.email !== normalizedEmail) user.email = normalizedEmail;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId,
        authProvider: 'google',
        avatar: picture,
      });
    }

    res.json(authResponse(user));
  } catch (error) {
    console.error('Google auth error:', error.message);

    if (error.code === 11000) {
      res.status(400);
      return next(new Error('An account with this email already exists. Try logging in with email/password.'));
    }

    res.status(401);
    let message = 'Google sign-in failed. Please try again.';

    if (error.message?.includes('audience') || error.message?.includes('Audience')) {
      message = 'Client ID mismatch. Ensure GOOGLE_CLIENT_ID (backend) and VITE_GOOGLE_CLIENT_ID (frontend) are identical, then restart both servers.';
    } else if (error.message?.includes('Token used too late') || error.message?.includes('expired')) {
      message = 'Google session expired. Please try again.';
    } else if (process.env.NODE_ENV !== 'production') {
      message = `Google sign-in failed: ${error.message}`;
    }

    next(new Error(message));
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;

  if (!email?.trim()) {
    res.status(400);
    return next(new Error('Email is required'));
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const genericMessage = 'If an account exists with this email, a password reset link has been sent.';

    if (!user || !user.password) {
      return res.json({ message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    let emailSent = false;
    if (getTransporter()) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Reset your HireGenie AI password',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
              <h2>Password Reset</h2>
              <p>Hi ${user.name},</p>
              <p>Click the button below to reset your password. This link expires in 1 hour.</p>
              <a href="${resetUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
              <p style="margin-top:24px;font-size:12px;color:#64748b;">If you did not request this, ignore this email.</p>
            </div>
          `,
        });
        emailSent = true;
      } catch {
        emailSent = false;
      }
    }

    res.json({
      message: emailSent ? genericMessage : 'Reset link created. Check below if email is not configured.',
      resetUrl: emailSent ? undefined : resetUrl,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password || password.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters'));
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      return next(new Error('Invalid or expired reset link'));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.authProvider = 'local';
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.', ...authResponse(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
