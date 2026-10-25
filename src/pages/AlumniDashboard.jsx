import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  MessageSquare,
  Briefcase,
  Calendar,
  Check,
  X,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  Building,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

export const AlumniDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    profileViews: user?.profileViews || 0,
    totalRequests: 0,
    activeMentorships: 0,
    jobsPosted: 0
  });
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAlumniData = async () => {
    setLoading(true);
    try {
      const [requestsRes, jobsRes, meRes] = await Promise.allSettled([
        api.get('/mentorship/received'),
        api.get('/jobs/me'),
        api.get('/auth/me')
      ]);

      const requests = requestsRes.status === 'fulfilled' && requestsRes.value.success ? requestsRes.value.data : [];
      const jobs = jobsRes.status === 'fulfilled' && jobsRes.value.success ? jobsRes.value.data : [];
      const profile = meRes.status === 'fulfilled' && meRes.value.success ? meRes.value.data.user : user;

      const activeCount = requests.filter(r => r.status === 'ACCEPTED').length;

      setStats({
        profileViews: profile?.profileViews || 48,
        totalRequests: requests.length,
        activeMentorships: activeCount,
        jobsPosted: jobs.length
      });

      setIncomingRequests(requests);
      setMyJobs(jobs.slice(0, 4));
    } catch (err) {
      console.warn('Alumni dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const handleRespondRequest = async (requestId, newStatus) => {
    setActionLoadingId(requestId);
    try {
      const res = await api.patch(`/mentorship/${requestId}/status`, {
        status: newStatus,
        responseNote: newStatus === 'ACCEPTED'
          ? 'Glad to connect! I will reach out on email/Meet to schedule our session.'
          : 'Thank you for reaching out. Currently occupied, wish you the best!'
      });

      if (res.success) {
        toast.success(`Request ${newStatus.toLowerCase()} successfully!`);
        fetchAlumniData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update request');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Role-Specific Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#173B6C] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Alum'}! 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Your experience can inspire the next generation of students. Thank you for contributing to your alma mater's community.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 backdrop-blur-xs flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {user?.company || 'Industry Leader'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 ${
              user?.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 text-slate-900'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.verificationStatus || 'PENDING'}
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Profile Views"
            value={stats.profileViews}
            icon={Eye}
            color="blue"
            subtitle="Student visits"
          />
          <StatCard
            title="Mentorship Requests"
            value={stats.totalRequests}
            icon={MessageSquare}
            color="amber"
            subtitle="Incoming requests"
          />
          <StatCard
            title="Active Mentorships"
            value={stats.activeMentorships}
            icon={UserCheck}
            color="emerald"
            subtitle="Accepted students"
          />
          <StatCard
            title="Jobs Posted"
            value={stats.jobsPosted}
            icon={Briefcase}
            color="purple"
            subtitle="Opportunities shared"
          />
        </div>

        {/* Quick Action Tiles */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/settings"
              className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-center transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 block">Update Profile</span>
              <span className="text-[10px] text-slate-500">Skills & Bio</span>
            </Link>

            <Link
              to="/jobs"
              className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-center transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 block">Post a Job</span>
              <span className="text-[10px] text-slate-500">Share openings</span>
            </Link>

            <Link
              to="/mentorship"
              className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-center transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 block">Mentorship</span>
              <span className="text-[10px] text-slate-500">Review requests</span>
            </Link>

            <Link
              to="/events"
              className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-center transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 block">College Events</span>
              <span className="text-[10px] text-slate-500">Homecoming & talks</span>
            </Link>
          </div>
        </div>

        {/* Incoming Mentorship Requests */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Incoming Mentorship Requests</h2>
              <p className="text-xs text-slate-500">Students seeking your guidance and placement mentorship</p>
            </div>
            <Link to="/mentorship" className="text-xs font-semibold text-[#2563EB] hover:underline">
              View all requests →
            </Link>
          </div>

          {incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {req.studentId?.profileImage ? (
                        <img
                          src={req.studentId.profileImage}
                          alt={req.studentId.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#173B6C] text-white flex items-center justify-center font-bold text-xs">
                          {req.studentId?.name?.charAt(0) || 'S'}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{req.studentId?.name || 'Student'}</h4>
                        <p className="text-[11px] text-slate-500">
                          {req.studentId?.degree} {req.studentId?.department?.replace('Engineering', 'Engg')} · Batch of {req.studentId?.graduationYear}
                        </p>
                      </div>
                    </div>

                    <div className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] text-[11px] font-semibold mb-2">
                      Topic: {req.topic}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Mode: <strong className="text-slate-700">{req.preferredMode}</strong>
                    </span>

                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={actionLoadingId === req._id}
                          onClick={() => handleRespondRequest(req._id, 'ACCEPTED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          disabled={actionLoadingId === req._id}
                          onClick={() => handleRespondRequest(req._id, 'REJECTED')}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs transition"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No pending mentorship requests right now.</p>
            </div>
          )}
        </section>

        {/* My Posted Jobs Preview */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Job & Internship Posts</h2>
              <p className="text-xs text-slate-500">Track moderation approval and applications</p>
            </div>
            <Link to="/jobs" className="text-xs font-semibold text-[#2563EB] hover:underline">
              Manage jobs →
            </Link>
          </div>

          {myJobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myJobs.map((j) => (
                <div key={j._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{j.title}</h4>
                    <p className="text-[11px] text-slate-500">{j.company} · {j.location} · {j.opportunityType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      j.approvalStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : j.approvalStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {j.approvalStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs">You haven't posted any jobs yet. Share your team's openings to help students!</p>
              <Link to="/jobs" className="mt-2 inline-block text-xs font-bold text-[#2563EB] hover:underline">
                Create first job post →
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AlumniDashboard;
