import React, { useState } from 'react';
import type { CalendarEvent, Priority } from '../types';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Clock,
  Cloud,
  CheckCircle,
  AlertCircle,
  Check,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from '../services/googleCalendar';
import { ConfirmationModal } from './ConfirmationModal';
import type { User } from 'firebase/auth';

interface CalendarViewProps {
  events: CalendarEvent[];
  user: User | null;
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onRequireAuth: () => void;
  isDark?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  user,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
  onRequireAuth,
  isDark = true,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [syncingEventId, setSyncingEventId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Destructive delete confirmation
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  // Form State (used for both Add & Edit)
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [formCategory, setFormCategory] = useState<CalendarEvent['category']>('clinical');
  const [formPriority, setFormPriority] = useState<Priority>('high');
  const [formLocation, setFormLocation] = useState('Dr. Ravi Shankar Clinic');
  const [syncDirectlyToGoogle, setSyncDirectlyToGoogle] = useState(true);

  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'all') return true;
    return e.category === filterCategory;
  });

  const openAddModal = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStartDate(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
    setFormEndDate(new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setFormCategory('clinical');
    setFormPriority('high');
    setFormLocation('Dr. Ravi Shankar Clinic');
    setSyncDirectlyToGoogle(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormDescription(evt.description || '');
    setFormStartDate(
      evt.startDate.includes('T')
        ? evt.startDate.slice(0, 16)
        : `${evt.startDate}T09:00`
    );
    setFormEndDate(
      evt.endDate
        ? evt.endDate.includes('T')
          ? evt.endDate.slice(0, 16)
          : `${evt.endDate}T10:00`
        : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
    );
    setFormCategory(evt.category);
    setFormPriority(evt.priority);
    setFormLocation(evt.location || '');
    setSyncDirectlyToGoogle(Boolean(evt.syncedToGoogle));
  };

  const handleSyncToGoogle = async (evt: CalendarEvent) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setSyncingEventId(evt.id);
    setSyncError(null);
    setSyncSuccessMsg(null);
    try {
      const gEvent = await createGoogleCalendarEvent(evt);
      onUpdateEvent({
        ...evt,
        googleCalendarEventId: gEvent.id,
        syncedToGoogle: true,
      });
      setSyncSuccessMsg(`"${evt.title}" synced to Google Calendar.`);
      setTimeout(() => setSyncSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Failed to sync to Google Calendar:', err);
      setSyncError(err.message || 'Failed to sync to Google Calendar');
    } finally {
      setSyncingEventId(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const eventId = `evt-${Date.now()}`;
    const newEvent: CalendarEvent = {
      id: eventId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      category: formCategory,
      priority: formPriority,
      location: formLocation.trim(),
      syncedToGoogle: false,
    };

    onAddEvent(newEvent);
    setIsAddModalOpen(false);

    if (syncDirectlyToGoogle && user) {
      handleSyncToGoogle(newEvent);
    }
  };

  const handleSaveEditedEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !formTitle.trim()) return;

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: formTitle.trim(),
      description: formDescription.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      category: formCategory,
      priority: formPriority,
      location: formLocation.trim(),
    };

    onUpdateEvent(updatedEvent);
    setEditingEvent(null);

    // If synced to Google Calendar and user logged in, update remote event
    if (updatedEvent.googleCalendarEventId && user) {
      try {
        await updateGoogleCalendarEvent(updatedEvent.googleCalendarEventId, updatedEvent);
        setSyncSuccessMsg(`Updated Google Calendar event "${updatedEvent.title}"`);
        setTimeout(() => setSyncSuccessMsg(null), 3000);
      } catch (err) {
        console.warn('Could not update event on Google Calendar:', err);
      }
    } else if (syncDirectlyToGoogle && !updatedEvent.googleCalendarEventId && user) {
      handleSyncToGoogle(updatedEvent);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    if (eventToDelete.googleCalendarEventId && user) {
      try {
        await deleteGoogleCalendarEvent(eventToDelete.googleCalendarEventId);
      } catch (e) {
        console.warn('Could not delete from Google Calendar server:', e);
      }
    }

    onDeleteEvent(eventToDelete.id);
    setEventToDelete(null);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Top Header - Compact, refined typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Calendar &amp; Events
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Clinical consultations, study schedules, and events synced with Google Calendar.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-[0.98] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Event</span>
        </button>
      </div>

      {/* Sync Notices */}
      {syncSuccessMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}
      {syncError && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Filter Tabs - Clean, segmented, small */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {['all', 'clinical', 'study', 'financial', 'personal', 'reminder'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${
                filterCategory === cat
                  ? isDark
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                    : 'bg-white text-emerald-700 border border-slate-300 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredEvents.map((evt) => {
          const dateObj = new Date(evt.startDate);
          const isValidDate = !isNaN(dateObj.getTime());
          const dateFormatted = isValidDate
            ? dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })
            : evt.startDate;
          const timeFormatted = isValidDate
            ? dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : '';

          const isSyncing = syncingEventId === evt.id;

          const categoryColor =
            evt.category === 'clinical'
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40'
              : evt.category === 'financial'
              ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40'
              : evt.category === 'study'
              ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40'
              : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40';

          return (
            <div
              key={evt.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-2">
                {/* Header row: category, priority, and EDIT / DELETE action buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9.5px] font-semibold uppercase px-1.5 py-0.5 rounded border ${categoryColor}`}
                    >
                      {evt.category}
                    </span>
                    <span
                      className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                        evt.priority === 'urgent'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40'
                          : evt.priority === 'high'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {evt.priority}
                    </span>
                  </div>

                  {/* VISIBLE EDIT & DELETE BUTTONS */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="p-1 rounded-md text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit event"
                      aria-label="Edit event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEventToDelete(evt)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete event"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                  {evt.title}
                </h3>

                {/* Description */}
                {evt.description && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Bottom metadata and Google Sync status */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 font-mono text-[10.5px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>
                      {dateFormatted} {timeFormatted && `· ${timeFormatted}`}
                    </span>
                  </div>
                  {evt.location && (
                    <div className="flex items-center gap-1 text-[10.5px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{evt.location}</span>
                    </div>
                  )}
                </div>

                {/* Google Calendar Sync status */}
                <div>
                  {evt.syncedToGoogle ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                      <Check className="w-2.5 h-2.5" />
                      <span>Google Synced</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSyncToGoogle(evt)}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800/40 transition-colors cursor-pointer"
                    >
                      <Cloud className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-10 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No events found in this category.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            + Add a new event or appointment
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`border rounded-2xl max-w-md w-full p-4.5 shadow-2xl ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>New Event &amp; Reminder</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Event Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panchakarma Consultation / AIAPGET Mock Test"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="clinical">Clinical / OPD</option>
                    <option value="study">Study / Exam Prep</option>
                    <option value="financial">Financial / Investment</option>
                    <option value="personal">Personal / Family</option>
                    <option value="reminder">General Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Start Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    End Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Location / Practice Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ravi Shankar Clinic - Chamber 1"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific instructions, patient name, dosha notes, or checklist..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={syncDirectlyToGoogle}
                    onChange={(e) => setSyncDirectlyToGoogle(e.target.checked)}
                    className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Push to Google Calendar automatically</span>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`border rounded-2xl max-w-md w-full p-4.5 shadow-2xl ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-emerald-500" />
                <span>Edit Calendar Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Event Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panchakarma Consultation / AIAPGET Mock Test"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="clinical">Clinical / OPD</option>
                    <option value="study">Study / Exam Prep</option>
                    <option value="financial">Financial / Investment</option>
                    <option value="personal">Personal / Family</option>
                    <option value="reminder">General Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    Start Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                    End Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Location / Practice Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ravi Shankar Clinic - Chamber 1"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific instructions, patient name, dosha notes, or checklist..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={syncDirectlyToGoogle}
                    onChange={(e) => setSyncDirectlyToGoogle(e.target.checked)}
                    className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    {editingEvent.googleCalendarEventId
                      ? 'Keep synced with Google Calendar'
                      : 'Sync to Google Calendar'}
                  </span>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventToDelete(editingEvent);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs cursor-pointer"
                  >
                    Update Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Destructive Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!eventToDelete}
        title="Delete Calendar Event?"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? ${
          eventToDelete?.syncedToGoogle
            ? 'This will also remove the synced event from your Google Calendar.'
            : ''
        } This action cannot be undone.`}
        confirmLabel="Yes, Delete Event"
        cancelLabel="Keep Event"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
};
