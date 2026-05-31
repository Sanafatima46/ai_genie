import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass, inputClass } from './growthUtils';

export default function SuccessStoriesPanel() {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ title: '', story: '', role: '', company: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await apiClient.get('/growth/stories');
    setStories(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/growth/stories', form);
      setForm({ title: '', story: '', role: '', company: '' });
      setShowForm(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" size={22} />
            <h2 className="text-lg font-bold text-white">Success stories</h2>
          </div>
          <button type="button" onClick={() => setShowForm(!showForm)} className={btnPrimary()}>
            Share your journey
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input
              className={inputClass()}
              placeholder="Story title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputClass()}
                placeholder="Role you got"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
              <input
                className={inputClass()}
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <textarea
              className={`${inputClass()} min-h-[120px]`}
              placeholder="Tell us how HireGenie helped you land the job..."
              value={form.story}
              onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
              required
            />
            <button type="submit" disabled={submitting} className={btnPrimary()}>
              <Send size={16} /> Publish story
            </button>
          </form>
        )}
      </div>

      <div className="grid gap-4">
        {stories.map((s) => (
          <div key={s._id} className={cardClass()}>
            <p className="font-bold text-white">{s.title}</p>
            <p className="mt-1 text-xs text-sky-400">
              {s.authorName}
              {s.role && ` · ${s.role}`}
              {s.company && ` @ ${s.company}`}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{s.story}</p>
          </div>
        ))}
        {stories.length === 0 && (
          <p className="text-center text-sm text-slate-500">Be the first to share your success!</p>
        )}
      </div>
    </div>
  );
}
