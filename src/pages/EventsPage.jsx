import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  PlusCircle,
  Users,
  Search,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export const EventsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const timeFilter = searchParams.get('time') || 'upcoming';
  const modeFilter = searchParams.get('mode') || '';

  // Form State for creating events
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '12:30 PM',
    location: 'College Main Auditorium',
    eventMode: 'Online',
    meetingUrl: 'https://meet.google.com/xyz-alumni-talk',
    organizer: 'College Alumni Association & TPO',
    registrationDeadline: '',
    capacity: 250
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('timeFilter', timeFilter);
      if (modeFilter) params.set('eventMode', modeFilter);

      const res = await api.get(`/events?${params.toString()}`);
      if (res.success) {
        setEvents(res.data || []);
      }
    } catch (err) {
      console.warn('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [timeFilter, modeFilter]);

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      toast('Please log in to register for college events.', { icon: 'ℹ️' });
      return;
    }

    try {
      const res = await api.post(`/events/${eventId}/register`);
      if (res.success) {
        toast.success(res.message);
        fetchEvents();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      const res = await api.delete(`/events/${eventId}/register`);
      if (res.success) {
        toast.success(res.message);
        fetchEvents();
      }
    } catch (err) {
      toast.error(err.message || 'Cancel registration failed');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.registrationDeadline) {
      toast.error('Please fill in title, date, and deadline.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/events', formData);
      if (res.success) {
        toast.success('Event created and published successfully!');
        setCreateModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const updateParam = (key, val) => {
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
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">College & Alumni Events</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
            Attend annual homecoming meets, webinars on placement preparation, and industry guest lectures.
          </p>
        </div>

        {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'ALUMNI') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-500 text-slate-900 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => updateParam('time', 'upcoming')}
            className={`px-4 py-2 rounded-xl transition ${
              timeFilter === 'upcoming'
                ? 'bg-[#173B6C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => updateParam('time', 'past')}
            className={`px-4 py-2 rounded-xl transition ${
              timeFilter === 'past'
                ? 'bg-[#173B6C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Archives
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => updateParam('mode', e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 shadow-xs"
          >
            <option value="">All Modes</option>
            <option value="Online">Virtual / Online</option>
            <option value="In person">In-Person Campus</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              onCancelRegistration={handleCancelRegistration}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description={`There are currently no ${timeFilter} events matching your selected criteria.`}
        />
      )}

      {/* Create Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Create an Alumni Event</h2>
            <p className="text-xs text-slate-500 mb-5">
              Organize webinars, homecoming reunions, or mentorship panels for students and alumni.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Alumni Meet 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration Deadline *</label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="12:30 PM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Mode</label>
                  <select
                    value={formData.eventMode}
                    onChange={(e) => setFormData({ ...formData, eventMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Online">Online Video / Stream</option>
                    <option value="In person">In Person (Main Campus)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity (0 = unlimited)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Campus Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. College Auditorium, Block C"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {formData.eventMode !== 'In person' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Virtual Meeting Link (Unlocked only after registration)
                  </label>
                  <input
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    placeholder="https://meet.google.com/xyz-alumni-talk"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Description & Agenda *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline speakers, keynote themes, and discussion topics..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
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
                  <span>Publish Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
