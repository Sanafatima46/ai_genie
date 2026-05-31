import { useState, useEffect } from 'react';
import { Users, MessageCircle, Loader2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass, inputClass } from './growthUtils';

export default function MentorConnectPanel() {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/growth/mentors'),
      apiClient.get('/growth/mentors/requests'),
    ]).then(([m, r]) => {
      setMentors(m.data);
      setRequests(r.data);
    }).catch(() => {});
  }, []);

  const connect = async (e) => {
    e.preventDefault();
    if (!selected || !message.trim()) return;
    setLoading(true);
    setToast('');
    try {
      await apiClient.post('/growth/mentors/connect', {
        mentorId: selected._id,
        message: message.trim(),
      });
      setToast(`Request sent to ${selected.name}!`);
      setMessage('');
      setSelected(null);
      const { data } = await apiClient.get('/growth/mentors/requests');
      setRequests(data);
    } catch (err) {
      setToast(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((m) => (
          <div
            key={m._id}
            className={`${cardClass()} cursor-pointer transition ${
              selected?._id === m._id ? 'border-sky-400/50 ring-1 ring-sky-400/30' : 'hover:border-white/20'
            }`}
            onClick={() => setSelected(m)}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-purple-400 text-lg font-bold text-white">
                {m.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{m.name}</p>
                <p className="text-sm text-slate-400">{m.title}</p>
                {m.company && <p className="text-xs text-slate-500">{m.company}</p>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {(m.expertise || []).slice(0, 3).map((e) => (
                    <span key={e} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-sky-300">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {m.bio && <p className="mt-3 text-xs text-slate-400">{m.bio}</p>}
          </div>
        ))}
      </div>

      {selected && (
        <div className={cardClass()}>
          <div className="mb-3 flex items-center gap-2">
            <MessageCircle className="text-sky-400" size={20} />
            <h3 className="font-bold text-white">Connect with {selected.name}</h3>
          </div>
          <form onSubmit={connect} className="space-y-3">
            <textarea
              className={`${inputClass()} min-h-[100px]`}
              placeholder="Introduce yourself and what you'd like guidance on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className={btnPrimary()}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Users size={16} />}
              Send connection request
            </button>
          </form>
          {toast && <p className="mt-2 text-sm text-emerald-400">{toast}</p>}
        </div>
      )}

      {requests.length > 0 && (
        <div className={cardClass()}>
          <h3 className="mb-3 font-bold text-white">Your requests</h3>
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r._id} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
                <span className="font-semibold text-white">{r.mentor?.name}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  r.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
