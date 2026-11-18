import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Plus,
  Filter,
  Check,
  Layers
} from 'lucide-react';

export interface AcademicEvent {
  id: string;
  title: string;
  dateStr: string; // 'YYYY-MM-DD'
  time?: string;
  category: 'EXAM' | 'LAB' | 'HOMEWORK' | 'EVENT' | 'HOLIDAY';
  subject?: string;
  description: string;
  isCompleted?: boolean;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

const STORAGE_EVENTS_KEY = 'gaonlab_academic_schedule_events_v1';

// Rich, realistic curriculum milestones and synthetic tasks across months
const DEFAULT_EVENTS: AcademicEvent[] = [
  // October 2026
  {
    id: 'evt-oct-2',
    title: 'Gandhi Jayanti Community Science & Clean Water Initiative',
    dateStr: '2026-10-02',
    time: '09:00 AM - 12:00 PM',
    category: 'HOLIDAY',
    subject: 'Environmental STEM',
    description: 'Community water sample testing and rural sanitation awareness drive.',
    isCompleted: true,
  },
  {
    id: 'evt-oct-15',
    title: "Dr. A.P.J. Abdul Kalam National Students' Day Science Quiz",
    dateStr: '2026-10-15',
    time: '11:00 AM - 12:30 PM',
    category: 'EVENT',
    subject: 'General Science',
    description: 'Inter-school quiz on aerospace, rocketry, and rural technological innovations.',
    isCompleted: true,
  },
  {
    id: 'evt-oct-24',
    title: 'Formative Assessment 1: Rational Numbers & Linear Equations',
    dateStr: '2026-10-24',
    time: '10:00 AM - 11:30 AM',
    category: 'EXAM',
    subject: 'Mathematics',
    description: 'CBSE / KTBS Class 8 unit evaluation on number line representations and algebraic properties.',
    isCompleted: true,
  },

  // November 2026 (Current Month)
  {
    id: 'evt-nov-4',
    title: 'Science Lab: Exploring Friction & Surface Irregularities',
    dateStr: '2026-11-04',
    time: '02:00 PM - 03:30 PM',
    category: 'LAB',
    subject: 'Integrated Science',
    description: 'Hands-on experiment measuring dynamic friction using spring balances and incline planes.',
    isCompleted: true,
  },
  {
    id: 'evt-nov-9',
    title: 'Homework Submission: Linear Equations Multi-Step Word Problems',
    dateStr: '2026-11-09',
    time: 'Due 05:00 PM',
    category: 'HOMEWORK',
    subject: 'Mathematics',
    description: 'Submit solutions for 15 application problems on linear equations in one variable.',
    isCompleted: true,
  },
  {
    id: 'evt-nov-14',
    title: "Children's Day National STEM Innovation Exhibition",
    dateStr: '2026-11-14',
    time: '09:30 AM - 01:30 PM',
    category: 'EVENT',
    subject: 'Robotics & STEM',
    description: 'Demonstration of smart irrigation sensors and solar pump prototypes for rural farming.',
    isCompleted: true,
  },
  // Today (Nov 18, 2026) Events
  {
    id: 'evt-nov-18-1',
    title: 'STEM Lens Visual Lab: Optical Reflection & Mirror Ray Tracing',
    dateStr: '2026-11-18',
    time: '10:00 AM - 11:30 AM',
    category: 'LAB',
    subject: 'Science (Physics)',
    description: 'Interactive camera analysis of convex and concave focal planes using STEM Lens multimodal vision.',
    isCompleted: false,
  },
  {
    id: 'evt-nov-18-2',
    title: 'Programming Exercise: Python Exception Handling & Debugging',
    dateStr: '2026-11-18',
    time: 'Due 04:00 PM',
    category: 'HOMEWORK',
    subject: 'Computer Science',
    description: 'Implement try/except blocks and handle ZeroDivisionError and FileNotFoundError.',
    isCompleted: false,
  },
  {
    id: 'evt-nov-18-3',
    title: 'Village Builder Simulation: Microgrid Energy Distribution',
    dateStr: '2026-11-18',
    time: '05:30 PM - 06:45 PM',
    category: 'EVENT',
    subject: 'STEM Systems',
    description: 'Balance village peak solar load and battery capacity during seasonal monsoon demand.',
    isCompleted: true,
  },
  {
    id: 'evt-nov-21',
    title: 'Diagnostic Test: Particulate Nature of Matter & Chemical Changes',
    dateStr: '2026-11-21',
    time: '10:30 AM - 12:00 PM',
    category: 'EXAM',
    subject: 'Science (Chemistry)',
    description: 'Assessment on elements, compounds, mixtures, and physical vs chemical reactions.',
    isCompleted: false,
  },
  {
    id: 'evt-nov-26',
    title: 'Constitution Day: Civic Science & Digital Public Infrastructure',
    dateStr: '2026-11-26',
    time: '11:00 AM - 12:30 PM',
    category: 'EVENT',
    subject: 'Social STEM',
    description: 'Interactive session exploring Aadhaar privacy bounds, DPDP compliance, and public digital goods.',
    isCompleted: false,
  },
  {
    id: 'evt-nov-28',
    title: 'KTBS Karnataka State Board: Kannada Medium Science Quiz',
    dateStr: '2026-11-28',
    time: '02:00 PM - 03:30 PM',
    category: 'EXAM',
    subject: 'ವಿಜ್ಞಾನ (Science)',
    description: 'ವಿಜ್ಞಾನ ಪಾಠ ೪ (ಉಷ್ಣ) ಮತ್ತು ಪಾಠ ೧೦ (ಚಲನೆ) ಕುರಿತು ರಾಜ್ಯ ಮಟ್ಟದ ರಸಪ್ರಶ್ನೆ.',
    isCompleted: false,
  },

  // December 2026
  {
    id: 'evt-dec-4',
    title: 'NCERT Science Practical: Light, Refraction & Lens Dispersion',
    dateStr: '2026-12-04',
    time: '01:30 PM - 03:00 PM',
    category: 'LAB',
    subject: 'Science',
    description: 'Prism refraction measurements and spectrum analysis using sunlight.',
    isCompleted: false,
  },
  {
    id: 'evt-dec-11',
    title: 'Mathematics Practice Assessment: Mensuration & Surface Areas',
    dateStr: '2026-12-11',
    time: '10:00 AM - 11:30 AM',
    category: 'EXAM',
    subject: 'Mathematics',
    description: 'Calculations of cylinder volume, cuboid total surface area, and village silo geometry.',
    isCompleted: false,
  },
  {
    id: 'evt-dec-18',
    title: 'CBSE Term 1 Summative Assessment Examination Begins',
    dateStr: '2026-12-18',
    time: '09:00 AM - 12:00 PM',
    category: 'EXAM',
    subject: 'Curriculum Core',
    description: 'Comprehensive mid-year examinations covering all prescribed CBSE & State Board modules.',
    isCompleted: false,
  },
  {
    id: 'evt-dec-22',
    title: 'National Mathematics Day: Srinivasa Ramanujan Commemoration',
    dateStr: '2026-12-22',
    time: '10:00 AM - 01:00 PM',
    category: 'EVENT',
    subject: 'Mathematics',
    description: 'Workshop on number theory, magic squares, and infinite series visualizations.',
    isCompleted: false,
  },
  {
    id: 'evt-dec-25',
    title: 'Winter Academic Break & Self-Paced STEM Projects Inception',
    dateStr: '2026-12-25',
    time: 'All Day',
    category: 'HOLIDAY',
    subject: 'Academic Calendar',
    description: 'Winter vacation. Students can work on offline STEM Lens and Village Builder offline simulations.',
    isCompleted: false,
  },

  // January 2027
  {
    id: 'evt-jan-5',
    title: 'School Reopens & Term 2 Academic Inception',
    dateStr: '2027-01-05',
    time: '08:30 AM',
    category: 'EVENT',
    subject: 'Academic Calendar',
    description: 'Commencement of second term coursework for Science and Mathematics.',
    isCompleted: false,
  },
  {
    id: 'evt-jan-12',
    title: 'National Youth Day Rural Innovation Hackathon',
    dateStr: '2027-01-12',
    time: '09:30 AM - 04:00 PM',
    category: 'EVENT',
    subject: 'Innovation & Coding',
    description: 'Building software tools for rural village logistics, crop health, and automated soil checks.',
    isCompleted: false,
  },
  {
    id: 'evt-jan-19',
    title: 'Science Lab: Sound Waves, Vibration & Frequency Analysis',
    dateStr: '2027-01-19',
    time: '02:00 PM - 03:30 PM',
    category: 'LAB',
    subject: 'Science (Physics)',
    description: 'Tuning forks experiment and digital oscilloscope mobile microphone measurements.',
    isCompleted: false,
  },
  {
    id: 'evt-jan-26',
    title: 'Republic Day Celebration & National Science Exhibition',
    dateStr: '2027-01-26',
    time: '08:00 AM - 11:30 AM',
    category: 'HOLIDAY',
    subject: 'National Event',
    description: 'Flag hoisting ceremony followed by student science model demonstrations.',
    isCompleted: false,
  },

  // February 2027
  {
    id: 'evt-feb-10',
    title: 'Pre-Board Diagnostic & Revision Examination',
    dateStr: '2027-02-10',
    time: '09:30 AM - 12:30 PM',
    category: 'EXAM',
    subject: 'Mathematics & Science',
    description: 'Full syllabus mock test structured to prepare students for final board formats.',
    isCompleted: false,
  },
  {
    id: 'evt-feb-28',
    title: 'National Science Day: Sir C.V. Raman Discovery Commemoration',
    dateStr: '2027-02-28',
    time: '09:00 AM - 02:00 PM',
    category: 'EVENT',
    subject: 'Science',
    description: 'Celebration of the Raman Effect with live light scattering and optics experiments.',
    isCompleted: false,
  },
];

export const ScheduleCalendarModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  initialDate,
}) => {
  // System's current date (e.g. Nov 18, 2026)
  const systemNow = initialDate || new Date();

  // Active view: year and month
  const [viewYear, setViewYear] = useState<number>(systemNow.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(systemNow.getMonth()); // 0-indexed (10 = Nov)

  // Selected date in format 'YYYY-MM-DD'
  const formatYmd = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayStr = formatYmd(
    systemNow.getFullYear(),
    systemNow.getMonth(),
    systemNow.getDate()
  );

  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'EXAM' | 'LAB' | 'HOMEWORK' | 'EVENT' | 'HOLIDAY'>('HOMEWORK');
  const [newSubject, setNewSubject] = useState('Science');
  const [newTime, setNewTime] = useState('10:00 AM - 11:30 AM');
  const [newDesc, setNewDesc] = useState('');

  // Persistent events list
  const [events, setEvents] = useState<AcademicEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EVENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to localStorage:', e);
    }
  }, [events]);

  if (!isOpen) return null;

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(systemNow.getFullYear());
    setViewMonth(systemNow.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Toggle event completion
  const handleToggleEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId ? { ...ev, isCompleted: !ev.isCompleted } : ev
      )
    );
  };

  // Add custom synthetic event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: AcademicEvent = {
      id: `evt-custom-${Date.now()}`,
      title: newTitle.trim(),
      dateStr: selectedDateStr,
      time: newTime.trim() || undefined,
      category: newCategory,
      subject: newSubject.trim() || undefined,
      description: newDesc.trim() || 'Custom academic task created by learner.',
      isCompleted: false,
    };

    setEvents((prev) => [newEvt, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setIsAddingEvent(false);
  };

  // Days calculations for calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  // Month name formatting
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[viewMonth];

  // Events filtered by selected date & category
  const eventsForSelectedDate = events.filter((ev) => {
    const matchesDate = ev.dateStr === selectedDateStr;
    const matchesCat = categoryFilter === 'ALL' || ev.category === categoryFilter;
    return matchesDate && matchesCat;
  });

  // All events in current month
  const currentMonthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const eventsInCurrentMonth = events.filter((ev) =>
    ev.dateStr.startsWith(currentMonthPrefix)
  );

  // Group events by date for dot badge indicators
  const eventsMapByDate = new Map<string, AcademicEvent[]>();
  eventsInCurrentMonth.forEach((ev) => {
    const list = eventsMapByDate.get(ev.dateStr) || [];
    list.push(ev);
    eventsMapByDate.set(ev.dateStr, list);
  });

  // Parse selected date for display
  const [selY, selM, selD] = selectedDateStr.split('-').map(Number);
  const selectedDateObj = new Date(selY, selM - 1, selD);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const isSelectedToday = selectedDateStr === todayStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#352F2A]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-5xl rounded-3xl border border-[#EFECE6] shadow-soft-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* =====================================================================
            1. MODAL TOP HEADER
           ===================================================================== */}
        <div className="p-5 sm:p-6 bg-[#FAF5EF] border-b border-[#EFECE6] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] shadow-soft-xs">
              <CalendarIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight">
                  Academic & Learning Schedule
                </h2>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                  Curriculum Calendar
                </span>
              </div>
              <p className="text-xs text-[#636160] mt-0.5">
                Track formative assessments, STEM labs, homework deadlines, and state board milestones.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-[#636160] hover:text-[#352F2A] hover:border-[#D9D6D0] transition-colors shadow-soft-sm shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================================
            2. BODY CONTENT: 2 COLUMNS (Calendar Left, Agenda Right)
           ===================================================================== */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* -------------------------------------------------------------------
              LEFT COLUMN: Month Navigator & Interactive Calendar Grid
             ------------------------------------------------------------------- */}
          <div className="w-full lg:w-[460px] p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#EFECE6] bg-[#FFFFFF] flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Month Controls & "Jump to Today" */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-xl bg-[#F8F4EE] hover:bg-[#FFEEDD] text-[#636160] hover:text-[#FA9C4D] flex items-center justify-center transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <h3 className="font-extrabold text-base text-[#352F2A] px-2 min-w-[150px] text-center">
                    {currentMonthName} {viewYear}
                  </h3>

                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-xl bg-[#F8F4EE] hover:bg-[#FFEEDD] text-[#636160] hover:text-[#FA9C4D] flex items-center justify-center transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleJumpToToday}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF5EF] hover:bg-[#FFEEDD] text-[#FA9C4D] border border-[#FFD9B8] transition-colors shadow-soft-xs flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#FA9C4D]" />
                  <span>Today</span>
                </button>
              </div>

              {/* Day of week headers (SU - SA) */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-extrabold text-[#9E9B97] py-1 uppercase tracking-wider"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Month Grid Cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells for leading days from prev month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-11 rounded-2xl bg-[#FBF9F6]/50 border border-transparent pointer-events-none"
                  />
                ))}

                {/* Day Numbers for Current Month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayYmd = formatYmd(viewYear, viewMonth, dayNum);
                  const isToday = dayYmd === todayStr;
                  const isSelected = dayYmd === selectedDateStr;
                  const dayEvents = eventsMapByDate.get(dayYmd) || [];

                  return (
                    <button
                      key={dayYmd}
                      onClick={() => setSelectedDateStr(dayYmd)}
                      className={`relative h-11 rounded-2xl flex flex-col items-center justify-center text-xs font-extrabold transition-all group ${
                        isSelected
                          ? 'ring-2 ring-[#FA9C4D] ring-offset-1 bg-[#FA9C4D] text-white shadow-soft-md scale-[1.03]'
                          : isToday
                          ? 'bg-[#FFEEDD] text-[#D47220] border-2 border-[#FA9C4D] font-black'
                          : 'bg-[#F9F7F2] text-[#352F2A] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {/* Day Number */}
                      <span className="leading-none">{dayNum}</span>

                      {/* Active "Today" Dot Indicator */}
                      {isToday && !isSelected && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FA9C4D] animate-ping" />
                      )}

                      {/* Event Dot Indicators */}
                      {dayEvents.length > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((ev, i) => (
                            <span
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                isSelected
                                  ? 'bg-white'
                                  : ev.category === 'EXAM'
                                  ? 'bg-[#FA5252]'
                                  : ev.category === 'LAB'
                                  ? 'bg-[#48AF76]'
                                  : ev.category === 'HOMEWORK'
                                  ? 'bg-[#FA9C4D]'
                                  : 'bg-[#FAC05E]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="mt-6 pt-4 border-t border-[#EFECE6] flex flex-wrap items-center justify-between text-[11px] text-[#636160] gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FA5252]" /> Exam
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#48AF76]" /> STEM Lab
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FA9C4D]" /> Homework
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FAC05E]" /> Milestone
              </span>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: Selected Day Agenda & Synthetic Events List
             ------------------------------------------------------------------- */}
          <div className="flex-1 p-5 sm:p-6 bg-[#FBFAF9] flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Selected Day Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFECE6]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-[#352F2A]">
                      {formattedSelectedDate}
                    </h3>
                    {isSelectedToday && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FA9C4D] text-white shadow-soft-xs">
                        Current Date
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9E9B97] font-semibold mt-0.5">
                    {eventsForSelectedDate.length}{' '}
                    {eventsForSelectedDate.length === 1 ? 'task / event' : 'tasks & events'}{' '}
                    scheduled
                  </p>
                </div>

                {/* Add Event Button */}
                <button
                  onClick={() => setIsAddingEvent(!isAddingEvent)}
                  className="px-3 py-1.5 rounded-2xl bg-[#FFEEDD] hover:bg-[#FFD9B8] text-[#D47220] text-xs font-bold transition-colors shadow-soft-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Task / Event</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-[#9E9B97] mr-1 flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {['ALL', 'EXAM', 'LAB', 'HOMEWORK', 'EVENT'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-[#352F2A] text-white'
                        : 'bg-[#FFFFFF] text-[#636160] border border-[#EFECE6] hover:bg-[#FAF5EF]'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Items' : cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}
                  </button>
                ))}
              </div>

              {/* Inline Event Creation Form */}
              {isAddingEvent && (
                <form
                  onSubmit={handleCreateEvent}
                  className="my-3 p-4 bg-[#FFFFFF] rounded-3xl border border-[#FFD9B8] shadow-soft-sm space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#352F2A]">
                      Schedule Event for {selectedDateStr}
                    </h4>
                    <span className="text-[10px] font-bold text-[#FA9C4D] bg-[#FFEEDD] px-2 py-0.5 rounded-full">
                      New Item
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Event title (e.g. Science Chapter 5 Diagnostic Quiz)"
                    className="w-full px-3 py-2 text-xs bg-[#FAF5EF] rounded-xl border border-[#EFECE6] text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-white"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="px-3 py-1.5 text-xs bg-[#FAF5EF] rounded-xl border border-[#EFECE6] text-[#352F2A] focus:outline-none focus:border-[#FA9C4D]"
                    >
                      <option value="EXAM">Exam / Assessment</option>
                      <option value="LAB">STEM Lab / Experiment</option>
                      <option value="HOMEWORK">Homework Due</option>
                      <option value="EVENT">Academic Milestone</option>
                      <option value="HOLIDAY">Holiday</option>
                    </select>

                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Subject (e.g. Science)"
                      className="px-3 py-1.5 text-xs bg-[#FAF5EF] rounded-xl border border-[#EFECE6] text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D]"
                    />

                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="Time (e.g. 10:00 AM)"
                      className="px-3 py-1.5 text-xs bg-[#FAF5EF] rounded-xl border border-[#EFECE6] text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D]"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Event description or study instructions..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF5EF] rounded-xl border border-[#EFECE6] text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-white resize-none"
                  />

                  <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsAddingEvent(false)}
                      className="px-3 py-1.5 text-[#636160] hover:text-[#352F2A] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#FA9C4D] text-white font-bold rounded-xl hover:bg-[#D47220] transition-colors shadow-soft-xs"
                    >
                      Save to Schedule
                    </button>
                  </div>
                </form>
              )}

              {/* Event Cards List */}
              <div className="space-y-3 mt-2">
                {eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-12 px-6 bg-[#FFFFFF] rounded-3xl border border-dashed border-[#EFECE6] space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#FAF5EF] flex items-center justify-center text-[#9E9B97] mx-auto">
                      <CalendarIcon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h4 className="font-extrabold text-sm text-[#352F2A]">
                      No Events Scheduled for this Day
                    </h4>
                    <p className="text-xs text-[#9E9B97] max-w-sm mx-auto">
                      There are no major curriculum exams or laboratory deadlines marked for {formattedSelectedDate}.
                    </p>
                    <button
                      onClick={() => setIsAddingEvent(true)}
                      className="mt-2 text-xs font-bold text-[#FA9C4D] hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add a study session or homework
                    </button>
                  </div>
                ) : (
                  eventsForSelectedDate.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                        ev.isCompleted
                          ? 'bg-[#FFFFFF]/60 border-[#EFECE6] opacity-85'
                          : 'bg-[#FFFFFF] border-[#EFECE6] hover:border-[#FFD9B8] shadow-soft-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Status Checkbox / Action */}
                        <button
                          onClick={() => handleToggleEvent(ev.id)}
                          className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            ev.isCompleted
                              ? 'bg-[#CEECDA] text-[#48AF76]'
                              : 'bg-[#FAF5EF] border border-[#EFECE6] text-[#9E9B97] hover:border-[#FA9C4D]'
                          }`}
                          title={ev.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        {/* Event Details */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                ev.category === 'EXAM'
                                  ? 'bg-[#FFE2E2] text-[#E5484D]'
                                  : ev.category === 'LAB'
                                  ? 'bg-[#CEECDA] text-[#389461]'
                                  : ev.category === 'HOMEWORK'
                                  ? 'bg-[#FFEEDD] text-[#D47220]'
                                  : 'bg-[#FFF4E6] text-[#FA9C4D]'
                              }`}
                            >
                              {ev.category}
                            </span>

                            {ev.subject && (
                              <span className="text-[10px] font-bold text-[#636160] bg-[#FAF5EF] px-2 py-0.5 rounded-full border border-[#EFECE6]">
                                {ev.subject}
                              </span>
                            )}

                            {ev.time && (
                              <span className="text-[11px] font-semibold text-[#9E9B97] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#9E9B97]" />
                                <span>{ev.time}</span>
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-sm font-extrabold text-[#352F2A] leading-snug ${
                              ev.isCompleted ? 'line-through text-[#9E9B97]' : ''
                            }`}
                          >
                            {ev.title}
                          </h4>

                          <p className="text-xs text-[#636160] leading-relaxed">
                            {ev.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Tag / Badge */}
                      <div className="shrink-0 self-end sm:self-center">
                        {ev.isCompleted ? (
                          <span className="text-[11px] font-bold text-[#48AF76] flex items-center gap-1 bg-[#CEECDA]/60 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-[#FA9C4D] bg-[#FFEEDD] px-2.5 py-1 rounded-full border border-[#FFD9B8]">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Month Milestones Summary */}
            <div className="mt-6 pt-4 border-t border-[#EFECE6] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#636160] gap-2">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FA9C4D]" />
                <span>
                  <strong>{eventsInCurrentMonth.length} total events</strong> in {currentMonthName}{' '}
                  {viewYear}
                </span>
              </span>

              <span className="font-semibold text-[#9E9B97]">
                State & Central Board Verified Curriculum Timeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
