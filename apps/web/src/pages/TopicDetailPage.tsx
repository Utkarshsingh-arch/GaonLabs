import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  fetchTopicDetail,
  fetchTopicLesson,
  fetchTopicVideo,
  fetchTopicResources,
} from '../services/api';
import { VideoPlayer } from '../components/VideoPlayer';
import {
  TopicDetail,
  TopicLesson,
  TopicVideoMeta,
  TopicOfficialResource,
} from '../types';

export const TopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as 'read' | 'watch' | 'resources') || 'read';

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [lesson, setLesson] = useState<TopicLesson | null>(null);
  const [video, setVideo] = useState<TopicVideoMeta | null>(null);
  const [resources, setResources] = useState<TopicOfficialResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetchTopicDetail(topicId),
      fetchTopicLesson(topicId),
      fetchTopicVideo(topicId),
      fetchTopicResources(topicId),
    ])
      .then(([topicRes, lessonRes, videoRes, resRes]) => {
        if (!isMounted) return;
        if (!topicRes.data) {
          setError('Topic not found in curriculum catalogue.');
        } else {
          setTopic(topicRes.data);
          setLesson(lessonRes.data);
          setVideo(videoRes.data);
          setResources(resRes.data || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load topic details.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topicId]);

  const handleTabChange = (tab: 'read' | 'watch' | 'resources') => {
    setSearchParams({ tab });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading GaonLab Topic...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Topic Not Available</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">{error || 'This topic is not catalogued.'}</p>
          <Link
            to="/app/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Explore STEM</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/app/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explore STEM</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Class {topic.grade}</span>
            <span>•</span>
            <span>{topic.subjectName}</span>
          </div>
        </div>
      </div>

      {/* Topic Hero Header */}
      <header className="bg-slate-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Class {topic.grade} {topic.subjectName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {topic.boardId === 'CBSE' ? 'CBSE (NCERT)' : 'Karnataka State Board (KTBS)'}
            </span>
            {topic.medium === 'kn' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ಕನ್ನಡ ಮಾಧ್ಯಮ
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>5 min lesson</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {topic.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            {topic.shortDescription}
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-slate-800 space-x-1">
            <button
              type="button"
              onClick={() => handleTabChange('read')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'read'
                  ? 'border-brand-400 text-brand-300 bg-brand-950/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{topic.medium === 'kn' ? 'ಪಾಠ ಓದಿ (Read)' : 'Read Lesson'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('watch')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'watch'
                  ? 'border-red-400 text-red-300 bg-red-950/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{topic.medium === 'kn' ? 'ವೀಡಿಯೊ (Watch)' : 'Watch Video'}</span>
              {video && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/30 text-red-200 font-bold">
                  {video.language === 'kn' ? 'ಕನ್ನಡ' : 'HD'}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('resources')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'resources'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{topic.medium === 'kn' ? `KTBS ಪಠ್ಯಪುಸ್ತಕ (${resources.length})` : `Official Resources (${resources.length})`}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* =========================================================================
            TAB 1: READ LESSON
           ========================================================================= */}
        {activeTab === 'read' && (
          <div className="space-y-6">
            {!lesson ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <p className="text-sm text-slate-500">In-app lesson is currently being prepared for this topic.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Article Content (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Section: Introduction */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                      <span>Introduction</span>
                    </h2>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {lesson.topicIntroduction}
                    </p>
                  </div>

                  {/* Section: Simple Explanation */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-6 border border-amber-200/70 shadow-sm">
                    <h2 className="text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      <span>Simple Explanation</span>
                    </h2>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                      {lesson.simpleExplanation}
                    </p>
                  </div>

                  {/* Section: Core Principles */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                      <span>Core Scientific Principles</span>
                    </h2>
                    <div className="space-y-4">
                      {lesson.scientificPrinciples.map((principle, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900">{principle.title}</h3>
                          </div>
                          <p className="text-xs text-slate-800 font-medium ml-8 mb-1">
                            {principle.statement}
                          </p>
                          {principle.formula && (
                            <div className="ml-8 my-2 inline-block px-3 py-1 rounded bg-indigo-50 border border-indigo-200 font-mono text-xs text-indigo-800 font-semibold">
                              {principle.formula}
                            </div>
                          )}
                          <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                            {principle.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Step-by-Step Examples */}
                  {lesson.examples && lesson.examples.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 mb-4">
                        Step-by-Step Conceptual Examples
                      </h2>
                      <div className="space-y-4">
                        {lesson.examples.map((ex, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-sm text-slate-900">{ex.title}</h3>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {ex.context}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed mt-1">
                              {ex.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Diagrams & Interactive Demonstrations */}
                  {lesson.diagrams && lesson.diagrams.length > 0 && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                          Visual Breakdown & Demonstration
                        </span>
                        <span className="text-xs text-slate-400">Concept Diagram</span>
                      </div>
                      {lesson.diagrams.map((diag) => (
                        <div key={diag.id} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-bold text-white mb-1">{diag.title}</h4>
                          <p className="text-xs text-slate-300 mb-2">{diag.caption}</p>
                          <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                            {diag.spec?.asciiDiagram || diag.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section: Real-World Rural Application */}
                  {lesson.realWorldApplications && lesson.realWorldApplications.length > 0 && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl p-6 border border-emerald-200/80 shadow-sm">
                      <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                        <span>🌾 Rural & Village Applications</span>
                      </div>
                      <div className="space-y-4">
                        {lesson.realWorldApplications.map((app, idx) => (
                          <div key={idx} className="p-3.5 bg-white/80 rounded-xl border border-emerald-100">
                            <h3 className="text-sm font-bold text-emerald-950 mb-1">
                              {app.title}
                            </h3>
                            <p className="text-xs text-emerald-900 leading-relaxed">
                              {app.description}
                            </p>
                            {app.villageContext && (
                              <p className="text-[11px] text-emerald-700 font-medium mt-1.5 italic">
                                Context: {app.villageContext}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar (1 Col): Key Takeaways & Glossary */}
                <div className="space-y-6">
                  {/* Key Takeaways Card */}
                  {lesson.importantTakeaways && (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Key Takeaways</span>
                      </h3>
                      <ul className="space-y-2.5">
                        {lesson.importantTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-emerald-500 font-bold text-sm leading-none">•</span>
                            <span className="leading-normal">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mini Glossary */}
                  {lesson.glossary && lesson.glossary.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>Vocabulary & Glossary</span>
                      </h3>
                      <dl className="space-y-3">
                        {lesson.glossary.map((item, idx) => (
                          <div key={idx} className="border-b border-slate-100 pb-2.5 last:border-b-0">
                            <dt className="text-xs font-bold text-slate-800">{item.term}</dt>
                            <dd className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {item.definition}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Video Prompt Card */}
                  {video && (
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl p-5 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5 text-white" />
                        <h4 className="text-sm font-bold">
                          {topic.medium === 'kn' ? 'ಕನ್ನಡ ಅನಿಮೇಷನ್ ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ' : 'Watch Concept Animation'}
                        </h4>
                      </div>
                      <p className="text-xs text-red-100 leading-relaxed mb-4">
                        {topic.medium === 'kn'
                          ? 'ಸಚಿತ್ರ ರೇಖಾಚಿತ್ರಗಳು ಮತ್ತು ಕನ್ನಡ ಧ್ವನಿ ವಿವರಣೆಯೊಂದಿಗೆ ಈ ವಿಷಯವನ್ನು ವೀಕ್ಷಿಸಿ.'
                          : 'Prefer learning visually? Watch our narrated video with closed captions.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleTabChange('watch')}
                        className="w-full py-2 bg-white text-rose-700 font-bold text-xs rounded-xl shadow hover:bg-red-50 transition"
                      >
                        {topic.medium === 'kn' ? 'ವೀಡಿಯೊ ಪ್ಲೇ ಮಾಡಿ (Play Video)' : 'Play Video Now'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: WATCH VIDEO
           ========================================================================= */}
        {activeTab === 'watch' && (
          <div className="space-y-6">
            {!video ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {topic.medium === 'kn' ? 'ಕನ್ನಡ ಸಚಿತ್ರ ವೀಡಿಯೊ ನಿರ್ಮಾಣ ಹಂತದಲ್ಲಿದೆ' : 'Animated Video in Production'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {topic.medium === 'kn'
                    ? 'ಈ ವಿಷಯಕ್ಕೆ ಕನ್ನಡ ಧ್ವನಿ ವಿವರಣೆಯುಳ್ಳ ಸಚಿತ್ರ ಅನಿಮೇಷನ್ ವೀಡಿಯೊ ಸದ್ಯದಲ್ಲೇ ಬಿಡುಗಡೆಯಾಗಲಿದೆ. ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಪೂರ್ಣ ಕನ್ನಡ ಪಾಠವನ್ನು ಓದಬಹುದು.'
                    : 'The narrated animated video for this topic is currently being generated. You can still read the comprehensive lesson.'}
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange('read')}
                  className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700"
                >
                  {topic.medium === 'kn' ? 'ಕನ್ನಡ ಪಾಠವನ್ನು ಓದಿ (Read Lesson)' : 'Read Lesson Instead'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Player Column (2 Cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <VideoPlayer
                    src={video.streamUrl}
                    captionSrc={video.captionsUrl}
                    captionLabel={video.language === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
                    title={video.title}
                    autoPlay={false}
                  />

                  {/* Video Metadata Bar */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{video.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Narrated GaonLab STEM Animation • {video.language === 'kn' ? 'ಕನ್ನಡ ವಿವರಣೆ (Kannada)' : 'English'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                          {Math.floor(video.durationSeconds / 60)}m {Math.floor(video.durationSeconds % 60)}s
                        </span>
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                          {video.resolution}
                        </span>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold">
                          CC Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Scenes / Chapter Breakdown (1 Col) */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-600" />
                      <span>Narrated Video Features</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>High-definition 1280x720 vector animation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Crystal-clear voice narration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Synchronized WebVTT closed captions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Low-bandwidth HTTP 206 partial content streaming</span>
                      </li>
                    </ul>
                  </div>

                  {/* Copyright and Attribution Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Original Production</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Generated dynamically by GaonLab Media Engine using vector rendering, verified STEM physics models, and educational TTS voice synthesis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: OFFICIAL RESOURCES & CURRICULUM
           ========================================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Compliance Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Curriculum Compliance & Official Alignment</span>
                <p className="mt-0.5 text-blue-800/90 leading-relaxed text-[11px]">
                  GaonLab provides original supplementary explanations. The links below direct to authorised textbook editions published by the National Council of Educational Research and Training (NCERT) and the Karnataka School Examination and Assessment Board (KTBS) under open educational access guidelines.
                </p>
              </div>
            </div>

            {/* Resources List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {res.publisher}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {res.boardName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {res.textbookTitle}
                    </h3>
                    {res.chapterNumber && (
                      <p className="text-xs text-brand-700 font-semibold mb-3">
                        Chapter {res.chapterNumber}: {res.chapterTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {res.licenceNotice}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Curriculum Verified
                    </span>
                    <a
                      href={res.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                    >
                      <span>Open Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
