import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  ChevronRight,
  School,
  Globe,
} from 'lucide-react';
import { fetchBookDetails } from '../services/api';
import { ReaderBookDetail } from '../types';

export const BookDetailsPage: React.FC = () => {
  const { editionId } = useParams<{ editionId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [book, setBook] = useState<ReaderBookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [selectedExternalChapter, setSelectedExternalChapter] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      if (!editionId) return;
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetchBookDetails(editionId);
      if (!isMounted) return;

      if (res.data) {
        setBook(res.data);
      } else {
        setErrorMsg('Textbook edition could not be loaded.');
      }
      setIsLoading(false);
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [editionId]);

  // Handle local user PDF selection
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    navigate('/app/reader/local', {
      state: {
        localPdfUrl: objectUrl,
        localFileName: file.name.replace(/\.pdf$/i, ''),
      },
    });
  };

  const handleChapterClick = (ch: any) => {
    if (ch.accessMode === 'IN_APP_AUTHORIZED' && ch.documentId) {
      navigate(`/app/reader/${ch.documentId}`);
    } else {
      setSelectedExternalChapter(ch);
      setShowCopyrightModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Retrieving textbook details & chapter index...</p>
      </div>
    );
  }

  if (errorMsg || !book) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Book Not Found</h2>
        <p className="text-xs text-slate-600">{errorMsg || 'Unable to locate textbook edition.'}</p>
        <Link
          to="/app/library"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Library</span>
        </Link>
      </div>
    );
  }

  const isKannada = book.language === 'kn';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleLocalFileSelect}
      />

      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link to="/app/dashboard" className="hover:text-brand-700 transition">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/app/library" className="hover:text-brand-700 transition">
              Library
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate max-w-xs">{book.title}</span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Local PDF</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Textbook Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-5">
            {/* Textbook Cover Graphic */}
            <div
              className={`w-24 h-32 rounded-xl p-3 flex flex-col justify-between shadow-md text-white shrink-0 ${
                isKannada
                  ? 'bg-gradient-to-br from-amber-600 to-red-800'
                  : 'bg-gradient-to-br from-brand-700 to-indigo-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-black/25 px-1.5 py-0.5 rounded">
                  Class {book.grade}
                </span>
                <BookOpen className="w-3.5 h-3.5 opacity-80" />
              </div>
              <div>
                <p className="text-xs font-extrabold leading-tight line-clamp-2">
                  {book.title}
                </p>
                <p className="text-[9px] text-white/80 mt-1 uppercase font-semibold">
                  {book.publisher.split(' ')[0]}
                </p>
              </div>
            </div>

            {/* Metadata Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {book.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  Standard {book.grade}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 flex items-center space-x-1">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>{book.language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {book.title}
              </h1>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="flex items-center space-x-1.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Publisher: <strong className="text-slate-700">{book.publisher}</strong>
                  </span>
                </p>
                <p>
                  Academic Year: <strong className="text-slate-700">{book.academicYear}</strong> • Total Chapters:{' '}
                  <strong className="text-slate-700">{book.totalChapters}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Action: Official Portal Link */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <a
              href={book.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-sm transition"
            >
              <span>Official Board Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Read Local Copy</span>
            </button>
          </div>
        </div>

        {/* Copyright & Fair Resource Notice Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="font-bold text-amber-950">
              GaonLab Copyright & Textbook Access Policy
            </p>
            <p className="text-amber-800 leading-relaxed">
              GaonLab strictly complies with national and state education board copyright guidelines.
              Textbook chapters without third-party embedding clearance are provided as official
              portal links or companion visual study guides. Students may also open locally saved
              copies directly inside the reader.
            </p>
          </div>
        </div>

        {/* Chapter Index Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Chapter Sequence</h2>
              <p className="text-xs text-slate-500">
                Select a chapter to read inside GaonLab or access authorized companion material
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {book.chapters.length} Chapters Ingested
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {book.chapters.map((ch) => {
              const isAuthorized = ch.accessMode === 'IN_APP_AUTHORIZED';

              return (
                <div
                  key={ch.chapterId}
                  className={`p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition ${
                    isAuthorized ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isAuthorized
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ch.chapterNumber}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-slate-900">{ch.title}</h3>
                        {isAuthorized && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>In-App Authorized Guide</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5">
                        {ch.pageCount && <span>{ch.pageCount} Pages</span>}
                        {ch.hasExplanations && (
                          <span className="text-brand-600 font-medium">
                            • Interactive Visual Explanations Ready
                          </span>
                        )}
                        <span>• Status: {ch.accessMode.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read / Open Action Button */}
                  <div>
                    {isAuthorized ? (
                      <button
                        onClick={() => handleChapterClick(ch)}
                        className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read In-App</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChapterClick(ch)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center space-x-1"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* External Portal & Copyright Notice Modal */}
      {showCopyrightModal && selectedExternalChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Official Textbook Notice
                </h3>
                <p className="text-xs text-slate-500">
                  Chapter {selectedExternalChapter.chapterNumber}: {selectedExternalChapter.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Official education board regulations prohibit third-party applications from hosting
              or embedding this textbook without explicit written permission.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-700">Choose your reading option:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Visit the official government textbook distribution portal directly.</li>
                <li>Or open a locally downloaded copy from your device in GaonLab Smart Reader.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCopyrightModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowCopyrightModal(false);
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center justify-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Open Local File</span>
              </button>

              <a
                href={selectedExternalChapter.officialSourceUrl || book.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCopyrightModal(false)}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow transition flex items-center justify-center space-x-1"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
