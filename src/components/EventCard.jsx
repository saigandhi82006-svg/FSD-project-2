import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EventCard = ({ event, onRegister, onCancelRegistration }) => {
  const { isAuthenticated } = useAuth();

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();

  const isPast = new Date() > new Date(event.date);
  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.capacity > 0 && event.attendeeCount >= event.capacity;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top date badge and mode */}
        <div className="flex items-start gap-4 mb-3">
          <div className="shrink-0 w-14 h-14 bg-blue-50 border border-blue-200 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-[10px] font-bold text-[#2563EB] tracking-wider">{month}</span>
            <span className="text-xl font-black text-[#173B6C] leading-none">{day}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                event.eventMode === 'Online'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : event.eventMode === 'Hybrid'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {event.eventMode}
              </span>

              {event.isRegistered && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Registered
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{event.organizer}</p>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3 px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.eventMode === 'Online' ? (
              <Video className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {event.attendeeCount} Registered
              {event.capacity > 0 && ` / ${event.capacity} Capacity`}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Unlocked Meeting Link */}
        {event.isRegistered && event.meetingUrl && (
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-900">Virtual Session Link Unlocked</p>
              <p className="text-[10px] text-emerald-700 truncate max-w-xs">{event.meetingUrl}</p>
            </div>
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <span>Join</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          Reg. Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>

        {isPast ? (
          <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg">
            Event Concluded
          </span>
        ) : event.isRegistered ? (
          <button
            onClick={() => onCancelRegistration && onCancelRegistration(event._id)}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
          >
            Cancel Registration
          </button>
        ) : isDeadlinePassed ? (
          <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Registration Closed
          </span>
        ) : isFull ? (
          <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg">
            Capacity Full
          </span>
        ) : (
          <button
            onClick={() => onRegister && onRegister(event._id)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-xs"
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
