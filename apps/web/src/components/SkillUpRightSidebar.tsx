import React, { useState } from 'react';
import {
  Flame,
  FileText,
  GitBranch,
  Check,
  ChevronRight
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  category: string;
  deadline: string;
  type: 'flame' | 'document' | 'branch' | 'completed';
  isDone?: boolean;
}

export const SkillUpRightSidebar: React.FC = () => {
  // Calendar dates for the week (matching screenshot SU 23 to SA 29)
  const weekDays = [
    { label: 'SU', date: 23, active: false, hasProgress: false },
    { label: 'MO', date: 24, active: false, hasProgress: true },
    { label: 'TU', date: 25, active: false, hasProgress: true },
    { label: 'WE', date: 26, active: true, hasProgress: true }, // Current active day in yellow
    { label: 'TH', date: 27, active: false, hasProgress: false },
    { label: 'FR', date: 28, active: false, hasProgress: false },
    { label: 'SA', date: 29, active: false, hasProgress: false },
  ];

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Exceptions and their handling',
      category: 'Lesson 15',
      deadline: 'Deadline: 07/25',
      type: 'flame',
      isDone: false,
    },
    {
      id: 'task-2',
      title: 'Code for example of exception',
      category: 'Homework',
      deadline: 'Deadline: 07/25',
      type: 'document',
      isDone: false,
    },
    {
      id: 'task-3',
      title: "Hierarchy of python's built-in exceptions",
      category: 'Article',
      deadline: 'Deadline: 07/29',
      type: 'branch',
      isDone: false,
    },
    {
      id: 'task-4',
      title: 'Repeat the previous lesson',
      category: 'Test',
      deadline: 'Deadline: 07/25',
      type: 'completed',
      isDone: true,
    },
    {
      id: 'task-5',
      title: 'Named functions, def statement',
      category: 'Video',
      deadline: 'Deadline: 07/29',
      type: 'completed',
      isDone: true,
    },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.isDone;
          return {
            ...t,
            isDone: nextDone,
            type: nextDone ? 'completed' : 'flame',
          };
        }
        return t;
      })
    );
  };

  return (
    <aside className="w-80 shrink-0 space-y-6">
      {/* =======================================================================
          1. WEEKLY PROGRESS CARD (Matching Screenshot Top Right)
         ======================================================================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#EFECE6] shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-[#352F2A] tracking-tight">
            Weekly Progress
          </h3>
          <span className="text-[11px] font-bold text-[#FA9C4D] bg-[#FFEEDD] px-2 py-0.5 rounded-full">
            Week 4
          </span>
        </div>

        {/* Day Badges Strip */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((d) => (
            <div key={d.label} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#9E9B97] mb-1.5">{d.label}</span>
              <button
                type="button"
                className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                  d.active
                    ? 'bg-[#FFCF4F] text-[#352F2A] shadow-soft-sm'
                    : 'bg-transparent text-[#636160] hover:bg-[#F8F4EE]'
                }`}
              >
                <span>{d.date}</span>
                {d.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FA9C4D] mt-0.5" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Weekly Completion Bar */}
        <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs">
          <span className="text-[#636160] font-medium">Daily Streak</span>
          <span className="font-extrabold text-[#FA9C4D] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#FA9C4D] fill-[#FA9C4D]" /> 4 Days
          </span>
        </div>
      </div>

      {/* =======================================================================
          2. RECENT TASKS CARD (Matching Screenshot Middle Right)
         ======================================================================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#EFECE6] shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-[#352F2A] tracking-tight">
            Recent Tasks
          </h3>
          <span className="text-xs text-[#9E9B97] font-semibold">
            {tasks.filter((t) => t.isDone).length}/{tasks.length} Done
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF5EF] transition-all cursor-pointer group border border-transparent hover:border-[#EFECE6]"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Stylized Icon Container matching screenshot */}
                {task.type === 'flame' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#FFE6C7] flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-[#FA9C4D] fill-[#FA9C4D]" />
                  </div>
                )}
                {task.type === 'document' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#FFEEDD] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#EB8833]" />
                  </div>
                )}
                {task.type === 'branch' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5 text-[#FA9C4D]" />
                  </div>
                )}
                {task.type === 'completed' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#CEECDA] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#48AF76] stroke-[3]" />
                  </div>
                )}

                {/* Task Details */}
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold leading-tight truncate ${
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
          ))}
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
            { label: 'Learning', value: 68 },
            { label: 'Homework', value: 88 },
            { label: 'Reading', value: 44 },
            { label: 'Infallibility', value: 72 },
            { label: 'Discipline', value: 92 },
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
