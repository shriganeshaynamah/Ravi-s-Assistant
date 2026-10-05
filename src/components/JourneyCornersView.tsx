import React, { useState, useMemo } from 'react';
import type { JournalEntry } from '../types';
import {
  Lock,
  Unlock,
  KeyRound,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Search,
  Sparkles,
  Calendar,
  Clock,
  Heart,
  Smile,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JourneyCornersViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  isDark?: boolean;
}

const VAULT_PASSCODE = '0002';

export const JourneyCornersView: React.FC<JourneyCornersViewProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  isDark = true,
}) => {
  // Vault lock state (default locked)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('ayurlife_vault_unlocked') === 'true';
  });

  // PIN input
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // Modal / Form state
  const [isWritingModalOpen, setIsWritingModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [formMood, setFormMood] = useState<JournalEntry['mood']>('peaceful');
  const [formCategory, setFormCategory] = useState<JournalEntry['category']>('personal');
  const [formGratitude, setFormGratitude] = useState('');
  const [formReflection, setFormReflection] = useState('');
  const [formTags, setFormTags] = useState('');

  // Handle PIN button click
  const handleDigitClick = (digit: string) => {
    if (enteredPin.length >= 4) return;
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    setPinError('');

    if (nextPin.length === 4) {
      if (nextPin === VAULT_PASSCODE) {
        setIsUnlocked(true);
        sessionStorage.setItem('ayurlife_vault_unlocked', 'true');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setIsShaking(true);
        setPinError('Incorrect Passcode. Hint: Opposite number');
        setTimeout(() => {
          setIsShaking(false);
          setEnteredPin('');
        }, 800);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const handleClearPin = () => {
    setEnteredPin('');
    setPinError('');
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('ayurlife_vault_unlocked');
    setEnteredPin('');
  };

  // Open Add Modal
  const handleOpenNewEntry = () => {
    setEditingEntry(null);
    setFormTitle('');
    setFormContent('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setFormMood('peaceful');
    setFormCategory('personal');
    setFormGratitude('');
    setFormReflection('');
    setFormTags('Diary, Personal');
    setIsWritingModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormTitle(entry.title);
    setFormContent(entry.content);
    setFormDate(entry.date);
    setFormTime(entry.time || '10:00 AM');
    setFormMood(entry.mood);
    setFormCategory(entry.category);
    setFormGratitude(entry.gratitude || '');
    setFormReflection(entry.reflection || '');
    setFormTags((entry.tags || []).join(', '));
    setIsWritingModalOpen(true);
  };

  // Save Entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingEntry) {
      onUpdateEntry({
        ...editingEntry,
        title: formTitle.trim(),
        content: formContent.trim(),
        date: formDate,
        time: formTime,
        mood: formMood,
        category: formCategory,
        gratitude: formGratitude.trim() || undefined,
        reflection: formReflection.trim() || undefined,
        tags: parsedTags,
      });
    } else {
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        date: formDate,
        time: formTime,
        mood: formMood,
        category: formCategory,
        gratitude: formGratitude.trim() || undefined,
        reflection: formReflection.trim() || undefined,
        tags: parsedTags,
        isPinned: false,
      };
      onAddEntry(newEntry);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    }

    setIsWritingModalOpen(false);
    setEditingEntry(null);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const matchesQuery =
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesMood = selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;

        return matchesQuery && matchesMood;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [entries, searchQuery, selectedMoodFilter]);

  // Mood icons / labels helper
  const getMoodDisplay = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'victorious':
        return { emoji: '🏆', label: 'Victorious', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' };
      case 'inspired':
        return { emoji: '💡', label: 'Inspired', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60' };
      case 'grateful':
        return { emoji: '🙏', label: 'Grateful', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' };
      case 'energetic':
        return { emoji: '⚡', label: 'Energetic', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/60' };
      case 'thoughtful':
        return { emoji: '💭', label: 'Thoughtful', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
      case 'joyful':
        return { emoji: '😄', label: 'Joyful', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/60' };
      case 'focused':
        return { emoji: '🎯', label: 'Focused', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
      default:
        return { emoji: '🧘', label: 'Peaceful', color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/60' };
    }
  };

  // ================= RENDER LOCKED SCREEN (PASSCODE 0002) =================
  if (!isUnlocked) {
    return (
      <div className="space-y-4 pb-32 animate-in fade-in max-w-sm mx-auto">
        <div className="text-center py-4 space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Journal
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Your personal journal &amp; confidential reflections. Enter passcode to access.
          </p>
        </div>

        {/* PIN Entry Display */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col items-center space-y-2.5">
            <div className="flex items-center gap-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const filled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-emerald-500 scale-110 shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>

            {pinError && (
              <p className={`text-[11px] font-semibold text-rose-500 ${isShaking ? 'animate-bounce' : ''}`}>
                {pinError}
              </p>
            )}

            <div className="p-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-emerald-500" />
              <span>Passcode Hint: <strong className="text-emerald-600 dark:text-emerald-400">Opposite number</strong></span>
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitClick(digit)}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-2xs border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                {digit}
              </button>
            ))}

            <button
              onClick={handleClearPin}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            >
              Clear
            </button>

            <button
              onClick={() => handleDigitClick('0')}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-2xs border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            >
              0
            </button>

            <button
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER UNLOCKED PERSONAL VAULT & DAILY DIARY =================
  return (
    <div className="space-y-4 pb-32 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Journal</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Daily journal, reflections &amp; personal notes
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLockVault}
            className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            title="Lock Vault"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Lock</span>
          </button>

          <button
            onClick={handleOpenNewEntry}
            className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Write Diary</span>
          </button>
        </div>
      </div>

      {/* Vault Stats Bar */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
            Journal Protected • {entries.length} Journal Entries
          </span>
        </div>
        <span className="text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
          Cloud Auto-Saved
        </span>
      </div>

      {/* Search & Mood Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search diary thoughts, clinical notes, gratitude..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Mood filter pill tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <button
            onClick={() => setSelectedMoodFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedMoodFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Entries ({entries.length})
          </button>
          {['peaceful', 'inspired', 'victorious', 'grateful', 'focused'].map((mood) => {
            const moodInfo = getMoodDisplay(mood as JournalEntry['mood']);
            return (
              <button
                key={mood}
                onClick={() => setSelectedMoodFilter(mood)}
                className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedMoodFilter === mood
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{moodInfo.emoji}</span>
                <span>{moodInfo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-3">
          <BookOpen className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {searchQuery ? 'No Diary Entries Match Your Search' : 'Your Diary Vault is Empty'}
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Pen your daily thoughts, BAMS learnings, life reflections, or moments of gratitude.
          </p>
          <button
            onClick={handleOpenNewEntry}
            className="py-2 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
          >
            + Write First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const mood = getMoodDisplay(entry.mood);

            return (
              <div
                key={entry.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-400/50 transition-all"
              >
                {/* Entry Top Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${mood.color}`}>
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </span>

                      {entry.time && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.time}
                        </span>
                      )}

                      {entry.isPinned && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md">
                          <Pin className="w-2.5 h-2.5 fill-amber-500" />
                          Pinned
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {entry.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        onUpdateEntry({ ...entry, isPinned: !entry.isPinned })
                      }
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        entry.isPinned
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={entry.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEntryToDelete(entry)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Entry Content (Lined paper / diary feel) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {entry.content}
                </div>

                {/* Gratitude box if present */}
                {entry.gratitude && (
                  <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-300 flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 fill-rose-500/20" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[10px] uppercase tracking-wider block">
                        Today's Gratitude:
                      </span>
                      <p className="text-[11px] leading-snug">{entry.gratitude}</p>
                    </div>
                  </div>
                )}

                {/* Reflection box if present */}
                {entry.reflection && (
                  <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[10px] uppercase tracking-wider block">
                        Self-Reflection / Learning:
                      </span>
                      <p className="text-[11px] leading-snug">{entry.reflection}</p>
                    </div>
                  </div>
                )}

                {/* Tags bottom row */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {entry.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: WRITE / EDIT DIARY ENTRY ================= */}
      {isWritingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>{editingEntry ? 'Edit Diary Entry' : 'New Journal Entry'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsWritingModalOpen(false);
                  setEditingEntry(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Diary Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical OPD Experience, Charaka Study, Reflections"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mood
                  </label>
                  <select
                    value={formMood}
                    onChange={(e) => setFormMood(e.target.value as JournalEntry['mood'])}
                    className="w-full px-2 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="peaceful">🧘 Peaceful</option>
                    <option value="inspired">💡 Inspired</option>
                    <option value="victorious">🏆 Victorious</option>
                    <option value="grateful">🙏 Grateful</option>
                    <option value="energetic">⚡ Energetic</option>
                    <option value="focused">🎯 Focused</option>
                    <option value="thoughtful">💭 Thoughtful</option>
                    <option value="joyful">😄 Joyful</option>
                  </select>
                </div>
              </div>

              {/* Diary Content Area */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Diary Entry (Reflections, Thoughts, Log) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Pen your thoughts freely... How was your day? What did you discover in your studies or clinical rounds?"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* Gratitude & Learnings */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Daily Gratitude (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="3 things I am deeply grateful for today..."
                  value={formGratitude}
                  onChange={(e) => setFormGratitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-500" />
                  <span>Key Reflection / Learning (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="What could I improve tomorrow? Lesson of the day..."
                  value={formReflection}
                  onChange={(e) => setFormReflection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Clinical, Charaka, Meditation, Personal"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsWritingModalOpen(false);
                    setEditingEntry(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingEntry ? 'Save Changes' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE DIARY ENTRY CONFIRMATION ================= */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-3 animate-in zoom-in-95">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Delete Diary Entry?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to permanently delete <strong className="text-slate-700 dark:text-slate-200">"{entryToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEntryToDelete(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteEntry(entryToDelete.id);
                  setEntryToDelete(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
