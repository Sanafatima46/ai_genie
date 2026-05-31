import { useState, useEffect } from 'react';
import { Bell, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, btnSecondary, cardClass, inputClass } from './growthUtils';

const DEFAULT_SETTINGS = {
  enabled: false,
  reminderTime: '09:00',
  timezone: 'UTC',
  message: 'Time for your daily learning session! Keep building your skills.',
};

export default function LearningReminderPanel() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    apiClient
      .get('/growth/reminders')
      .then(({ data }) => {
        setSettings({
          enabled: Boolean(data.enabled),
          reminderTime: data.reminderTime || '09:00',
          timezone: data.timezone || 'UTC',
          message: data.message || DEFAULT_SETTINGS.message,
        });
      })
      .catch(() => setToast('Could not load reminder settings. Is backend running?'))
      .finally(() => setInitialLoading(false));
  }, []);

  const save = async () => {
    setLoading(true);
    setToast('');
    setSaved(false);
    try {
      const payload = {
        enabled: settings.enabled,
        reminderTime: settings.reminderTime,
        timezone: settings.timezone,
        message: settings.message,
      };
      const { data } = await apiClient.put('/growth/reminders', payload);
      setSettings({
        enabled: Boolean(data.enabled),
        reminderTime: data.reminderTime || '09:00',
        timezone: data.timezone || 'UTC',
        message: data.message || DEFAULT_SETTINGS.message,
      });
      setSaved(true);
      setToast(
        data.enabled
          ? `Reminder saved! Email will be sent daily at ${data.reminderTime} (server time).`
          : 'Reminder disabled and saved.'
      );
    } catch (err) {
      setToast(err.response?.data?.message || 'Save failed — login again or restart backend.');
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    setLoading(true);
    setToast('');
    try {
      await apiClient.post('/growth/reminders/test', { message: settings.message });
      setToast('Test email sent! Check your inbox (and spam folder).');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('SMTP') || msg.includes('configured')) {
        setToast(
          'Email not configured yet. Add SMTP_HOST, SMTP_USER, SMTP_PASS in backend/.env — then restart backend.'
        );
      } else {
        setToast(msg || 'Test email failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={`${cardClass()} flex items-center justify-center py-16`}>
        <Loader2 className="animate-spin text-sky-400" size={32} />
      </div>
    );
  }

  return (
    <div className={cardClass()}>
      <div className="mb-6 flex items-center gap-2">
        <Bell className="text-sky-400" size={22} />
        <h2 className="text-lg font-bold text-white">Daily learning reminder</h2>
        {saved && (
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
      </div>

      <label className="mb-4 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => {
            setSaved(false);
            setSettings((s) => ({ ...s, enabled: e.target.checked }));
          }}
          className="h-5 w-5 accent-sky-400"
        />
        <span className="text-slate-300">Enable daily email reminders</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Reminder time (server timezone)</label>
          <input
            type="time"
            className={inputClass()}
            value={settings.reminderTime}
            onChange={(e) => {
              setSaved(false);
              setSettings((s) => ({ ...s, reminderTime: e.target.value }));
            }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Timezone label</label>
          <input
            className={inputClass()}
            value={settings.timezone}
            onChange={(e) => {
              setSaved(false);
              setSettings((s) => ({ ...s, timezone: e.target.value }));
            }}
            placeholder="UTC"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs text-slate-400">Custom message</label>
        <textarea
          className={`${inputClass()} min-h-[80px] resize-y`}
          value={settings.message}
          onChange={(e) => {
            setSaved(false);
            setSettings((s) => ({ ...s, message: e.target.value }));
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={loading} className={btnPrimary()}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          Save settings
        </button>
        <button type="button" onClick={sendTest} disabled={loading} className={btnSecondary()}>
          <Mail size={16} /> Send test email
        </button>
      </div>

      {toast && (
        <p
          className={`mt-4 text-sm ${
            toast.includes('failed') || toast.includes('not configured') || toast.includes('Could not')
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {toast}
        </p>
      )}

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">How it works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li><strong className="text-slate-300">Save settings</strong> — works without email (stored in MongoDB).</li>
          <li><strong className="text-slate-300">Test email / daily send</strong> — needs SMTP in backend/.env.</li>
          <li>Gmail: use App Password, not your normal password.</li>
        </ul>
      </div>
    </div>
  );
}
