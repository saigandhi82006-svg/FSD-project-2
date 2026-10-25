import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  MapPin,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AlumniCard = ({ alumnus, onRequestMentorship }) => {
  const { user } = useAuth();
  const isSelf = user?._id === alumnus._id;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top header: Avatar, Name, Verification */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <Link to={`/alumni/${alumnus._id}`} className="relative shrink-0">
            {alumnus.profileImage ? (
              <img
                src={alumnus.profileImage}
                alt={alumnus.name}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-500/30 transition"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#173B6C] to-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {alumnus.name?.charAt(0) || 'A'}
              </div>
            )}
            {alumnus.verificationStatus === 'VERIFIED' && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs"
                title="Verified Alumnus"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <Link
                to={`/alumni/${alumnus._id}`}
                className="text-base font-bold text-slate-900 hover:text-[#2563EB] transition truncate block"
              >
                {alumnus.name}
              </Link>
              {alumnus.linkedInUrl && (
                <a
                  href={alumnus.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#0A66C2] hover:opacity-80 p-0.5 shrink-0"
                  title="LinkedIn Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5 truncate">
              <span>{alumnus.jobTitle || 'Software Professional'}</span>
              {alumnus.company && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#2563EB] font-bold">{alumnus.company}</span>
                </>
              )}
            </p>

            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">
                {alumnus.degree} {alumnus.department?.replace('Engineering', 'Engg')} · {alumnus.graduationYear}
              </span>
            </p>
          </div>
        </div>

        {/* Location & Experience */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 px-1">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {alumnus.city || 'India'}
          </span>
          {alumnus.experience > 0 && (
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              {alumnus.experience}y exp
            </span>
          )}
        </div>

        {/* Skills Pills */}
        {alumnus.skills && alumnus.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {alumnus.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-50/80 text-[#2563EB] text-[11px] font-medium rounded-md border border-blue-100"
              >
                {skill}
              </span>
            ))}
            {alumnus.skills.length > 3 && (
              <span className="px-1.5 py-0.5 text-slate-400 text-[11px] font-medium">
                +{alumnus.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/alumni/${alumnus._id}`}
          className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
        >
          View Profile
        </Link>

        {alumnus.linkedInUrl && (
          <a
            href={alumnus.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-[#0A66C2] hover:text-white bg-blue-50 hover:bg-[#0A66C2] border border-blue-100 rounded-lg transition shadow-2xs flex items-center justify-center shrink-0"
            title="Open LinkedIn Profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
        )}

        {alumnus.mentorshipAvailable && !isSelf && (
          <button
            onClick={() => onRequestMentorship && onRequestMentorship(alumnus)}
            className="flex-1 py-2 px-2 inline-flex items-center justify-center gap-1 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mentor</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
