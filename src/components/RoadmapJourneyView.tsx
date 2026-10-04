import React, { useState } from 'react';
import type { RoadmapMilestone } from '../types';
import {
  Compass,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Award,
  Hospital,
  Stethoscope,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import confetti from 'canvas-confetti';

interface RoadmapJourneyViewProps {
  milestones: RoadmapMilestone[];
  onUpdateMilestone: (milestone: RoadmapMilestone) => void;
  onAddMilestone: (milestone: RoadmapMilestone) => void;
  onDeleteMilestone: (id: string) => void;
  isDark: boolean;
}

export const RoadmapJourneyView: React.FC<RoadmapJourneyViewProps> = ({
  milestones,
  onUpdateMilestone,
  onAddMilestone,
  onDeleteMilestone,
  isDark,
}) => {
  // If a milestone is selected, open the detail page view!
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddDateOpen, setIsAddDateOpen] = useState(false);
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<RoadmapMilestone | null>(null);

  // Form states for Milestone edit
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editPeriod, setEditPeriod] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editStatus, setEditStatus] = useState<RoadmapMilestone['status']>('current');
  const [editDesc, setEditDesc] = useState('');

  // Form states for new Date
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateVal, setNewDateVal] = useState('2026-11-15');
  const [newDateType, setNewDateType] = useState<'exam' | 'submission' | 'event'>('exam');

  // Form states for new Activity
  const [newActivityText, setNewActivityText] = useState('');

  const currentDetailMilestone = milestones.find((m) => m.id === selectedMilestoneId);

  const handleToggleActivity = (activityId: string) => {
    if (!currentDetailMilestone) return;

    const updatedActivities = currentDetailMilestone.activities.map((a) => {
      if (a.id === activityId) {
        const nextDone = !a.done;
        if (nextDone) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
          });
        }
        return { ...a, done: nextDone };
      }
      return a;
    });

    onUpdateMilestone({
      ...currentDetailMilestone,
      activities: updatedActivities,
    });
  };

  const handleAddAcademicDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailMilestone || !newDateTitle.trim()) return;

    const updatedDates = [
      ...currentDetailMilestone.academicDates,
      {
        id: `d-${Date.now()}`,
        title: newDateTitle.trim(),
        date: newDateVal,
        type: newDateType,
      },
    ];

    onUpdateMilestone({
      ...currentDetailMilestone,
      academicDates: updatedDates,
    });
    setIsAddDateOpen(false);
    setNewDateTitle('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailMilestone || !newActivityText.trim()) return;

    const updatedActivities = [
      ...currentDetailMilestone.activities,
      {
        id: `act-${Date.now()}`,
        text: newActivityText.trim(),
        done: false,
      },
    ];

    onUpdateMilestone({
      ...currentDetailMilestone,
      activities: updatedActivities,
    });
    setIsAddActivityOpen(false);
    setNewActivityText('');
  };

  const handleSaveMilestoneEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailMilestone) return;

    onUpdateMilestone({
      ...currentDetailMilestone,
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      period: editPeriod.trim(),
      badge: editBadge.trim(),
      status: editStatus,
      description: editDesc.trim(),
    });
    setIsEditModalOpen(false);
  };

  const handleOpenEdit = (m: RoadmapMilestone) => {
    setEditTitle(m.title);
    setEditSubtitle(m.subtitle);
    setEditPeriod(m.period);
    setEditBadge(m.badge);
    setEditStatus(m.status);
    setEditDesc(m.description);
    setIsEditModalOpen(true);
  };

  // ================= VIEW: DEDICATED MILESTONE DETAIL PAGE =================
  if (currentDetailMilestone) {
    return (
      <div className="space-y-4 pb-20 animate-in fade-in">
        {/* Back button & Action */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedMilestoneId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Roadmap</span>
          </button>

          <button
            onClick={() => handleOpenEdit(currentDetailMilestone)}
            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit Milestone</span>
          </button>
        </div>

        {/* Milestone Detail Header Banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/20">
              {currentDetailMilestone.badge}
            </span>
            <span className="text-xs font-mono font-bold opacity-90">
              {currentDetailMilestone.period}
            </span>
          </div>

          <h2 className="text-lg font-black leading-tight tracking-tight">
            {currentDetailMilestone.title}
          </h2>
          <p className="text-xs text-emerald-100 leading-snug">
            {currentDetailMilestone.description}
          </p>
        </div>

        {/* SECTION 1: ACADEMIC / EXAM DATES IN 2026-2027 */}
        <div
          className={`p-4 rounded-3xl border space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider">
                Exams &amp; Academic Dates (2026-2027)
              </h3>
            </div>
            <button
              onClick={() => setIsAddDateOpen(true)}
              className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              + Add Date
            </button>
          </div>

          <div className="space-y-2">
            {currentDetailMilestone.academicDates.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  item.type === 'exam'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                    {item.type}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px]">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: FOR INTERNSHIP (DIVIDED INTO 6M AYURVEDA + 6M MODERN) */}
        {currentDetailMilestone.internshipPostings && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-sky-500" />
              <span>1-Year Rotatory Internship Breakdown</span>
            </h3>

            <div className="space-y-3">
              {currentDetailMilestone.internshipPostings.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-3xl border space-y-3 ${
                    post.track === 'ayurveda'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-sky-500/30 bg-sky-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        post.track === 'ayurveda'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {post.duration}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {post.track.toUpperCase()} TRACK
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Host: <span className="font-semibold">{post.hospital}</span>
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Mandatory Clinical Postings:
                    </span>
                    {post.departments.map((dept, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-2 p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: KEY ACTIVITIES & CHECKLISTS */}
        <div
          className={`p-4 rounded-3xl border space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider">
                Milestone Action Checklist
              </h3>
            </div>
            <button
              onClick={() => setIsAddActivityOpen(true)}
              className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              + Add Task
            </button>
          </div>

          <div className="space-y-2">
            {currentDetailMilestone.activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleToggleActivity(act.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                  act.done
                    ? 'opacity-60 line-through bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    : isDark
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {act.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-[11px]">
                    {act.text}
                  </span>
                </div>
                {act.date && (
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                    {act.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Date */}
        {isAddDateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className="text-sm font-bold">Add Academic Exam / Date</h3>
              <form onSubmit={handleAddAcademicDate} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Subject / Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kayachikitsa Paper 1"
                    value={newDateTitle}
                    onChange={(e) => setNewDateTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newDateVal}
                      onChange={(e) => setNewDateVal(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Type</label>
                    <select
                      value={newDateType}
                      onChange={(e) => setNewDateType(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="exam">Exam</option>
                      <option value="submission">Submission</option>
                      <option value="event">Event / Viva</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDateOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                  >
                    Save Date
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Task */}
        {isAddActivityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className="text-sm font-bold">Add Action Checklist Task</h3>
              <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Task Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete clinical ward attendance log"
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddActivityOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Milestone */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className="text-sm font-bold">Edit Milestone</h3>
              <form onSubmit={handleSaveMilestoneEdit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Period (Years)</label>
                    <input
                      type="text"
                      value={editPeriod}
                      onChange={(e) => setEditPeriod(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 capitalize"
                    >
                      <option value="current">Current</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: FLOW CHART / ROAD WISE JOURNEY =================
  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Roadmap
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step master milestones from Final Proff to Clinic
          </p>
        </div>

        <button
          onClick={() => {
            const newM: RoadmapMilestone = {
              id: `milestone-${Date.now()}`,
              key: 'custom',
              title: 'Custom Career Goal',
              subtitle: 'Next Milestone',
              badge: 'Vision',
              period: '2029',
              status: 'upcoming',
              description: 'Personal growth and clinical milestone.',
              academicDates: [],
              activities: [],
              notes: '',
            };
            onAddMilestone(newM);
            setSelectedMilestoneId(newM.id);
          }}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Milestone</span>
        </button>
      </div>

      {/* ROAD WISE FLOW CHART (Vertical Timeline with connecting road path) */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-slate-300 dark:before:to-slate-700">
        {milestones.map((m, index) => {
          const isCurrent = m.status === 'current';
          const isCompleted = m.status === 'completed';

          return (
            <div key={m.id} className="relative group">
              {/* Milestone Step Indicator on Road */}
              <div
                className={`absolute -left-6 top-4 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-110 ${
                  isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {index + 1}
              </div>

              {/* Milestone Card (Click to open full detail page!) */}
              <div
                onClick={() => setSelectedMilestoneId(m.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {m.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {m.period}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {m.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.subtitle}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    📅 {m.academicDates.length} Dates Configured
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span>Tap for details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
