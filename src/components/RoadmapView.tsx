import React, { useState } from 'react';
import type { Roadmap, RoadmapPhase, RoadmapStep } from '../types';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Plus,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Coins,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoadmapViewProps {
  roadmaps: Roadmap[];
  onUpdateRoadmap: (roadmap: Roadmap) => void;
  onAddRoadmap: (roadmap: Roadmap) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmaps,
  onUpdateRoadmap,
  onAddRoadmap,
}) => {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(
    roadmaps[0]?.id || 'roadmap-clinical-setup'
  );
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [isCreateRoadmapModalOpen, setIsCreateRoadmapModalOpen] = useState(false);

  // New Roadmap form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Roadmap['category']>('custom');
  const [newDescription, setNewDescription] = useState('');

  const currentRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0];

  const handleToggleChecklist = (
    phaseId: string,
    stepId: string,
    checklistItemId: string
  ) => {
    if (!currentRoadmap) return;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedPhases = currentRoadmap.phases.map((phase) => {
      if (phase.id !== phaseId) {
        // Count tasks
        phase.steps.forEach((s) => {
          totalTasks += s.checklist.length;
          completedTasks += s.checklist.filter((c) => c.done).length;
        });
        return phase;
      }

      const updatedSteps = phase.steps.map((step) => {
        if (step.id !== stepId) {
          totalTasks += step.checklist.length;
          completedTasks += step.checklist.filter((c) => c.done).length;
          return step;
        }

        const updatedChecklist = step.checklist.map((item) => {
          if (item.id === checklistItemId) {
            const newDone = !item.done;
            if (newDone) {
              confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.75 },
              });
            }
            return { ...item, done: newDone };
          }
          return item;
        });

        // Determine step status
        const allDone = updatedChecklist.every((c) => c.done);
        const anyDone = updatedChecklist.some((c) => c.done);
        const newStatus: RoadmapStep['status'] = allDone
          ? 'completed'
          : anyDone
          ? 'in_progress'
          : 'pending';

        totalTasks += updatedChecklist.length;
        completedTasks += updatedChecklist.filter((c) => c.done).length;

        return {
          ...step,
          status: newStatus,
          checklist: updatedChecklist,
        };
      });

      return { ...phase, steps: updatedSteps };
    });

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const updatedRoadmap: Roadmap = {
      ...currentRoadmap,
      phases: updatedPhases,
      overallProgress: progress,
    };

    onUpdateRoadmap(updatedRoadmap);

    if (progress === 100) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    }
  };

  const handleStepStatusChange = (
    phaseId: string,
    stepId: string,
    newStatus: RoadmapStep['status']
  ) => {
    if (!currentRoadmap) return;

    const updatedPhases = currentRoadmap.phases.map((phase) => {
      if (phase.id !== phaseId) return phase;

      const updatedSteps = phase.steps.map((step) => {
        if (step.id !== stepId) return step;
        return { ...step, status: newStatus };
      });
      return { ...phase, steps: updatedSteps };
    });

    onUpdateRoadmap({
      ...currentRoadmap,
      phases: updatedPhases,
    });
  };

  const handleCreateCustomRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRoadmap: Roadmap = {
      id: `roadmap-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom strategic roadmap.',
      overallProgress: 0,
      phases: [
        {
          id: `phase-${Date.now()}-1`,
          phaseName: 'Phase 1: Foundation & Planning',
          order: 1,
          steps: [
            {
              id: `step-${Date.now()}-1`,
              title: 'Initial Research & Strategy Definition',
              description: 'Detail the primary steps, goals and requirements.',
              status: 'pending',
              budgetEstimated: 10000,
              checklist: [
                { id: `c-${Date.now()}-1`, text: 'Define 3 key objectives', done: false },
                { id: `c-${Date.now()}-2`, text: 'Allocate timeline and budget', done: false },
              ],
            },
          ],
        },
      ],
    };

    onAddRoadmap(newRoadmap);
    setSelectedRoadmapId(newRoadmap.id);
    setIsCreateRoadmapModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Interactive Roadmaps Master</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step strategic execution plans for clinical launch, exam success &amp; financial freedom.
          </p>
        </div>

        <button
          onClick={() => setIsCreateRoadmapModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Custom Roadmap</span>
        </button>
      </div>

      {/* Roadmap Track Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {roadmaps.map((r) => {
          const isSelected = r.id === selectedRoadmapId;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRoadmapId(r.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {r.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {r.overallProgress}%
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{r.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{r.description}</p>
              </div>

              <div className="mt-3 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${r.overallProgress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Roadmap Detailed View */}
      {currentRoadmap && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-sm">
          {/* Roadmap Header banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentRoadmap.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">
                  {currentRoadmap.phases.reduce((sum, p) => sum + p.steps.length, 0)} Total Action Steps
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{currentRoadmap.title}</h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {currentRoadmap.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Roadmap Progress</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  {currentRoadmap.overallProgress}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center text-xs font-bold text-white relative">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-500"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${currentRoadmap.overallProgress}%, 0 ${currentRoadmap.overallProgress}%)`,
                  }}
                ></div>
                <span>🎯</span>
              </div>
            </div>
          </div>

          {/* Phases & Steps List */}
          <div className="space-y-8">
            {currentRoadmap.phases.map((phase, pIdx) => (
              <div key={phase.id} className="space-y-4">
                {/* Phase Title Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    {pIdx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {phase.phaseName}
                  </h4>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                {/* Steps in Phase */}
                <div className="space-y-3 pl-2 md:pl-5 border-l-2 border-slate-800 ml-3.5">
                  {phase.steps.map((step) => {
                    const isExpanded = expandedStepId === step.id;
                    const completedTasksCount = step.checklist.filter((c) => c.done).length;

                    const statusBadge =
                      step.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : step.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : step.status === 'blocked'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700';

                    return (
                      <div
                        key={step.id}
                        className="rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all overflow-hidden shadow-xs"
                      >
                        {/* Step Header */}
                        <div
                          onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {step.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : step.status === 'in_progress' ? (
                                <Clock className="w-5 h-5 text-amber-400" />
                              ) : step.status === 'blocked' ? (
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-xs font-bold text-white">{step.title}</h5>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                                  {step.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                            {step.budgetEstimated && (
                              <div className="text-right text-xs">
                                <span className="text-[10px] text-slate-400 uppercase">Est. Budget</span>
                                <p className="font-bold text-amber-300 font-mono">
                                  ₹{step.budgetEstimated.toLocaleString('en-IN')}
                                </p>
                              </div>
                            )}

                            <div className="text-right text-xs">
                              <span className="text-[10px] text-slate-400">Tasks</span>
                              <p className="font-bold text-slate-200">
                                {completedTasksCount}/{step.checklist.length}
                              </p>
                            </div>

                            <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Checklist details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-700/60 bg-slate-900/60 space-y-4 text-xs">
                            <div>
                              <p className="font-semibold text-slate-200 mb-2">Step Milestones &amp; Checklist:</p>
                              <div className="space-y-2">
                                {step.checklist.map((taskItem) => (
                                  <div
                                    key={taskItem.id}
                                    onClick={() =>
                                      handleToggleChecklist(phase.id, step.id, taskItem.id)
                                    }
                                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                      taskItem.done
                                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      {taskItem.done ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                                      )}
                                      <span className={taskItem.done ? 'line-through text-slate-400' : ''}>
                                        {taskItem.text}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">
                                      {taskItem.done ? 'Done' : 'Tap to complete'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Status Changer */}
                            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                              <span className="text-slate-400">Manual Override Status:</span>
                              <div className="flex items-center gap-1.5">
                                {(['pending', 'in_progress', 'completed', 'blocked'] as const).map(
                                  (st) => (
                                    <button
                                      key={st}
                                      onClick={() => handleStepStatusChange(phase.id, step.id, st)}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase transition-all cursor-pointer ${
                                        step.status === st
                                          ? 'bg-emerald-600 text-white shadow-xs'
                                          : 'bg-slate-800 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {st.replace('_', ' ')}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom Roadmap Modal */}
      {isCreateRoadmapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Create New Strategic Roadmap</h3>
            <form onSubmit={handleCreateCustomRoadmap} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Roadmap Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tele-Ayurveda Global Expansion / Herbal Brand Launch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="clinical_setup">Clinical Practice &amp; Hospital</option>
                  <option value="exam_prep">Exam Prep &amp; Academics</option>
                  <option value="multiple_income">Wealth &amp; Earning Streams</option>
                  <option value="custom">Custom Life Vision</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Goal</label>
                <textarea
                  rows={3}
                  placeholder="What is the ultimate milestone of this roadmap?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateRoadmapModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  Create Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
