import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getSavedUser } from './services/firebase';
import {
  getStoredData,
  setStoredData,
  autoSaveToCloud,
  hydrateFromPersistentDB,
  STORAGE_KEYS,
  defaultMilestones,
  defaultLoans,
  defaultInvestments,
  defaultNotifications,
  defaultKeepNotes,
  defaultExpensesList,
  defaultDinacharyaLogs,
  defaultHabits,
  defaultJournalEntries,
} from './services/storage';
import type {
  CalendarEvent,
  NoteItem,
  ChecklistTask,
  ExpenseRecord,
  LoanItem,
  InvestmentItem,
  RoadmapMilestone,
  AppNotification,
  DinacharyaLog,
  HabitItem,
  JournalEntry,
} from './types';

// Components
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { HamburgerDrawer, type FeatureTab } from './components/HamburgerDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { HomeExploreView } from './components/HomeExploreView';
import { ExpenseManagerView } from './components/ExpenseManagerView';
import { RoadmapJourneyView } from './components/RoadmapJourneyView';
import { KeepNotesView } from './components/KeepNotesView';
import { KeepToDoView } from './components/KeepToDoView';
import { ToolsView } from './components/ToolsView';
import { CalendarView } from './components/CalendarView';
import { HabitTrackerView } from './components/HabitTrackerView';
import { JourneyCornersView } from './components/JourneyCornersView';
import { CloudSyncModal } from './components/CloudSyncModal';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { RaviAssistantView } from './components/RaviAssistantView';

export default function App() {
  const [user, setUser] = useState<User | null>(() => getSavedUser());

  // Day (Light) or Night (Dark) mode toggle
  const [isDark, setIsDark] = useState<boolean>(() => {
    return getStoredData<boolean>(STORAGE_KEYS.THEME, false);
  });

  const [activeFeature, setActiveFeature] = useState<FeatureTab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);

  // Core Data States
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(() =>
    getStoredData(STORAGE_KEYS.MILESTONES, defaultMilestones)
  );

  const [loans, setLoans] = useState<LoanItem[]>(() => {
    const stored = getStoredData<LoanItem[]>(STORAGE_KEYS.LOANS, defaultLoans);
    return (stored || []).filter((l) => l.id !== 'loan-1' && l.id !== 'loan-2');
  });

  const [investments, setInvestments] = useState<InvestmentItem[]>(() => {
    const stored = getStoredData<InvestmentItem[]>(STORAGE_KEYS.INVESTMENTS, defaultInvestments);
    return (stored || []).filter((inv) => inv.id !== 'inv-1' && inv.id !== 'inv-2');
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const stored = getStoredData<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, defaultExpensesList);
    return (stored || []).filter(
      (e) => e.id !== 'exp-1' && e.id !== 'exp-2' && e.id !== 'exp-3' && e.id !== 'exp-4'
    );
  });

  const [notes, setNotes] = useState<NoteItem[]>(() =>
    getStoredData(STORAGE_KEYS.NOTES, defaultKeepNotes)
  );

  const [tasks, setTasks] = useState<ChecklistTask[]>(() =>
    getStoredData(STORAGE_KEYS.CHECKLISTS, [
      { id: 't1', text: 'Revise Charaka Samhita Kayachikitsa Sutras', isCompleted: false, category: 'exam_study', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't2', text: 'Verify 50 Clinical Case Log Diaries with Professor', isCompleted: true, category: 'clinic_prep', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't3', text: 'Pay SBI Education Loan EMI by 10th', isCompleted: false, category: 'financial', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't4', text: 'Review 6M Ayurveda & 6M Modern hospital posting preferences', isCompleted: false, category: 'clinic_prep', priority: 'medium', createdAt: new Date().toISOString() },
    ])
  );

  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getStoredData(STORAGE_KEYS.EVENTS, [
      {
        id: 'e1',
        title: 'Kayachikitsa Final Proff Paper I Exam',
        startDate: '2026-11-15T09:30',
        endDate: '2026-11-15T12:30',
        category: 'study',
        priority: 'urgent',
        location: 'College Examination Hall',
        syncedToGoogle: false,
      },
      {
        id: 'e2',
        title: 'Shalya Tantra Theory Paper II',
        startDate: '2026-11-20T09:30',
        endDate: '2026-11-20T12:30',
        category: 'study',
        priority: 'high',
        location: 'College Examination Hall',
        syncedToGoogle: false,
      },
      {
        id: 'e3',
        title: 'Hospital Clinical Bedside Duty',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        category: 'clinical',
        priority: 'high',
        location: 'Panchakarma & OPD Ward',
        syncedToGoogle: false,
      },
    ])
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStoredData(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications)
  );

  const [dinacharyaLogs, setDinacharyaLogs] = useState<DinacharyaLog[]>(() =>
    getStoredData(STORAGE_KEYS.DINACHARYA, defaultDinacharyaLogs)
  );

  const [habits, setHabits] = useState<HabitItem[]>(() =>
    getStoredData(STORAGE_KEYS.HABITS, defaultHabits)
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    getStoredData(STORAGE_KEYS.JOURNAL, defaultJournalEntries)
  );

  // Sync Auth & Hydrate Persistent IndexedDB on Launch (for Website, Vercel & Android APK)
  useEffect(() => {
    const unsub = initAuth(
      (u) => setUser(u),
      () => {
        const saved = getSavedUser();
        setUser(saved);
      }
    );

    hydrateFromPersistentDB((snap) => {
      if (snap.milestones) setMilestones(snap.milestones);
      if (snap.loans) setLoans(snap.loans);
      if (snap.investments) setInvestments(snap.investments);
      if (snap.expenses) setExpenses(snap.expenses);
      if (snap.notes) setNotes(snap.notes);
      if (snap.tasks) setTasks(snap.tasks);
      if (snap.events) setEvents(snap.events);
      if (snap.notifications) setNotifications(snap.notifications);
      if (snap.dinacharyaLogs) setDinacharyaLogs(snap.dinacharyaLogs);
      if (snap.habits) setHabits(snap.habits);
      if (snap.journalEntries) setJournalEntries(snap.journalEntries);
    });

    return () => unsub();
  }, []);

  // Save changes to storage & auto-sync to cloud
  useEffect(() => {
    setStoredData(STORAGE_KEYS.THEME, isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.MILESTONES, milestones);
    setStoredData(STORAGE_KEYS.LOANS, loans);
    setStoredData(STORAGE_KEYS.INVESTMENTS, investments);
    setStoredData(STORAGE_KEYS.EXPENSES, expenses);
    setStoredData(STORAGE_KEYS.NOTES, notes);
    setStoredData(STORAGE_KEYS.CHECKLISTS, tasks);
    setStoredData(STORAGE_KEYS.EVENTS, events);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    setStoredData(STORAGE_KEYS.DINACHARYA, dinacharyaLogs);
    setStoredData(STORAGE_KEYS.HABITS, habits);
    setStoredData(STORAGE_KEYS.JOURNAL, journalEntries);

    const fullSnapshot = {
      milestones,
      loans,
      investments,
      expenses,
      notes,
      tasks,
      events,
      notifications,
      dinacharyaLogs,
      habits,
      journalEntries,
    };

    // Auto-save full snapshot to localStorage + IndexedDB
    autoSaveToCloud(fullSnapshot);

    const handlePersistOnHide = () => {
      autoSaveToCloud(fullSnapshot);
    };
    window.addEventListener('pagehide', handlePersistOnHide);
    document.addEventListener('visibilitychange', handlePersistOnHide);
    return () => {
      window.removeEventListener('pagehide', handlePersistOnHide);
      document.removeEventListener('visibilitychange', handlePersistOnHide);
    };
  }, [
    milestones,
    loans,
    investments,
    expenses,
    notes,
    tasks,
    events,
    notifications,
    dinacharyaLogs,
    habits,
    journalEntries,
  ]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Task toggle
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  // Cloud sync helpers
  const getAllCurrentData = () => ({
    milestones,
    loans,
    investments,
    expenses,
    notes,
    tasks,
    events,
    notifications,
    dinacharyaLogs,
    habits,
    journalEntries,
  });

  const handleRestoreData = (data: any) => {
    if (data.milestones) setMilestones(data.milestones);
    if (data.loans) setLoans(data.loans);
    if (data.investments) setInvestments(data.investments);
    if (data.expenses) setExpenses(data.expenses);
    if (data.notes) setNotes(data.notes);
    if (data.tasks) setTasks(data.tasks);
    if (data.events) setEvents(data.events);
    if (data.notifications) setNotifications(data.notifications);
    if (data.dinacharyaLogs) setDinacharyaLogs(data.dinacharyaLogs);
    if (data.habits) setHabits(data.habits);
    if (data.journalEntries) setJournalEntries(data.journalEntries);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#F8F9FA] text-slate-800'
      }`}
    >
      {/* App Header (Structured with Dr. Ravi Shankar brand & live cloud auto-save) */}
      <AppHeader
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        user={user}
        isDark={isDark}
      />

      {/* Main Content Area - pb-32 ensures bottom is never hidden behind footer */}
      <main className="flex-1 px-3 sm:px-6 py-4 pb-32 max-w-4xl mx-auto w-full overflow-y-auto">
        {activeFeature === 'home' && (
          <HomeExploreView
            onNavigate={(tab) => {
              if (tab === 'cloud') setIsCloudSyncOpen(true);
              else setActiveFeature(tab);
            }}
            milestones={milestones}
            loans={loans}
            investments={investments}
            expenses={expenses}
            notes={notes}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            isDark={isDark}
          />
        )}

        {(activeFeature === 'expense' || activeFeature === 'loans' || activeFeature === 'investments') && (
          <ExpenseManagerView
            expenses={expenses}
            loans={loans}
            investments={investments}
            initialTab={
              activeFeature === 'loans'
                ? 'loans'
                : activeFeature === 'investments'
                ? 'investments'
                : 'expenses'
            }
            onAddExpense={(e) => setExpenses((prev) => [e, ...prev])}
            onDeleteExpense={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
            onAddLoan={(l) => setLoans((prev) => [l, ...prev])}
            onUpdateLoan={(l) => setLoans((prev) => prev.map((item) => (item.id === l.id ? l : item)))}
            onDeleteLoan={(id) => setLoans((prev) => prev.filter((l) => l.id !== id))}
            onAddInvestment={(i) => setInvestments((prev) => [i, ...prev])}
            onUpdateInvestment={(i) => setInvestments((prev) => prev.map((item) => (item.id === i.id ? i : item)))}
            onDeleteInvestment={(id) => setInvestments((prev) => prev.filter((i) => i.id !== id))}
            user={user}
            onRequireAuth={() => setIsCloudSyncOpen(true)}
            isDark={isDark}
          />
        )}

        {activeFeature === 'roadmap' && (
          <RoadmapJourneyView
            milestones={milestones}
            onUpdateMilestone={(m) => setMilestones((prev) => prev.map((item) => (item.id === m.id ? m : item)))}
            onAddMilestone={(m) => setMilestones((prev) => [...prev, m])}
            onDeleteMilestone={(id) => setMilestones((prev) => prev.filter((m) => m.id !== id))}
            isDark={isDark}
          />
        )}

        {activeFeature === 'assistant' && (
          <RaviAssistantView
            loans={loans}
            investments={investments}
            expenses={expenses}
            habits={habits}
            dinacharyaLogs={dinacharyaLogs}
            milestones={milestones}
            tasks={tasks}
            onNavigate={(tab) => setActiveFeature(tab)}
            isDark={isDark}
          />
        )}

        {activeFeature === 'keeptodo' && (
          <KeepToDoView
            tasks={tasks}
            onAddTask={(t) => setTasks((prev) => [t, ...prev])}
            onToggleTask={handleToggleTask}
            onUpdateTask={(t) => setTasks((prev) => prev.map((item) => (item.id === t.id ? t : item)))}
            onDeleteTask={(id) => setTasks((prev) => prev.filter((item) => item.id !== id))}
            onNavigateToNotes={() => setActiveFeature('notes')}
            isDark={isDark}
          />
        )}

        {activeFeature === 'notes' && (
          <KeepNotesView
            notes={notes}
            onAddNote={(n) => setNotes((prev) => [n, ...prev])}
            onUpdateNote={(n) => setNotes((prev) => prev.map((item) => (item.id === n.id ? n : item)))}
            onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
            onNavigateToKeepToDo={() => setActiveFeature('keeptodo')}
            isDark={isDark}
          />
        )}

        {activeFeature === 'tools' && <ToolsView isDark={isDark} />}

        {activeFeature === 'calendar' && (
          <CalendarView
            events={events}
            user={user}
            onAddEvent={(e) => setEvents((prev) => [e, ...prev])}
            onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
            onUpdateEvent={(e) => setEvents((prev) => prev.map((item) => (item.id === e.id ? e : item)))}
            onRequireAuth={() => setIsCloudSyncOpen(true)}
            isDark={isDark}
          />
        )}

        {activeFeature === 'dinacharya' && (
          <HabitTrackerView
            habits={habits}
            onAddHabit={(h) => setHabits((prev) => [h, ...prev])}
            onUpdateHabit={(h) => setHabits((prev) => prev.map((item) => (item.id === h.id ? h : item)))}
            onDeleteHabit={(id) => setHabits((prev) => prev.filter((item) => item.id !== id))}
            dinacharyaLogs={dinacharyaLogs}
            onSaveDinacharyaLog={(log) => {
              setDinacharyaLogs((prev) => {
                const idx = prev.findIndex((l) => l.date === log.date);
                let copy: DinacharyaLog[];
                if (idx >= 0) {
                  copy = [...prev];
                  copy[idx] = log;
                } else {
                  copy = [log, ...prev];
                }
                setStoredData(STORAGE_KEYS.DINACHARYA, copy);
                return copy;
              });
            }}
            isDark={isDark}
          />
        )}

        {activeFeature === 'corners' && (
          <JourneyCornersView
            entries={journalEntries}
            onAddEntry={(entry) => setJournalEntries((prev) => [entry, ...prev])}
            onUpdateEntry={(entry) => setJournalEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))}
            onDeleteEntry={(id) => setJournalEntries((prev) => prev.filter((e) => e.id !== id))}
            isDark={isDark}
          />
        )}
      </main>

      {/* Floating AI Assistant & Notifications Bot (above bottom footer) */}
      <FloatingAIAssistant
        loans={loans}
        investments={investments}
        expenses={expenses}
        habits={habits}
        journalEntries={journalEntries}
        dinacharyaLogs={dinacharyaLogs}
        milestones={milestones}
        tasks={tasks}
        onNavigate={(tab) => {
          if (tab === 'cloud') setIsCloudSyncOpen(true);
          else setActiveFeature(tab);
        }}
        isDark={isDark}
      />

      {/* App Footer Navigation Bar (Home, Expense, Roadmap, Tools, Notes) */}
      <AppFooter
        activeTab={activeFeature}
        onSelectTab={(tab) => setActiveFeature(tab)}
        isDark={isDark}
      />

      {/* Slide-out Hamburger Drawer with Day/Night toggle */}
      <HamburgerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeFeature={activeFeature}
        onSelectFeature={(feat) => {
          if (feat === 'cloud') {
            setIsCloudSyncOpen(true);
          } else {
            setActiveFeature(feat);
          }
        }}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        user={user}
        onSignIn={async () => {
          try {
            const res = await googleSignIn();
            if (res?.user) setUser(res.user);
          } catch (e) {
            console.error(e);
          }
        }}
        onSignOut={async () => {
          await logout();
          setUser(null);
        }}
      />

      {/* Short, clear Alerts Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onClearAll={handleClearAllNotifications}
        isDark={isDark}
      />

      {/* Cloud Sync Modal with Google Drive & Google Sheets */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        user={user}
        onUserChange={setUser}
        getAllData={getAllCurrentData}
        onRestoreData={handleRestoreData}
        events={events}
        expenses={expenses}
        onUpdateEvent={(event) =>
          setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
        }
        isDark={isDark}
      />
    </div>
  );
}
