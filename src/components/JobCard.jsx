import React from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Bookmark,
  ExternalLink,
  Calendar,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const JobCard = ({ job, onToggleBookmark, onViewDetails }) => {
  const { isAuthenticated } = useAuth();

  const isDeadlineNear = () => {
    if (!job.applicationDeadline) return false;
    const daysLeft = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 7;
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'Rolling';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top bar: Company, Role & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                job.opportunityType === 'Internship'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {job.opportunityType}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                {job.workMode}
              </span>
              {job.approvalStatus === 'PENDING' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  Pending Review
                </span>
              )}
            </div>

            <h3
              onClick={() => onViewDetails && onViewDetails(job)}
              className="text-base font-bold text-slate-900 hover:text-[#2563EB] cursor-pointer transition line-clamp-1"
            >
              {job.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.company}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {job.location}
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          {isAuthenticated && onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(job._id)}
              className={`p-2 rounded-xl transition ${
                job.isBookmarked
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={job.isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Salary & Experience */}
        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium my-3 py-1.5 px-3 bg-slate-50/80 rounded-xl">
          {job.salaryRange && (
            <span className="font-bold text-[#16A34A]">{job.salaryRange}</span>
          )}
          {job.experienceLevel && (
            <span className="text-slate-500">• {job.experienceLevel}</span>
          )}
          <span className="ml-auto text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Deadline: <strong className={isDeadlineNear() ? 'text-red-600 font-bold' : 'text-slate-700'}>{formatDeadline(job.applicationDeadline)}</strong>
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {job.description}
        </p>

        {/* Required skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skillsRequired.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {job.postedBy && (
          <div className="flex items-center gap-2 min-w-0">
            {job.postedBy.profileImage ? (
              <img
                src={job.postedBy.profileImage}
                alt={job.postedBy.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                {job.postedBy.name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="text-[11px] text-slate-500 truncate">
              Posted by <strong className="text-slate-700">{job.postedBy.name}</strong>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onViewDetails && onViewDetails(job)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Details
          </button>

          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-xs"
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
