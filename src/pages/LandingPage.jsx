import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Search,
  ExternalLink
} from 'lucide-react';
import api from '../api/client';
import AlumniCard from '../components/AlumniCard';
import JobCard from '../components/JobCard';
import EventCard from '../components/EventCard';
import MentorshipModal from '../components/MentorshipModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredAlumni, setFeaturedAlumni] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [alumniRes, jobsRes, eventsRes] = await Promise.allSettled([
          api.get('/alumni?limit=3&sort=experience_desc'),
          api.get('/jobs?limit=3'),
          api.get('/events?limit=3&timeFilter=upcoming')
        ]);

        if (alumniRes.status === 'fulfilled' && alumniRes.value.success) {
          setFeaturedAlumni(alumniRes.value.data || []);
        }
        if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
          setLatestJobs(jobsRes.value.data || []);
        }
        if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
          setUpcomingEvents(eventsRes.value.data || []);
        }
      } catch (err) {
        console.warn('Error loading landing page dynamic feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const handleRequestMentorship = (alumnus) => {
    if (!isAuthenticated) {
      toast('Please log in as a student to request mentorship.', { icon: 'ℹ️' });
      return;
    }
    setSelectedMentor(alumnus);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#173B6C] to-[#0F274A] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-blue-200 border border-white/15 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Official College Alumni & Student Mentorship Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Your College Connects You <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-[#F59E0B]">
              to Your Future.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            Connect with alumni, explore career opportunities, get mentorship, and build lifelong
            professional relationships with your college community.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/directory"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#F59E0B] hover:bg-amber-500 text-slate-900 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Explore Alumni</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl font-semibold text-sm backdrop-blur-xs transition flex items-center justify-center"
            >
              Join the Network
            </Link>
          </div>
        </div>

      </section>

      {/* 3. FEATURED ALUMNI SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
              Distinguished Graduates
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Alumni</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with experienced alumni leading innovations across global technology hubs.
            </p>
          </div>

          <Link
            to="/directory"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition"
          >
            <span>View All Alumni</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAlumni.map((alumnus) => (
              <AlumniCard
                key={alumnus._id}
                alumnus={alumnus}
                onRequestMentorship={handleRequestMentorship}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Alumni Directory Ready</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Newly registered alumni will automatically appear here with their company, roles, and LinkedIn profiles.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <span>Register as Alumni</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. DUAL COLUMN: LATEST OPPORTUNITIES & UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Opportunities Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Latest Opportunities</h3>
                <p className="text-xs text-slate-500">Verified internships and job openings from alumni.</p>
              </div>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                View all jobs →
              </Link>
            </div>

            <div className="space-y-4">
              {latestJobs.length > 0 ? (
                latestJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No active job posts yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Events Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Upcoming Events</h3>
                <p className="text-xs text-slate-500">Webinars, career workshops, and reunions.</p>
              </div>
              <Link
                to="/events"
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                View all events →
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No upcoming events scheduled right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
            Simple 3-Step Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-12">
            Designed specifically for Indian university ecosystems to bridge the gap between academia and corporate careers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Explore Alumni Directory</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter graduates by department, graduation year, target companies (e.g. Google, Microsoft, TCS), and Indian tech hubs.
              </p>
            </div>

            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">Request Mentorship</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send structured requests for placement preparation, resume review, DSA problem solving, or GATE & higher studies advice.
              </p>
            </div>

            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Unlock Career Opportunities</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apply directly to exclusive internships, refer to campus alumni, and attend live tech workshops and homecoming reunions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#173B6C] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you a College Alumnus?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Give back to your alma mater. Guide ambitious students, share job referrals from your company, and stay connected with your batchmates.
            </p>
          </div>

          <Link
            to="/register"
            className="px-6 py-3.5 bg-[#F59E0B] hover:bg-amber-500 text-slate-900 rounded-xl font-bold text-sm shadow-md transition shrink-0"
          >
            Register as Alumni Mentor
          </Link>
        </div>
      </section>

      {/* Mentorship Request Modal */}
      {selectedMentor && (
        <MentorshipModal
          alumnus={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onSuccess={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
};

export default LandingPage;
