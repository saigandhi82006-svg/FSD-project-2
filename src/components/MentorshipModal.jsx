import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

export const MentorshipModal = ({ alumnus, onClose, onSuccess }) => {
  const [topic, setTopic] = useState('Placement Preparation');
  const [message, setMessage] = useState(
    `Hi ${alumnus?.name || 'Sir/Ma\'am'}, I am a student preparing for campus placements and would love your guidance. Could we connect for a brief session? Thank you!`
  );
  const [preferredMode, setPreferredMode] = useState('Online');
  const [preferredTime, setPreferredTime] = useState('Weekends (Evenings IST)');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const topicsList = [
    'Placement Preparation',
    'Resume Review',
    'DSA & Coding Interviews',
    'GATE Preparation',
    'Higher Studies',
    'Internship Search',
    'Career Guidance',
    'Startup Guidance',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message for the alumnus.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/mentorship', {
        alumniId: alumnus._id,
        topic,
        message,
        preferredMode,
        preferredTime
      });

      if (res.success) {
        setSentSuccess(true);
        toast.success('Mentorship request sent successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send mentorship request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!sentSuccess ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Mentorship</h3>
                <p className="text-xs text-slate-500">
                  Connect with <strong className="text-slate-700">{alumnus?.name}</strong> ({alumnus?.company || 'Alumnus'})
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic *
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {topicsList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1500}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                  placeholder="Introduce yourself, mention your branch, year, and specific questions you have..."
                  required
                />
                <p className="text-[11px] text-slate-400 text-right mt-1">
                  {message.length} / 1500 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Mode *
                  </label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online">Online Video / Voice</option>
                    <option value="In person">In Person (Campus/City)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="e.g. Sat 4 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Your mentorship request has been sent!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
              You will be notified once <strong className="text-slate-800">{alumnus?.name}</strong> responds to your request. You can check the status anytime in your Mentorship tab.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#173B6C] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipModal;
