import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
  MapPin,
  Check,
  X,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

export const MentorshipPage = () => {
  const { user } = useAuth();
  const isAlumni = user?.role === 'ALUMNI';

  const [activeTab, setActiveTab] = useState(isAlumni ? 'received' : 'sent');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'received' ? '/mentorship/received' : '/mentorship/sent';
      const res = await api.get(endpoint);
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      console.warn('Mentorship fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoadingId(id);
    try {
      const res = await api.patch(`/mentorship/${id}/status`, { status });
      if (res.success) {
        toast.success(`Request ${status.toLowerCase()} successfully!`);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this mentorship request?')) return;
    setActionLoadingId(id);
    try {
      const res = await api.patch(`/mentorship/${id}/cancel`);
      if (res.success) {
        toast.success('Mentorship request cancelled.');
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.message || 'Cancel failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#173B6C] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Mentorship Hub</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
            {isAlumni
              ? 'Review incoming requests from students, schedule guidance calls, and share industry insights.'
              : 'Track your mentorship requests to alumni, review their response notes, and prepare for placement rounds.'}
          </p>
        </div>

        {/* Tab switchers if user has both or wants to view */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-xs">
          {isAlumni && (
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'received' ? 'bg-white text-[#173B6C] shadow-xs' : 'text-white hover:bg-white/10'
              }`}
            >
              Received Requests
            </button>
          )}
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'sent' ? 'bg-white text-[#173B6C] shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Sent Requests
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading requests...</div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => {
              const otherUser = activeTab === 'received' ? req.studentId : req.alumniId;
              return (
                <div
                  key={req._id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      {otherUser?.profileImage ? (
                        <img
                          src={otherUser.profileImage}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#173B6C] text-white flex items-center justify-center font-bold text-base shrink-0">
                          {otherUser?.name?.charAt(0) || 'U'}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {otherUser?.name || 'User'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            req.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : req.status === 'CANCELLED'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {activeTab === 'received'
                            ? `${otherUser?.degree || 'Student'} ${otherUser?.department || ''} · Batch of ${otherUser?.graduationYear || ''}`
                            : `${otherUser?.jobTitle || 'Alum'} at ${otherUser?.company || 'Industry'}`}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <span className="text-[#2563EB]">Topic:</span> {req.topic}
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          {req.preferredMode === 'Online' ? <Video className="w-3.5 h-3.5 text-purple-600" /> : <MapPin className="w-3.5 h-3.5" />}
                          {req.preferredMode} ({req.preferredTime})
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "{req.message}"
                      </p>
                    </div>

                    {req.responseNote && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                        <strong className="block font-bold mb-0.5">Response Note from Mentor:</strong>
                        <span>{req.responseNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    {activeTab === 'received' && req.status === 'PENDING' && (
                      <>
                        <button
                          disabled={actionLoadingId === req._id}
                          onClick={() => handleStatusUpdate(req._id, 'ACCEPTED')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          disabled={actionLoadingId === req._id}
                          onClick={() => handleStatusUpdate(req._id, 'REJECTED')}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab === 'sent' && req.status === 'PENDING' && (
                      <button
                        disabled={actionLoadingId === req._id}
                        onClick={() => handleCancelRequest(req._id)}
                        className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition"
                      >
                        Cancel Request
                      </button>
                    )}

                    {req.status === 'ACCEPTED' && (
                      <button
                        disabled={actionLoadingId === req._id}
                        onClick={() => handleStatusUpdate(req._id, 'COMPLETED')}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No {activeTab} mentorship requests
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeTab === 'sent'
                ? 'You have not sent any mentorship requests yet. Browse the alumni directory to connect with a mentor.'
                : 'You do not have any incoming mentorship requests from students.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
