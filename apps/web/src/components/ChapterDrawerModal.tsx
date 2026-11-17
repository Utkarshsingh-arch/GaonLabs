import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Search
} from 'lucide-react';
import { TextbookEditionItem } from '../types';

interface ChapterDrawerModalProps {
  edition: TextbookEditionItem | null;
  subjectName: string;
  onClose: () => void;
}

export const ChapterDrawerModal: React.FC<ChapterDrawerModalProps> = ({
  edition,
  subjectName,
  onClose,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!edition) return null;

  const chapters = edition.chapters || [];
  const filteredChapters = filterQuery
    ? chapters.filter(
        (ch) =>
          ch.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
          (ch.officialCode && ch.officialCode.toLowerCase().includes(filterQuery.toLowerCase()))
      )
    : chapters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#352F2A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-3xl border border-[#EFECE6] shadow-soft-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-[#FAF5EF] border-b border-[#EFECE6] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                {subjectName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#CEECDA] text-[#389461]">
                {edition.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight">
              {edition.titleInLanguage || edition.textbook.canonicalTitle}
            </h2>
            <p className="text-xs text-[#636160] mt-1">
              Published by {edition.textbook.publisher.name} • {edition.totalChapters} Prescribed Chapters
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-[#636160] hover:text-[#352F2A] hover:border-[#D9D6D0] transition-colors shadow-soft-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Chapters Bar */}
        <div className="p-4 border-b border-[#EFECE6] bg-[#FFFFFF]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9B97]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search chapters by title or official code..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8F4EE] border border-transparent rounded-2xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
            />
          </div>
        </div>

        {/* Chapter List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#9E9B97]">
              No chapters matched your search query.
            </div>
          ) : (
            filteredChapters.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-[#FBFAF9] border border-[#EFECE6] hover:border-[#FFD9B8] hover:bg-[#FAF5EF] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-xs font-bold text-[#FA9C4D] shrink-0 group-hover:bg-[#FFEEDD] group-hover:border-[#FFD9B8] transition-colors">
                    {ch.chapterNumber}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#352F2A] truncate">
                      {ch.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#9E9B97]">
                      {ch.officialCode && (
                        <span className="font-mono bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EFECE6] text-[#636160]">
                          {ch.officialCode}
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-[#48AF76] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Syllabus Verified
                      </span>
                    </div>
                  </div>
                </div>

                {ch.sourceUrl && (
                  <a
                    href={ch.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FFEEDD] border border-[#EFECE6] hover:border-[#FFD9B8] text-[11px] font-bold text-[#FA9C4D] transition-colors shrink-0 shadow-soft-sm"
                  >
                    <span>Read</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF5EF] border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#636160]">
          <span>Official NCERT & KTBS Public Education Repository</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EFECE6] font-semibold text-[#352F2A] hover:bg-[#F8F4EE] transition-colors shadow-soft-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
