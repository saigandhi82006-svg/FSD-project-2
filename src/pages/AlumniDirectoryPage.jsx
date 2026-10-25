import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Users,
  Building,
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import AlumniCard from '../components/AlumniCard';
import MentorshipModal from '../components/MentorshipModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const AlumniDirectoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [alumni, setAlumni] = useState([]);
  const [filtersMetadata, setFiltersMetadata] = useState({
    departments: [],
    companies: [],
    cities: [],
    industries: []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Filter states from URL or defaults
  const search = searchParams.get('search') || '';
  const department = searchParams.get('department') || '';
  const company = searchParams.get('company') || '';
  const city = searchParams.get('city') || '';
  const graduationYear = searchParams.get('graduationYear') || '';
  const mentorshipAvailable = searchParams.get('mentorshipAvailable') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const res = await api.get(`/alumni?${queryString}`);
      if (res.success) {
        setAlumni(res.data || []);
        if (res.pagination) setPagination(res.pagination);
        if (res.filters) setFiltersMetadata(res.filters);
      }
    } catch (err) {
      console.warn('Directory fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [searchParams]);

  const handleRequestMentorship = (alumnus) => {
    if (!isAuthenticated) {
      toast('Please log in to request mentorship from this alumnus.', { icon: 'ℹ️' });
      return;
    }
    setSelectedMentor(alumnus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#173B6C] to-[#2563EB] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Alumni Directory</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
            Search and connect with college graduates across top tech firms, core industries, and global academia.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-xs text-xs font-semibold">
          <Users className="w-4 h-4 text-[#F59E0B]" />
          <span>{pagination.total} Alumni Registered</span>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-600" />
                Filters
              </span>
              {(search || department || company || city || graduationYear || mentorshipAvailable) && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            {/* Academic Filters */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Academic
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => updateParam('department', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <option value="">All Departments</option>
                  {filtersMetadata.departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Batch</label>
                <input
                  type="number"
                  placeholder="e.g. 2021"
                  value={graduationYear}
                  onChange={(e) => updateParam('graduationYear', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Professional Filters */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Professional
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft, Google, TCS"
                  value={company}
                  onChange={(e) => updateParam('company', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Hyderabad"
                  value={city}
                  onChange={(e) => updateParam('city', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Other Options */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mentorship Status
              </h4>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={mentorshipAvailable === 'true'}
                  onChange={(e) => updateParam('mentorshipAvailable', e.target.checked ? 'true' : '')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Available for Mentorship</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ALUMNI CARDS GRID & SEARCH */}
        <section className="lg:col-span-3 space-y-5">
          {/* Top Search & Sort Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder="Search alumni by name, role, skill..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs">
              <span className="text-slate-500 font-medium">
                <strong>{pagination.total}</strong> alumni found
              </span>

              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="newest">Recently Joined</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="year_desc">Graduation Year (Latest)</option>
                <option value="year_asc">Graduation Year (Oldest)</option>
                <option value="experience_desc">Most Experienced</option>
              </select>
            </div>
          </div>

          {/* Cards Display */}
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : alumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {alumni.map((alum) => (
                <AlumniCard
                  key={alum._id}
                  alumnus={alum}
                  onRequestMentorship={handleRequestMentorship}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title={search || department || company || city || graduationYear ? "No alumni match your search" : "No alumni registered yet"}
              description={search || department || company || city || graduationYear ? "Try adjusting your filters, clearing company search, or searching for other skills." : "Be the first graduate to join the alumni network and connect with students!"}
              actionLabel={search || department || company || city || graduationYear ? "Clear all filters" : "Register as Alumni"}
              onAction={search || department || company || city || graduationYear ? handleClearAll : () => window.location.href = '/register'}
            />
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <button
                disabled={pagination.page <= 1}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', String(pagination.page - 1));
                  setSearchParams(newParams);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-medium text-slate-600">
                Page <strong className="text-slate-900">{pagination.page}</strong> of <strong className="text-slate-900">{pagination.totalPages}</strong>
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', String(pagination.page + 1));
                  setSearchParams(newParams);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>

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

export default AlumniDirectoryPage;
