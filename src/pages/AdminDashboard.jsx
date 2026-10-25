import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Clock,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Mail,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [dashboardData, setDashboardData] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Admin stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await api.get('/admin/users?role=ALUMNI&verificationStatus=PENDING');
      if (res.success) {
        setPendingVerifications(res.data);
      }
    } catch (err) {
      console.warn('Verifications fetch error:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs?approvalStatus=PENDING');
      if (res.success) {
        setPendingJobs(res.data);
      }
    } catch (err) {
      console.warn('Jobs fetch error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      let query = '/admin/users?limit=25';
      if (userRoleFilter) query += `&role=${userRoleFilter}`;
      if (userSearch) query += `&search=${encodeURIComponent(userSearch)}`;

      const res = await api.get(query);
      if (res.success) {
        setAllUsers(res.data);
      }
    } catch (err) {
      console.warn('Users fetch error:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/contact-messages');
      if (res.success) {
        setContactMessages(res.data);
      }
    } catch (err) {
      console.warn('Messages fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVerifications();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab, userRoleFilter]);

  const handleVerifyAlumni = async (userId, status) => {
    try {
      const res = await api.patch(`/admin/alumni/${userId}/verification`, { status });
      if (res.success) {
        toast.success(`Alumni status updated to ${status}!`);
        fetchVerifications();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Verification update failed');
    }
  };

  const handleModerateJob = async (jobId, status) => {
    try {
      const res = await api.patch(`/admin/jobs/${jobId}/moderation`, {
        status,
        feedback: status === 'APPROVED' ? 'Approved for public listing.' : 'Does not meet college job board guidelines.'
      });
      if (res.success) {
        toast.success(`Job post marked as ${status}!`);
        fetchJobs();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Job moderation failed');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const setTab = (t) => {
    setSearchParams({ tab: t });
  };

  const counts = dashboardData?.counts || {
    totalStudents: 2480,
    totalAlumni: 5240,
    verifiedAlumni: 4120,
    pendingAlumni: 320,
    pendingJobs: 1,
    totalJobs: 4,
    upcomingEvents: 3
  };

  const departmentData = dashboardData?.charts?.departments?.length > 0
    ? dashboardData.charts.departments
    : [
        { name: 'CSE', count: 45 },
        { name: 'ECE', count: 28 },
        { name: 'Mech', count: 18 },
        { name: 'EEE', count: 12 },
        { name: 'Others', count: 15 }
      ];

  const graduationYearData = dashboardData?.charts?.graduationYears?.length > 0
    ? dashboardData.charts.graduationYears
    : [
        { year: '2019', count: 25 },
        { year: '2020', count: 40 },
        { year: '2021', count: 52 },
        { year: '2022', count: 68 },
        { year: '2024', count: 85 }
      ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar with tab switcher */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} onTabChange={setTab} />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Governance Panel
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify alumni credentials, moderate career postings, and review college community analytics.
            </p>
          </div>

          {/* Quick tab pills on mobile / desktop */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'overview' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setTab('verification')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'verification' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Verification ({pendingVerifications.length})
            </button>
            <button
              onClick={() => setTab('jobs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'jobs' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Jobs ({pendingJobs.length})
            </button>
            <button
              onClick={() => setTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'users' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setTab('messages')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'messages' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Inquiries
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS CHARTS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Overview Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Students"
                value={counts.totalStudents}
                icon={GraduationCap}
                color="blue"
                subtitle="Enrolled learners"
              />
              <StatCard
                title="Total Alumni"
                value={counts.totalAlumni}
                icon={Users}
                color="navy"
                subtitle="Registered graduates"
              />
              <StatCard
                title="Verified Alumni"
                value={counts.verifiedAlumni}
                icon={ShieldCheck}
                color="emerald"
                subtitle="Approved credentials"
              />
              <StatCard
                title="Pending Verification"
                value={counts.pendingAlumni}
                icon={Clock}
                color="amber"
                subtitle="Requires review"
              />
            </div>

            {/* Recharts Analytics: Department Donut & Graduation Year Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alumni by Department */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Alumni by Department</h3>
                    <p className="text-[11px] text-slate-500">Distribution across engineering and MCA branches</p>
                  </div>
                  <PieChartIcon className="w-4 h-4 text-slate-400" />
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {departmentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alumni by Graduation Year */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Alumni by Graduation Batch</h3>
                    <p className="text-[11px] text-slate-500">Passing year registration distribution</p>
                  </div>
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graduationYearData}>
                      <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pending Approvals Quick Preview Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Verification Requests</h3>
                  <p className="text-[11px] text-slate-500">Alumni awaiting administrative institutional verification</p>
                </div>
                <button
                  onClick={() => setTab('verification')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  View all ({pendingVerifications.length})
                </button>
              </div>

              {pendingVerifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
                      <tr>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Branch & Degree</th>
                        <th className="py-2.5 px-3">Batch</th>
                        <th className="py-2.5 px-3">Company</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingVerifications.slice(0, 4).map((alumnus) => (
                        <tr key={alumnus._id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-900">{alumnus.name}</td>
                          <td className="py-3 px-3 text-slate-600">{alumnus.department} ({alumnus.degree})</td>
                          <td className="py-3 px-3 font-semibold text-slate-700">{alumnus.graduationYear}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{alumnus.company || 'N/A'}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleVerifyAlumni(alumnus._id, 'VERIFIED')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[11px]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVerifyAlumni(alumnus._id, 'REJECTED')}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded-md font-medium text-[11px]"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No pending alumni verification requests. All active alumni are verified!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ALUMNI VERIFICATION MANAGEMENT */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 animate-fade-in">
            <div>
              <h2 className="text-base font-bold text-slate-900">Alumni Verification Queue</h2>
              <p className="text-xs text-slate-500">Verify graduate identity against college registry records</p>
            </div>

            {pendingVerifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pendingVerifications.map((alumnus) => (
                  <div key={alumnus._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{alumnus.name}</h4>
                        <span className="text-xs text-slate-500">({alumnus.email})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {alumnus.degree} in {alumnus.department} · Passing Year: <strong>{alumnus.graduationYear}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Current: <strong>{alumnus.jobTitle || 'N/A'}</strong> at <strong>{alumnus.company || 'N/A'}</strong> ({alumnus.city})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyAlumni(alumnus._id, 'VERIFIED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Verify Alumnus
                      </button>
                      <button
                        onClick={() => handleVerifyAlumni(alumnus._id, 'REJECTED')}
                        className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                <p className="text-xs font-semibold text-slate-700">Verification queue is clear!</p>
                <p className="text-[11px] text-slate-400">All submitted alumni profiles have been processed.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JOB & INTERNSHIP MODERATION */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 animate-fade-in">
            <div>
              <h2 className="text-base font-bold text-slate-900">Job Opportunity Moderation</h2>
              <p className="text-xs text-slate-500">Approve alumni job posts before making them public to students</p>
            </div>

            {pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <div key={job._id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                            {job.opportunityType}
                          </span>
                          <span className="text-xs text-slate-500">{job.workMode} · {job.location}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{job.title}</h4>
                        <p className="text-xs font-semibold text-slate-700">{job.company}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleModerateJob(job._id, 'APPROVED')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleModerateJob(job._id, 'REJECTED')}
                          className="px-3.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                      {job.description}
                    </p>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Salary: <strong>{job.salaryRange || 'Unspecified'}</strong></span>
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] font-bold hover:underline"
                      >
                        View External Link ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileCheck2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-700">No jobs pending moderation.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Registered Users Directory</h2>
                <p className="text-xs text-slate-500">Manage student, alumni, and administrative privileges</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="ADMIN">Admins</option>
                </select>

                <div className="relative flex-1 sm:w-48">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                    placeholder="Search user..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Account Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'ALUMNI' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{u.department}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{u.graduationYear}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u._id)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                              u.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 animate-fade-in">
            <div>
              <h2 className="text-base font-bold text-slate-900">Contact & Support Inquiries</h2>
              <p className="text-xs text-slate-500">Messages sent via public contact page</p>
            </div>

            {contactMessages.length > 0 ? (
              <div className="space-y-3">
                {contactMessages.map((m) => (
                  <div key={m._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{m.subject}</div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      From: <strong>{m.name}</strong> ({m.email})
                    </div>
                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                      "{m.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No contact messages received yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
