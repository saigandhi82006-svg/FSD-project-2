import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  PlusCircle,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';
import JobCard from '../components/JobCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export const JobsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [detailModalJob, setDetailModalJob] = useState(null);

  // Tabs: 'all' | 'saved' | 'my_posts'
  const activeTab = searchParams.get('tab') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const typeFilter = searchParams.get('type') || '';
  const modeFilter = searchParams.get('mode') || '';

  // Form State for New Job
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    description: '',
    opportunityType: 'Full-time',
    workMode: 'On-site',
    location: user?.city || 'Bengaluru',
    skillsRequired: 'Java, Python, SQL',
    experienceLevel: 'Entry Level (0-2 yrs)',
    salaryRange: '₹8 - 12 LPA',
    applicationUrl: 'https://careers.company.com',
    applicationDeadline: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let endpoint = '/jobs';
      if (activeTab === 'saved') {
        endpoint = '/jobs/saved';
      } else if (activeTab === 'my_posts') {
        endpoint = '/jobs/me';
      } else {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (typeFilter) params.set('opportunityType', typeFilter);
        if (modeFilter) params.set('workMode', modeFilter);
        endpoint = `/jobs?${params.toString()}`;
      }

      const res = await api.get(endpoint);
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (err) {
      console.warn('Jobs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams, activeTab]);

  const handleToggleBookmark = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/bookmark`);
      if (res.success) {
        toast.success(res.message);
        fetchJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Bookmark action failed');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description || !formData.applicationDeadline) {
      toast.error('Please fill in all required job fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/jobs', formData);
      if (res.success) {
        toast.success(res.message);
        setPostModalOpen(false);
        fetchJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Job creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const setTab = (tabName) => {
    const newParams = new URLSearchParams(searchParams);
    if (tabName === 'all') {
      newParams.delete('tab');
    } else {
      newParams.set('tab', tabName);
    }
    setSearchParams(newParams);
  };

  const updateFilter = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#173B6C] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Job & Internship Board</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
            Exclusive opportunities, off-campus drives, and internships posted directly by college alumni and partnered tech employers.
          </p>
        </div>

        {isAuthenticated && (user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-500 text-slate-900 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Opportunity</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'all'
              ? 'bg-[#173B6C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Opportunities
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setTab('saved')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-[#173B6C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Jobs</span>
          </button>
        )}

        {isAuthenticated && (user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
          <button
            onClick={() => setTab('my_posts')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'my_posts'
                ? 'bg-[#173B6C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Job Posts
          </button>
        )}
      </div>

      {/* Search & Filters Controls */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search jobs by role, company (e.g. Google, Microsoft), or skills..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => updateFilter('mode', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">All Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid of Opportunities */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onToggleBookmark={handleToggleBookmark}
              onViewDetails={(j) => setDetailModalJob(j)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No opportunities found"
          description={
            activeTab === 'saved'
              ? 'You have not bookmarked any jobs yet. Browse available listings and click the bookmark icon to save.'
              : 'Try clearing your filters or check back later for new company postings.'
          }
        />
      )}

      {/* View Details Modal */}
      {detailModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalJob(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                    {detailModalJob.opportunityType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {detailModalJob.workMode}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{detailModalJob.title}</h2>
                <p className="text-sm font-semibold text-slate-700">{detailModalJob.company} · {detailModalJob.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Salary / Stipend</span>
                  <strong className="text-emerald-700">{detailModalJob.salaryRange || 'Disclosed during interview'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Experience Level</span>
                  <strong className="text-slate-800">{detailModalJob.experienceLevel}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Description & Role Requirements</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {detailModalJob.description}
                </p>
              </div>

              {detailModalJob.skillsRequired && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detailModalJob.skillsRequired.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Deadline: <strong>{new Date(detailModalJob.applicationDeadline).toLocaleDateString('en-IN')}</strong>
                </span>

                <a
                  href={detailModalJob.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <span>Apply on Employer Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post a Job Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPostModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Post a Job or Internship</h2>
            <p className="text-xs text-slate-500 mb-5">
              Share hiring opportunities with college students and recent graduates.
            </p>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Software Development Engineer - Intern"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Hybrid"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Type</label>
                  <select
                    value={formData.opportunityType}
                    onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary / Stipend Range</label>
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="e.g. ₹50,000/month or ₹12 - 16 LPA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application URL or Email *</label>
                <input
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://careers.company.com/apply"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Requirements *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the job responsibilities, eligibility criteria, and interview steps..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Submit Opportunity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
