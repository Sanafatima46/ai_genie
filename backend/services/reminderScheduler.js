const cron = require('node-cron');
const LearningReminder = require('../models/LearningReminder');
const User = require('../models/User');
const { sendLearningReminder } = require('./emailService');

function parseTime(timeStr) {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  return { hour: h || 9, minute: m || 0 };
}

function shouldSendToday(reminder) {
  if (!reminder.enabled) return false;
  if (!reminder.lastSentAt) return true;
  const last = new Date(reminder.lastSentAt);
  const now = new Date();
  return last.toDateString() !== now.toDateString();
}

async function sendReminderForUser(reminder) {
  if (!shouldSendToday(reminder)) return;

  const user = await User.findById(reminder.user);
  if (!user?.email) return;

  await sendLearningReminder({
    to: user.email,
    name: user.name,
    message: reminder.message,
  });

  reminder.lastSentAt = new Date();
  await reminder.save();
}

function startReminderScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    try {
      const reminders = await LearningReminder.find({ enabled: true });
      for (const reminder of reminders) {
        const { hour, minute } = parseTime(reminder.reminderTime);
        if (hour === currentHour && minute === currentMinute) {
          await sendReminderForUser(reminder);
        }
      }
    } catch (err) {
      console.error('Reminder scheduler error:', err.message);
    }
  });

  console.log('Daily learning reminder scheduler started');
}

module.exports = { startReminderScheduler, sendReminderForUser };
