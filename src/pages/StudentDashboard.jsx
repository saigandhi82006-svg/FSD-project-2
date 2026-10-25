import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  Bookmark,
  Calendar,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import AlumniCard from '../components/AlumniCard';
import MentorshipModal from '../components/MentorshipModal';
import Sidebar from '../components/Sidebar';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    alumniCount: 0,
    mentorshipRequests: 0,
    savedJobsCount: 0,
    upcomingEventsCount: 0
  });
  const [recommendedAlumni, setRecommendedAlumni] = useState([]);
  const [recentMentorships, setRecentMentorships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [alumniRes, requestsRes, savedJobsRes, eventsRes, notifRes] = await Promise.allSettled([
        api.get('/alumni?limit=4&sort=experience_desc'),
        api.get('/mentorship/sent'),
        api.get('/jobs/saved'),
        api.get('/events/me/registrations'),
        api.get('/notifications')
      ]);

      const alumniData = alumniRes.status === 'fulfilled' && alumniRes.value.success ? alumniRes.value.data : [];
      const totalAlumni = alumniRes.status === 'fulfilled' && alumniRes.value.pagination ? alumniRes.value.pagination.total : 0;
      const sentRequests = requestsRes.status === 'fulfilled' && requestsRes.value.success ? requestsRes.value.data : [];
      const savedJobs = savedJobsRes.status === 'fulfilled' && savedJobsRes.value.success ? savedJobsRes.value.data : [];
      const myEvents = eventsRes.status === 'fulfilled' && eventsRes.value.success ? eventsRes.value.data : [];
      const notifs = notifRes.status === 'fulfilled' && notifRes.value.success ? notifRes.value.data : [];

      setStats({
        alumniCount: totalAlumni || 12,
        mentorshipRequests: sentRequests.length,
        savedJobsCount: savedJobs.length,
        upcomingEventsCount: myEvents.length
      });

      setRecommendedAlumni(alumniData);
      setRecentMentorships(sentRequests.slice(0, 3));
      setNotifications(notifs.slice(0, 4));
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Role-Specific Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Personalized Welcome Banner */}
        <div className="bg-gradient-to-r from-[#173B6C] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Discover alumni from {user?.department || 'your department'}, learn from their journeys,
              and take the next step in your career preparation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 backdrop-blur-xs">
              {user?.department || 'Engineering'}
            </span>
            <span className="px-3 py-1 bg-[#F59E0B] text-slate-900 rounded-full text-xs font-bold shadow-xs">
              Batch of {user?.graduationYear || '2026'}
            </span>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Alumni Connections"
            value={stats.alumniCount}
            icon={Users}
            color="blue"
            subtitle="In college network"
          />
          <StatCard
            title="Mentorship Requests"
            value={stats.mentorshipRequests}
            icon={MessageSquare}
            color="amber"
            subtitle="Active / Completed"
          />
          <StatCard
            title="Saved Opportunities"
            value={stats.savedJobsCount}
            icon={Bookmark}
            color="emerald"
            subtitle="Bookmarked jobs"
          />
          <StatCard
            title="Registered Events"
            value={stats.upcomingEventsCount}
            icon={Calendar}
            color="purple"
            subtitle="Campus workshops"
          />
        </div>

        {/* Quick Alumni Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni by name, company (e.g. Microsoft, Google), branch, or skills (e.g. React, Python)..."
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Recommended Alumni Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Alumni Mentors</h2>
              <p className="text-xs text-slate-500">Experienced seniors available for placement and technical guidance</p>
            </div>
            <Link
              to="/directory"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>View all alumni</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedAlumni.map((alumnus) => (
              <AlumniCard
                key={alumnus._id}
                alumnus={alumnus}
                onRequestMentorship={(a) => setSelectedMentor(a)}
              />
            ))}
          </div>
        </section>

        {/* Bottom Split: Recent Mentorship Requests & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Mentorship Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>My Mentorship Requests</span>
              </h3>
              <Link to="/mentorship" className="text-xs font-semibold text-[#2563EB] hover:underline">
                View all
              </Link>
            </div>

            {recentMentorships.length > 0 ? (
              <div className="space-y-3">
                {recentMentorships.map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {req.topic}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Mentor: {req.alumniId?.name || 'Alumnus'} ({req.alumniId?.company || 'Industry'})
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${
                      req.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">No mentorship requests sent yet.</p>
                <Link
                  to="/directory"
                  className="mt-2 inline-block text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Browse mentors in directory →
                </Link>
              </div>
            )}
          </div>

          {/* Recent In-App Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recent Updates & Alerts</span>
              </h3>
              <span className="text-[11px] text-slate-400">Real-time DB Stream</span>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 font-bold">{n.title}</strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs">You're all caught up! No new notifications.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mentorship Request Modal */}
        {selectedMentor && (
          <MentorshipModal
            alumnus={selectedMentor}
            onClose={() => setSelectedMentor(null)}
            onSuccess={() => {
              setSelectedMentor(null);
              fetchDashboardData();
            }}
          />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
