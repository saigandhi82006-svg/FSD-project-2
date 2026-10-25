import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building,
  MapPin,
  ExternalLink,
  Mail,
  ShieldCheck,
  MessageSquare,
  Briefcase,
  Calendar,
  Sparkles,
  Edit3,
  CheckCircle2,
  Share2
} from 'lucide-react';
import api from '../api/client';
import MentorshipModal from '../components/MentorshipModal';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

export const AlumniProfilePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [alumnus, setAlumnus] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [mentorshipModalOpen, setMentorshipModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/alumni/${id}`);
        if (res.success) {
          setAlumnus(res.data.alumnus);
          setPostedJobs(res.data.jobs || []);
        }
      } catch (err) {
        console.warn('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-slate-200 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-slate-100 rounded w-32 mx-auto" />
      </div>
    );
  }

  if (!alumnus) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Profile Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">
          The requested alumni profile could not be found or has been deactivated.
        </p>
        <Link
          to="/directory"
          className="px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-semibold"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === alumnus._id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile URL copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Cover Graphic */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#173B6C] via-[#1E4E8C] to-[#2563EB] relative p-6 flex justify-end items-start">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar & Badges */}
            <div className="relative">
              {alumnus.profileImage ? (
                <img
                  src={alumnus.profileImage}
                  alt={alumnus.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-md bg-white"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#173B6C] text-white flex items-center justify-center font-black text-3xl ring-4 ring-white shadow-md">
                  {alumnus.name?.charAt(0)}
                </div>
              )}
              {alumnus.verificationStatus === 'VERIFIED' && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md ring-2 ring-white"
                  title="Verified Institutional Alumnus"
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Actions for viewers / owner */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
              {isOwner ? (
                <Link
                  to="/settings"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <>
                  {alumnus.mentorshipAvailable && (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast('Please log in to request mentorship.', { icon: 'ℹ️' });
                          return;
                        }
                        setMentorshipModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" /> Request Mentorship
                    </button>
                  )}

                  {alumnus.linkedInUrl && (
                    <a
                      href={alumnus.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Name & Titles */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{alumnus.name}</h1>
              {alumnus.verificationStatus === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Alumnus
                </span>
              )}
              {alumnus.mentorshipAvailable && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Open for Mentoring
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span>{alumnus.jobTitle || 'Industry Professional'}</span>
              {alumnus.company && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#2563EB]">{alumnus.company}</span>
                </>
              )}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {alumnus.degree} {alumnus.department} · Batch of {alumnus.graduationYear}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {alumnus.city || 'India'}
              </span>
              {alumnus.experience > 0 && (
                <span>• {alumnus.experience} years experience</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-slate-100 flex gap-6 text-xs font-bold overflow-x-auto">
          {['about', 'experience', 'skills', 'mentorship', 'jobs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 border-b-2 transition capitalize shrink-0 ${
                activeTab === tab
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'jobs' ? `Posted Jobs (${postedJobs.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">About Me</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {alumnus.bio || 'This alumnus has not added a detailed biography yet.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                College Affiliation
              </h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-slate-900">{alumnus.college}</div>
                <div className="text-xs text-slate-600">{alumnus.department}</div>
                <div className="text-[11px] text-slate-400">Class of {alumnus.graduationYear} · {alumnus.degree}</div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE & CAREER JOURNEY */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Career Journey</h3>
            <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-2">
              <div className="relative space-y-1">
                <div className="w-3 h-3 bg-[#2563EB] rounded-full absolute -left-[23px] top-1.5 ring-4 ring-white" />
                <span className="text-[11px] font-bold text-[#2563EB]">Present</span>
                <h4 className="text-sm font-bold text-slate-900">{alumnus.jobTitle || 'Senior Professional'}</h4>
                <p className="text-xs text-slate-600">{alumnus.company} · {alumnus.city}</p>
                <p className="text-xs text-slate-500">{alumnus.industry}</p>
              </div>

              <div className="relative space-y-1 pt-3">
                <div className="w-3 h-3 bg-slate-300 rounded-full absolute -left-[23px] top-4 ring-4 ring-white" />
                <span className="text-[11px] font-bold text-slate-400">{alumnus.graduationYear}</span>
                <h4 className="text-sm font-bold text-slate-900">Graduated from {alumnus.college}</h4>
                <p className="text-xs text-slate-600">{alumnus.degree} in {alumnus.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Core Technical & Professional Skills</h3>
            {alumnus.skills && alumnus.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {alumnus.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-semibold rounded-xl border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No skills listed yet.</p>
            )}
          </div>
        )}

        {/* MENTORSHIP TAB */}
        {activeTab === 'mentorship' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mentorship Topics & Availability</h3>
                <p className="text-xs text-slate-500">Topics this alumnus is willing to mentor students on</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                alumnus.mentorshipAvailable
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {alumnus.mentorshipAvailable ? 'Available for Requests' : 'Temporarily Unavailable'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(alumnus.mentorshipTopics || [
                'Placement Preparation',
                'Resume Review',
                'DSA & Coding Interviews',
                'Career Guidance'
              ]).map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-xs font-bold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>

            {alumnus.mentorshipAvailable && !isOwner && (
              <div className="pt-2">
                <button
                  onClick={() => setMentorshipModalOpen(true)}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Send Mentorship Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* POSTED JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Opportunities Posted by {alumnus.name}</h3>
            {postedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {postedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                This alumnus has not posted any active job or internship opportunities yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mentorship Modal */}
      {mentorshipModalOpen && (
        <MentorshipModal
          alumnus={alumnus}
          onClose={() => setMentorshipModalOpen(false)}
          onSuccess={() => setMentorshipModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AlumniProfilePage;
