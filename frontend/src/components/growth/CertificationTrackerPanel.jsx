import { useState, useEffect } from 'react';
import { Award, Plus, Trash2, AlertTriangle } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, btnSecondary, cardClass, inputClass } from './growthUtils';

const emptyForm = {
  name: '',
  issuer: '',
  credentialId: '',
  issueDate: '',
  expiryDate: '',
  reminderDays: 30,
  notes: '',
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CertificationTrackerPanel() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await apiClient.get('/growth/certifications');
    setCerts(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/growth/certifications', form);
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await apiClient.delete(`/growth/certifications/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={22} />
            <h2 className="text-lg font-bold text-white">Certification tracker</h2>
          </div>
          <button type="button" onClick={() => setShowForm(!showForm)} className={btnPrimary()}>
            <Plus size={16} /> Add
          </button>
        </div>

        {showForm && (
          <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['name', 'Certification name'],
              ['issuer', 'Issuer'],
              ['credentialId', 'Credential ID'],
              ['issueDate', 'Issue date', 'date'],
              ['expiryDate', 'Expiry date', 'date'],
              ['reminderDays', 'Remind days before expiry', 'number'],
            ].map(([key, label, type = 'text']) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-slate-400">{label}</label>
                <input
                  type={type}
                  className={inputClass()}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  required={key === 'name' || key === 'issuer' || key === 'issueDate'}
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimary()}>
                Save certification
              </button>
              <button type="button" onClick={() => setShowForm(false)} className={btnSecondary()}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid gap-4">
        {certs.map((c) => {
          const days = daysUntil(c.expiryDate);
          const expiring = days !== null && days <= (c.reminderDays || 30) && days >= 0;
          const expired = days !== null && days < 0;
          return (
            <div key={c._id} className={cardClass()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-white">{c.name}</p>
                  <p className="text-sm text-slate-400">{c.issuer}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Issued: {new Date(c.issueDate).toLocaleDateString()}
                    {c.expiryDate && ` · Expires: ${new Date(c.expiryDate).toLocaleDateString()}`}
                  </p>
                  {(expiring || expired) && (
                    <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${expired ? 'text-red-400' : 'text-amber-400'}`}>
                      <AlertTriangle size={14} />
                      {expired ? 'Expired' : `Expires in ${days} days`}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => remove(c._id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {certs.length === 0 && (
          <p className="text-center text-sm text-slate-500">No certifications tracked yet.</p>
        )}
      </div>
    </div>
  );
}
