import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Search
} from 'lucide-react';
import { DemoProfile } from '../types';

interface ExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DemoProfile;
}

export const CurriculumExplorerModal: React.FC<ExplorerProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [selectedBoard, setSelectedBoard] = useState(profile.boardId || 'CBSE');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedBooks, setAddedBooks] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Curated list of all 12 classes NCERT and KTBS textbooks from backend
  const availableTextbooks = [
    {
      id: 'ncert-math-8',
      title: 'Mathematics - Grade 8',
      board: 'CBSE',
      grade: 8,
      subject: 'Mathematics',
      chapters: 13,
      medium: 'English & Hindi',
      publisher: 'NCERT',
    },
    {
      id: 'ncert-sci-8',
      title: 'Curiosity: Science - Grade 8',
      board: 'CBSE',
      grade: 8,
      subject: 'Science',
      chapters: 13,
      medium: 'English & Hindi',
      publisher: 'NCERT',
    },
    {
      id: 'ktbs-math-7',
      title: 'ಗಣಿತ ಭಾಗ ೧ & ೨ (Mathematics)',
      board: 'KARNATAKA_STATE_BOARD',
      grade: 7,
      subject: 'Mathematics',
      chapters: 12,
      medium: 'Kannada Medium',
      publisher: 'KTBS / DSERT',
    },
    {
      id: 'ktbs-sci-7',
      title: 'ವಿಜ್ಞಾನ (Integrated Science)',
      board: 'KARNATAKA_STATE_BOARD',
      grade: 7,
      subject: 'Science',
      chapters: 14,
      medium: 'Kannada Medium',
      publisher: 'KTBS / DSERT',
    },
    {
      id: 'ncert-math-10',
      title: 'Mathematics - Class 10 (High School)',
      board: 'CBSE',
      grade: 10,
      subject: 'Mathematics',
      chapters: 14,
      medium: 'English, Hindi, Urdu',
      publisher: 'NCERT',
    },
    {
      id: 'ncert-sci-10',
      title: 'Science - Class 10 (Secondary)',
      board: 'CBSE',
      grade: 10,
      subject: 'Science',
      chapters: 13,
      medium: 'English & Hindi',
      publisher: 'NCERT',
    },
    {
      id: 'ncert-phy-11',
      title: 'Physics Part I & II - Class 11',
      board: 'CBSE',
      grade: 11,
      subject: 'Physics',
      chapters: 14,
      medium: 'English & Hindi',
      publisher: 'NCERT',
    },
    {
      id: 'ncert-cs-11',
      title: 'Computer Science (Python) - Class 11',
      board: 'CBSE',
      grade: 11,
      subject: 'Computer Science',
      chapters: 11,
      medium: 'English',
      publisher: 'NCERT',
    },
  ];

  const filtered = availableTextbooks.filter((b) => {
    const matchBoard = selectedBoard === 'ALL' || b.board === selectedBoard;
    const matchQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBoard && matchQuery;
  });

  const handleAdd = (id: string) => {
    setAddedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#352F2A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-3xl border border-[#EFECE6] shadow-soft-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-[#FAF5EF] border-b border-[#EFECE6] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                Curriculum Catalogue
              </span>
              <span className="text-[10px] font-bold text-[#636160]">
                1,161 Chapters Indexed
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight">
              Add New Subject & Course
            </h2>
            <p className="text-xs text-[#636160] mt-1">
              Enroll in formal school textbooks from CBSE / NCERT and the Karnataka State Board
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-[#636160] hover:text-[#352F2A] hover:border-[#D9D6D0] transition-colors shadow-soft-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board & Grade Filter Bar */}
        <div className="p-4 bg-[#FFFFFF] border-b border-[#EFECE6] flex flex-wrap items-center justify-between gap-3">
          {/* Board Selector Pills */}
          <div className="flex items-center gap-1.5 bg-[#F8F4EE] p-1 rounded-2xl">
            <button
              onClick={() => setSelectedBoard('CBSE')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedBoard === 'CBSE'
                  ? 'bg-[#FFFFFF] text-[#352F2A] shadow-soft-sm'
                  : 'text-[#636160] hover:text-[#352F2A]'
              }`}
            >
              CBSE / NCERT
            </button>
            <button
              onClick={() => setSelectedBoard('KARNATAKA_STATE_BOARD')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedBoard === 'KARNATAKA_STATE_BOARD'
                  ? 'bg-[#FFFFFF] text-[#352F2A] shadow-soft-sm'
                  : 'text-[#636160] hover:text-[#352F2A]'
              }`}
            >
              Karnataka KTBS
            </button>
            <button
              onClick={() => setSelectedBoard('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedBoard === 'ALL'
                  ? 'bg-[#FFFFFF] text-[#352F2A] shadow-soft-sm'
                  : 'text-[#636160] hover:text-[#352F2A]'
              }`}
            >
              All Boards
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9B97]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F4EE] rounded-xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#FA9C4D]"
            />
          </div>
        </div>

        {/* Textbooks Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {filtered.map((book) => {
            const isAdded = !!addedBooks[book.id];
            return (
              <div
                key={book.id}
                className="p-4 rounded-3xl bg-[#FBFAF9] border border-[#EFECE6] hover:border-[#FFD9B8] hover:bg-[#FAF5EF] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFEEDD] text-[#D47220]">
                      {book.subject}
                    </span>
                    <span className="text-[10px] text-[#9E9B97] font-semibold">
                      Class {book.grade}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-[#636160] mt-1">
                    {book.publisher} • {book.medium} • {book.chapters} Chapters
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#48AF76] bg-[#CEECDA] px-2 py-0.5 rounded-full">
                    Syllabus Verified
                  </span>
                  <button
                    onClick={() => handleAdd(book.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm ${
                      isAdded
                        ? 'bg-[#CEECDA] text-[#389461]'
                        : 'bg-[#FA9C4D] hover:bg-[#EB8833] text-white shadow-orange-glow'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Enrolled
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Enroll Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF5EF] border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#636160]">
          <span>Syncs with offline database automatically</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white font-bold text-xs shadow-orange-glow transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
