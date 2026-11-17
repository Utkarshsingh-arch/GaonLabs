import React, { useState } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  Sparkles
} from 'lucide-react';
import { TextbookEditionItem, ChapterItem } from '../types';
import { fetchEditionChapters } from '../services/api';

interface TextbookCardProps {
  edition: TextbookEditionItem;
  subjectName: string;
  stemPillar: string;
}

export const TextbookCard: React.FC<TextbookCardProps> = ({
  edition,
  subjectName,
  stemPillar,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [chapters, setChapters] = useState<ChapterItem[]>(edition.chapters || []);
  const [isLoadingChapters, setIsLoadingChapters] = useState<boolean>(false);

  const toggleChapters = async () => {
    if (!isExpanded && chapters.length === 0 && edition.id) {
      setIsLoadingChapters(true);
      try {
        const res = await fetchEditionChapters(edition.id);
        if (res.data && res.data.length > 0) {
          setChapters(res.data);
        }
      } catch (err) {
        console.error('Failed to load chapters for edition:', err);
      } finally {
        setIsLoadingChapters(false);
      }
    }
    setIsExpanded((prev) => !prev);
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar.toUpperCase()) {
      case 'MATHEMATICS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCIENCE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TECHNOLOGY':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Syllabus
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Preview / Pending
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Archive className="w-3 h-3 text-slate-500" /> Archived Edition
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const mediumLabel =
    edition.medium === 'en'
      ? 'English Medium'
      : edition.medium === 'kn'
      ? 'ಕನ್ನಡ (Kannada)'
      : edition.medium === 'hi'
      ? 'हिन्दी (Hindi)'
      : edition.medium === 'ur'
      ? 'اردو (Urdu)'
      : edition.medium;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-slate-100 flex-1">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${getPillarColor(
              stemPillar
            )}`}
          >
            {subjectName}
          </span>
          {getStatusBadge(edition.status)}
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
          {edition.titleInLanguage}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">
            {edition.textbook?.publisher?.name || 'Authorized Educational Publisher'}
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{edition.textbook?.canonicalTitle}</span>
        </div>

        {/* Metadata Badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Medium</div>
            <div className="font-semibold text-slate-800 truncate" title={mediumLabel}>
              {mediumLabel}
            </div>
          </div>
          <div className="border-x border-slate-200/80">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Chapters</div>
            <div className="font-semibold text-slate-800">
              {edition.totalChapters || chapters.length || '—'} Chapters
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Edition Year</div>
            <div className="font-semibold text-slate-800">{edition.publicationYear || 2024}</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-50/70 p-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {edition.sourceUrl ? (
            <a
              href={edition.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-700 font-medium text-slate-700 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official Portal</span>
            </a>
          ) : (
            <span className="text-slate-400 text-[11px] italic">Official portal reference</span>
          )}

          {/* PDF Reader Coming Next Placeholder Badge */}
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium text-[11px]"
            title="Integrated offline PDF Reader with annotations scheduled for Stage 4"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Reader coming next</span>
          </div>
        </div>

        <button
          onClick={toggleChapters}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-slate-600" />
          <span>{isExpanded ? 'Hide Chapters' : 'View Chapters'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Chapter List */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-white p-4 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Official Chapter Outline
            </h4>
            <span className="text-[11px] text-slate-500">
              {chapters.length} chapter{chapters.length === 1 ? '' : 's'} indexed
            </span>
          </div>

          {isLoadingChapters ? (
            <div className="py-6 text-center text-xs text-slate-500">Loading verified chapters...</div>
          ) : chapters.length > 0 ? (
            <ol className="space-y-1.5 divide-y divide-slate-100">
              {chapters.map((ch) => (
                <li
                  key={ch.id || ch.chapterNumber}
                  className="pt-1.5 first:pt-0 flex items-start gap-2.5 text-xs text-slate-700 hover:text-slate-900 group"
                >
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[11px] flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                    {ch.chapterNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{ch.title}</div>
                    {ch.officialCode && (
                      <div className="text-[10px] text-slate-400 font-mono">{ch.officialCode}</div>
                    )}
                  </div>
                  {ch.sourceUrl && (
                    <a
                      href={ch.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-brand-600 text-[11px] flex items-center gap-0.5 flex-shrink-0"
                      title="Open chapter reference on official portal"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400 italic">
              Chapter outline details will be populated directly from the curriculum catalogue.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
