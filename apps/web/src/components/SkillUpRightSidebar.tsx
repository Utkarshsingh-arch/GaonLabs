import React, { useState, useEffect } from 'react';
import {
  Flame,
  FileText,
  GitBranch,
  Check,
  ChevronRight,
  Plus,
  Sparkles,
  Calendar,
  RotateCcw
} from 'lucide-react';

interface TaskItem {
  id: string;
  dayId: string; // 'su' | 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa'
  title: string;
  category: string;
  deadline: string;
  type: 'flame' | 'document' | 'branch' | 'completed';
  originalType: 'flame' | 'document' | 'branch';
  isDone: boolean;
}

interface DayMeta {
  id: string;
  label: string;
  dayName: string;
  date: number;
  fixedProgress?: number;
  isCurrent: boolean;
  focusMinutes: number;
}

const DAYS: DayMeta[] = [
  { id: 'su', label: 'SU', dayName: 'Sunday', date: 23, fixedProgress: 20, isCurrent: false, focusMinutes: 35 },
  { id: 'mo', label: 'MO', dayName: 'Monday', date: 24, fixedProgress: 75, isCurrent: false, focusMinutes: 110 },
  { id: 'tu', label: 'TU', dayName: 'Tuesday', date: 25, fixedProgress: 100, isCurrent: false, focusMinutes: 145 },
  { id: 'we', label: 'WE', dayName: 'Wednesday', date: 26, isCurrent: true, focusMinutes: 85 },
  { id: 'th', label: 'TH', dayName: 'Thursday', date: 27, fixedProgress: 0, isCurrent: false, focusMinutes: 0 },
  { id: 'fr', label: 'FR', dayName: 'Friday', date: 28, fixedProgress: 0, isCurrent: false, focusMinutes: 0 },
  { id: 'sa', label: 'SA', dayName: 'Saturday', date: 29, fixedProgress: 0, isCurrent: false, focusMinutes: 0 },
];

const INITIAL_TASKS: TaskItem[] = [
  // Wednesday (Today) Tasks - matching screenshot
  {
    id: 'task-1',
    dayId: 'we',
    title: 'Exceptions and their handling',
    category: 'Lesson 15',
    deadline: 'Deadline: 07/25',
    type: 'flame',
    originalType: 'flame',
    isDone: false,
  },
  {
    id: 'task-2',
    dayId: 'we',
    title: 'Code for example of exception',
    category: 'Homework',
    deadline: 'Deadline: 07/25',
    type: 'document',
    originalType: 'document',
    isDone: false,
  },
  {
    id: 'task-3',
    dayId: 'we',
    title: "Hierarchy of python's built-in exceptions",
    category: 'Article',
    deadline: 'Deadline: 07/29',
    type: 'branch',
    originalType: 'branch',
    isDone: false,
  },
  {
    id: 'task-4',
    dayId: 'we',
    title: 'Repeat the previous lesson',
    category: 'Test',
    deadline: 'Deadline: 07/25',
    type: 'completed',
    originalType: 'flame',
    isDone: true,
  },
  {
    id: 'task-5',
    dayId: 'we',
    title: 'Named functions, def statement',
    category: 'Video',
    deadline: 'Deadline: 07/29',
    type: 'completed',
    originalType: 'document',
    isDone: true,
  },
  // Tuesday Tasks (Completed)
  {
    id: 'task-tu-1',
    dayId: 'tu',
    title: 'Control flow & conditional statements',
    category: 'Lesson 14',
    deadline: 'Completed 07/25',
    type: 'completed',
    originalType: 'flame',
    isDone: true,
  },
  {
    id: 'task-tu-2',
    dayId: 'tu',
    title: 'Quadrilateral proofs & properties quiz',
    category: 'Math Lab',
    deadline: 'Completed 07/25',
    type: 'completed',
    originalType: 'document',
    isDone: true,
  },
  // Monday Tasks
  {
    id: 'task-mo-1',
    dayId: 'mo',
    title: 'Science: Forces & Friction Chapter Review',
    category: 'Lesson 13',
    deadline: 'Completed 07/24',
    type: 'completed',
    originalType: 'branch',
    isDone: true,
  },
  {
    id: 'task-mo-2',
    dayId: 'mo',
    title: 'Practice solving rational number equations',
    category: 'Homework',
    deadline: 'Completed 07/24',
    type: 'completed',
    originalType: 'document',
    isDone: true,
  },
  // Thursday Tasks (Upcoming)
  {
    id: 'task-th-1',
    dayId: 'th',
    title: 'Object-Oriented Programming principles',
    category: 'Lesson 16',
    deadline: 'Deadline: 07/27',
    type: 'flame',
    originalType: 'flame',
    isDone: false,
  },
  {
    id: 'task-th-2',
    dayId: 'th',
    title: 'Curiosity Science: Sound waves investigation',
    category: 'Reading',
    deadline: 'Deadline: 07/27',
    type: 'document',
    originalType: 'document',
    isDone: false,
  },
];

const STORAGE_KEY = 'gaonlab_weekly_tasks_state_v1';

interface RightSidebarProps {
  onOpenSchedule?: () => void;
}

export const SkillUpRightSidebar: React.FC<RightSidebarProps> = ({ onOpenSchedule }) => {
  const [selectedDayId, setSelectedDayId] = useState<string>('we');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Initialize tasks with persistence
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage:', e);
    }
  }, [tasks]);

  // Compute live progress for a day
  const getDayProgress = (d: DayMeta): number => {
    const dayTasks = tasks.filter((t) => t.dayId === d.id);
    if (dayTasks.length > 0) {
      const doneCount = dayTasks.filter((t) => t.isDone).length;
      return Math.round((doneCount / dayTasks.length) * 100);
    }
    return d.fixedProgress ?? 0;
  };

  const wednesdayProgress = getDayProgress(DAYS.find((d) => d.id === 'we')!);

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.isDone;
          return {
            ...t,
            isDone: nextDone,
            type: nextDone ? 'completed' : t.originalType,
          };
        }
        return t;
      })
    );
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      dayId: selectedDayId,
      title: newTaskTitle.trim(),
      category: 'Homework',
      deadline: `Deadline: 07/${DAYS.find((d) => d.id === selectedDayId)?.date || 26}`,
      type: 'flame',
      originalType: 'flame',
      isDone: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  // Reset to initial tasks state
  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Selected Day info
  const selectedDay = DAYS.find((d) => d.id === selectedDayId) || DAYS[3];
  const selectedDayTasks = tasks.filter((t) => t.dayId === selectedDay.id);
  const selectedDayDone = selectedDayTasks.filter((t) => t.isDone).length;
  const selectedDayProgress = getDayProgress(selectedDay);

  // Dynamic daily streak
  const streakDays = wednesdayProgress >= 100 ? 5 : 4;

  return (
    <aside className="w-80 shrink-0 space-y-6">
      {/* =======================================================================
          1. WEEKLY PROGRESS CARD (Pixel-accurate matching SkillUp screenshot)
         ======================================================================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#EFECE6] shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[#352F2A] tracking-tight">
              Weekly Progress
            </h3>
            {wednesdayProgress >= 100 && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#389461] bg-[#CEECDA] px-2 py-0.5 rounded-full animate-bounce">
                <Sparkles className="w-3 h-3 text-[#389461]" /> Goal Met!
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#FA9C4D] bg-[#FFEEDD] px-2.5 py-0.5 rounded-full border border-[#FFD9B8]">
              Week 4
            </span>
            {onOpenSchedule && (
              <button
                type="button"
                onClick={onOpenSchedule}
                className="w-7 h-7 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] text-[#636160] hover:text-[#FA9C4D] flex items-center justify-center transition-colors shadow-soft-xs"
                title="Open Academic Calendar & Schedule"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 7 Vertical Pillar Bar Cards Matching Screenshot (SU 23 to SA 29) */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {DAYS.map((d) => {
            const progress = getDayProgress(d);
            const isSelected = d.id === selectedDayId;
            const isFull = progress >= 95;

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                title={`${d.dayName} (${d.date}): ${progress}% completed`}
                className={`relative h-[68px] rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between items-center py-2 transition-all select-none group ${
                  isSelected
                    ? 'ring-2 ring-[#FA9C4D] ring-offset-1 shadow-soft-sm scale-[1.02]'
                    : 'hover:brightness-95'
                }`}
                style={{ backgroundColor: '#F8F6F1' }}
              >
                {/* Bottom-Up Liquid Progress Fill */}
                <div
                  className={`absolute bottom-0 inset-x-0 transition-all duration-500 ease-out pointer-events-none ${
                    isFull ? 'bg-[#FFCF4F] rounded-2xl' : 'bg-[#FFCF4F]'
                  }`}
                  style={{ height: `${progress}%` }}
                />

                {/* Coral Red Marker Dot resting right on the active day's liquid surface */}
                {d.isCurrent && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none z-20 flex items-center justify-center"
                    style={{ bottom: `calc(${Math.max(10, Math.min(92, progress))}% - 3px)` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FA5252] shadow-xs ring-1 ring-white" />
                  </div>
                )}

                {/* Top Day Label (SU, MO, TU, WE, TH, FR, SA) */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors ${
                    progress >= 75 ? 'text-[#352F2A]' : 'text-[#9E9B97]'
                  }`}
                >
                  {d.label}
                </span>

                {/* Center / Bottom Date Number (23, 24, 25, 26, 27, 28, 29) */}
                <span
                  className="text-xs sm:text-sm font-extrabold text-[#352F2A] relative z-10 transition-colors"
                >
                  {d.date}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Day Status & Daily Goal Strip */}
        <div className="mt-4 pt-3.5 border-t border-[#EFECE6] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FA9C4D]" />
            <span className="font-bold text-[#352F2A]">
              {selectedDay.dayName} {selectedDay.date}
              {selectedDay.isCurrent && ' (Today)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#FA9C4D] bg-[#FFEEDD] px-2 py-0.5 rounded-full text-[11px]">
              {selectedDayProgress}% Complete
            </span>
            <span className="font-extrabold text-[#352F2A] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FA9C4D] fill-[#FA9C4D]" /> {streakDays} Days
            </span>
          </div>
        </div>

        {/* Quick Day Switcher Helper if looking at past/future day */}
        {!selectedDay.isCurrent && (
          <div className="mt-2 text-right">
            <button
              onClick={() => setSelectedDayId('we')}
              className="text-[10px] font-bold text-[#FA9C4D] hover:underline"
            >
              ← Back to Today (Wednesday 26)
            </button>
          </div>
        )}
      </div>

      {/* =======================================================================
          2. RECENT TASKS CARD (Interactive Task Manager & Real-Time Sync)
         ======================================================================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#EFECE6] shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#352F2A] tracking-tight">
              Recent Tasks
            </h3>
            <p className="text-[10px] text-[#9E9B97] font-semibold">
              {selectedDay.dayName} • {selectedDayDone}/{selectedDayTasks.length} Completed
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="w-7 h-7 rounded-xl bg-[#FFEEDD] text-[#FA9C4D] hover:bg-[#FFD9B8] flex items-center justify-center transition-colors shadow-soft-xs"
              title="Add task for this day"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleResetTasks}
              className="w-7 h-7 rounded-xl bg-[#F8F4EE] text-[#9E9B97] hover:text-[#352F2A] flex items-center justify-center transition-colors"
              title="Reset tasks to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Task Creator Form */}
        {isAddingTask && (
          <form onSubmit={handleAddTask} className="mb-3.5 p-3 rounded-2xl bg-[#FAF5EF] border border-[#FFD9B8] space-y-2 animate-in fade-in duration-150">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Science Lab: Friction Experiment"
              className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-[#EFECE6] text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D]"
            />
            <div className="flex items-center justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-2.5 py-1 text-[#636160] hover:text-[#352F2A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#FA9C4D] text-white font-bold rounded-xl hover:bg-[#D47220] transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {selectedDayTasks.length === 0 ? (
            <div className="text-center py-6 px-4 bg-[#FAF5EF] rounded-2xl border border-dashed border-[#EFECE6]">
              <p className="text-xs font-bold text-[#352F2A]">No tasks scheduled</p>
              <p className="text-[11px] text-[#9E9B97] mt-0.5">
                All caught up for {selectedDay.dayName}!
              </p>
              <button
                onClick={() => setIsAddingTask(true)}
                className="mt-2.5 text-xs font-bold text-[#FA9C4D] hover:underline"
              >
                + Add a study task
              </button>
            </div>
          ) : (
            selectedDayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF5EF] transition-all cursor-pointer group border border-transparent hover:border-[#EFECE6]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Stylized Icon Container matching screenshot */}
                  {task.type === 'flame' && (
                    <div className="w-10 h-10 rounded-2xl bg-[#FFE6C7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Flame className="w-5 h-5 text-[#FA9C4D] fill-[#FA9C4D]" />
                    </div>
                  )}
                  {task.type === 'document' && (
                    <div className="w-10 h-10 rounded-2xl bg-[#FFEEDD] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 text-[#EB8833]" />
                    </div>
                  )}
                  {task.type === 'branch' && (
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <GitBranch className="w-5 h-5 text-[#FA9C4D]" />
                    </div>
                  )}
                  {task.type === 'completed' && (
                    <div className="w-10 h-10 rounded-2xl bg-[#CEECDA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Check className="w-5 h-5 text-[#48AF76] stroke-[3]" />
                    </div>
                  )}

                  {/* Task Details */}
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold leading-tight truncate transition-colors ${
                        task.isDone ? 'line-through text-[#9E9B97]' : 'text-[#352F2A]'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9E9B97]">
                      <span className="font-semibold text-[#636160]">{task.category}</span>
                      <span>•</span>
                      <span className="truncate">{task.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Chevron Right */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#9E9B97] group-hover:text-[#FA9C4D] group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =======================================================================
          3. ACTIVITY BREAKDOWN (Matching Screenshot Bottom Right)
         ======================================================================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#EFECE6] shadow-soft-sm">
        <h3 className="font-extrabold text-base text-[#352F2A] tracking-tight mb-4">
          Activity
        </h3>

        <div className="space-y-3.5">
          {[
            { label: 'Learning', value: Math.min(100, 55 + Math.round(wednesdayProgress * 0.25)) },
            { label: 'Homework', value: Math.min(100, 65 + Math.round(wednesdayProgress * 0.35)) },
            { label: 'Reading', value: 44 },
            { label: 'Infallibility', value: 72 },
            { label: 'Discipline', value: Math.min(100, 80 + (wednesdayProgress >= 100 ? 15 : Math.round(wednesdayProgress * 0.12))) },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#636160]">{item.label}</span>
                <span className="text-[11px] font-bold text-[#9E9B97]">{item.value}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F8F4EE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FA9C4D] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export const GaonLabsRightSidebar = SkillUpRightSidebar;
