import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Search,
  Highlighter,
  Underline as UnderlineIcon,
  Sparkles,
  Bookmark,
  FileText,
  Upload,
  ArrowLeft,
  Trash2,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { getDemoSession } from '../services/demoAuth';
import { fetchReaderDocument, explainSelectedText } from '../services/api';
import {
  saveAnnotation,
  getAnnotationsForDocument,
  deleteAnnotation,
} from '../services/annotationStorage';
import {
  ReaderDocument,
  ReaderAnnotation,
  ContextualExplanation,
  BoundingBox,
  NormalizedBoundingBox,
} from '../types';
import { ContextualExplanationModal } from '../components/ContextualExplanationModal';

declare const pdfjsLib: any;

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', bg: '#fef08a', border: '#eab308' },
  { name: 'Green', bg: '#bbf7d0', border: '#22c55e' },
  { name: 'Blue', bg: '#bfdbfe', border: '#3b82f6' },
  { name: 'Pink', bg: '#fbcfe8', border: '#ec4899' },
];

export const ReaderPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const demoStudent = getDemoSession();
  const learnerId = demoStudent?.email || demoStudent?.name || 'demo-student';

  const [docMeta, setDocMeta] = useState<ReaderDocument | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.15);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'annotations' | 'search'>('pages');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: number; text: string }[]>([]);

  // Annotations
  const [annotations, setAnnotations] = useState<ReaderAnnotation[]>([]);
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0].bg);
  const [selectionToolbar, setSelectionToolbar] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    page: number;
    rects: BoundingBox[];
    normalizedRects: NormalizedBoundingBox[];
  } | null>(null);

  // Contextual explanation modal
  const [activeExplanation, setActiveExplanation] = useState<{
    explanation: ContextualExplanation;
    selectedText: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // 1. Initial Load: Metadata & PDF
  useEffect(() => {
    let isMounted = true;

    async function loadDocument() {
      setIsLoading(true);
      setErrorMsg(null);

      // Handle user local upload vs backend document
      if (documentId === 'local' && location.state?.localPdfUrl) {
        setDocMeta({
          documentId: 'local',
          title: location.state?.localFileName || 'Locally Selected Textbook Document',
          topic: 'User Provided Document',
          grade: demoStudent?.grade || 8,
          subject: 'Custom STEM',
          language: 'en',
          accessMode: 'USER_LOCAL_ONLY',
          url: location.state.localPdfUrl,
          totalEstimatedPages: 1,
          license: 'Personal Study / Local Device File',
          author: 'User Local Storage',
          copyrightNotice: 'Loaded locally from student device. Not uploaded or stored on GaonLab servers.',
          isCompanionGuide: false,
        });

        loadPdfFromUrl(location.state.localPdfUrl);
        return;
      }

      if (!documentId) {
        setErrorMsg('No document specified');
        setIsLoading(false);
        return;
      }

      const res = await fetchReaderDocument(documentId);
      if (!isMounted) return;

      if (res.data) {
        setDocMeta(res.data);
        loadPdfFromUrl(res.data.url);
      } else {
        setErrorMsg('Document resource could not be found or is not authorized for in-app reading.');
        setIsLoading(false);
      }
    }

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  // Load PDF using Mozilla PDF.js
  const loadPdfFromUrl = async (url: string) => {
    try {
      if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF.js library is not loaded');
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setIsLoading(false);

      // Load saved annotations for this document & learner
      const saved = await getAnnotationsForDocument(learnerId, documentId || 'local');
      setAnnotations(saved);
    } catch (err: any) {
      console.error('PDF.js loading failed:', err);
      setErrorMsg('Failed to render PDF: ' + err.message);
      setIsLoading(false);
    }
  };

  // Reload annotations when learner profile changes
  useEffect(() => {
    if (docMeta) {
      getAnnotationsForDocument(learnerId, documentId || 'local').then((saved) => {
        setAnnotations(saved);
      });
    }
  }, [learnerId, documentId, docMeta]);

  // 2. Render Page on canvas & textLayer
  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cancel previous render task if active
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore cancellation
          }
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setPageSize({ width: viewport.width, height: viewport.height });

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        // Render transparent text overlay for exact text selection
        if (textLayerRef.current) {
          const textLayer = textLayerRef.current;
          textLayer.innerHTML = '';
          textLayer.style.setProperty('--scale-factor', `${viewport.scale}`);
          textLayer.style.height = `${Math.floor(viewport.height)}px`;
          textLayer.style.width = `${Math.floor(viewport.width)}px`;

          const textContent = await page.getTextContent();

          if (typeof pdfjsLib.renderTextLayer === 'function') {
            await pdfjsLib.renderTextLayer({
              textContentSource: textContent,
              container: textLayer,
              viewport: viewport,
              textDivs: [],
            }).promise;
          } else {
            // Fallback rendering
            textContent.items.forEach((item: any) => {
              if (!item.str) return;
              const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
              const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);

              const span = document.createElement('span');
              span.textContent = item.str;
              span.style.position = 'absolute';
              span.style.left = `${tx[4]}px`;
              span.style.top = `${tx[5] - fontHeight}px`;
              span.style.fontSize = `${fontHeight}px`;
              span.style.fontFamily = item.fontName || 'sans-serif';
              span.style.color = 'transparent';
              span.className = 'pdf-text-item select-text';
              textLayer.appendChild(span);
            });
          }
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
      }
    },
    [pdfDoc, scale]
  );

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // 3. Precise Selection Toolbar Detection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionToolbar(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 1) {
      setSelectionToolbar(null);
      return;
    }

    const textLayer = textLayerRef.current;
    if (!textLayer) return;

    try {
      const range = selection.getRangeAt(0);

      // Verify that the selection is inside our text layer
      if (!textLayer.contains(range.commonAncestorContainer) && !range.intersectsNode(textLayer)) {
        return;
      }

      const parentRect = textLayer.getBoundingClientRect();
      if (parentRect.width === 0 || parentRect.height === 0) return;

      const clientRects = range.getClientRects();
      if (!clientRects || clientRects.length === 0) return;

      const rects: BoundingBox[] = [];
      const normalizedRects: NormalizedBoundingBox[] = [];

      for (let i = 0; i < clientRects.length; i++) {
        const r = clientRects[i];
        if (r.width <= 0 || r.height <= 0) continue;

        const top = r.top - parentRect.top;
        const left = r.left - parentRect.left;

        rects.push({
          top,
          left,
          width: r.width,
          height: r.height,
        });

        // Scale-invariant normalized coordinates (0.0 to 1.0)
        normalizedRects.push({
          x: Math.max(0, Math.min(1, left / parentRect.width)),
          y: Math.max(0, Math.min(1, top / parentRect.height)),
          width: Math.max(0, Math.min(1, r.width / parentRect.width)),
          height: Math.max(0, Math.min(1, r.height / parentRect.height)),
        });
      }

      if (rects.length === 0) return;

      const rangeBoundingRect = range.getBoundingClientRect();
      const toolbarWidth = 320;
      let toolbarX = rangeBoundingRect.left + rangeBoundingRect.width / 2 - toolbarWidth / 2;
      toolbarX = Math.max(16, Math.min(window.innerWidth - toolbarWidth - 16, toolbarX));

      let toolbarY = rangeBoundingRect.top - 54;
      if (toolbarY < 65) {
        toolbarY = rangeBoundingRect.bottom + 12;
      }

      setSelectionToolbar({
        visible: true,
        x: toolbarX,
        y: toolbarY,
        text,
        page: currentPage,
        rects,
        normalizedRects,
      });
    } catch {
      setSelectionToolbar(null);
    }
  }, [currentPage]);

  // Global mouseup listener for smooth text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // 4. Save Annotation
  const handleCreateAnnotation = async (type: 'HIGHLIGHT' | 'UNDERLINE' | 'NOTE') => {
    if (!selectionToolbar) return;

    if (type === 'NOTE') {
      setShowNoteModal(true);
      return;
    }

    const newAnnotation: ReaderAnnotation = {
      id: 'ann-' + Date.now(),
      learnerId,
      documentId: documentId || 'local',
      pageNumber: selectionToolbar.page,
      selectedText: selectionToolbar.text,
      color: selectedColor,
      annotationType: type,
      rects: selectionToolbar.rects,
      normalizedRects: selectionToolbar.normalizedRects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveAnnotation(newAnnotation);
    setAnnotations((prev) => [...prev, newAnnotation]);
    setSelectionToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleSaveNote = async () => {
    if (!selectionToolbar || !noteInput.trim()) return;

    const newAnnotation: ReaderAnnotation = {
      id: 'ann-' + Date.now(),
      learnerId,
      documentId: documentId || 'local',
      pageNumber: selectionToolbar.page,
      selectedText: selectionToolbar.text,
      color: selectedColor,
      annotationType: 'NOTE',
      note: noteInput.trim(),
      rects: selectionToolbar.rects,
      normalizedRects: selectionToolbar.normalizedRects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveAnnotation(newAnnotation);
    setAnnotations((prev) => [...prev, newAnnotation]);
    setShowNoteModal(false);
    setNoteInput('');
    setSelectionToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteAnnotation = async (id: string) => {
    await deleteAnnotation(id);
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // 5. Contextual Explanation Trigger
  const handleTriggerExplanation = async () => {
    if (!selectionToolbar) return;
    const textToExplain = selectionToolbar.text;

    try {
      const res = await explainSelectedText({
        selectedText: textToExplain,
        documentId: documentId || 'local',
        grade: docMeta?.grade || demoStudent?.grade || 8,
      });

      if (res.data) {
        setActiveExplanation({
          explanation: res.data,
          selectedText: textToExplain,
        });
      }
    } catch (err) {
      console.error('Explanation request failed:', err);
    } finally {
      setSelectionToolbar(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // 6. Local PDF Selection
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setDocMeta({
      documentId: 'local',
      title: file.name.replace(/\.pdf$/i, ''),
      topic: 'Local Student File',
      grade: demoStudent?.grade || 8,
      subject: 'Local Document',
      language: 'en',
      accessMode: 'USER_LOCAL_ONLY',
      url: objectUrl,
      totalEstimatedPages: 1,
      license: 'Personal Study / Local Device',
      author: 'Local Device Storage',
      copyrightNotice: 'Loaded locally from device storage without server upload.',
      isCompanionGuide: false,
    });

    loadPdfFromUrl(objectUrl);
  };

  // 7. Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // 8. Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfDoc || !searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    const results: { page: number; text: string }[] = [];

    for (let p = 1; p <= numPages; p++) {
      const page = await pdfDoc.getPage(p);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((i: any) => i.str).join(' ');
      if (pageText.toLowerCase().includes(query)) {
        results.push({ page: p, text: pageText.slice(0, 100) + '...' });
      }
    }
    setSearchResults(results);
    setActiveTab('search');
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      onMouseUp={handleMouseUp}
    >
      {/* Hidden local PDF file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleLocalFileSelect}
      />

      {/* Top Smart Reader Toolbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        {/* Left: Navigation and Document Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1 text-xs"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {docMeta?.isCompanionGuide ? 'GaonLab Visual Guide' : 'Smart Reader'}
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                Class {docMeta?.grade || 8} • {docMeta?.subject || 'Science'}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-sm md:max-w-md">
              {docMeta?.title || 'Loading Textbook...'}
            </h1>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 text-xs shadow-inner">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-slate-300 font-semibold px-1">
            Page {currentPage} of {numPages || 1}
          </span>

          <button
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, Search, Local Open & Fullscreen */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Zoom Out */}
          <button
            onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] text-slate-400 w-10 text-center font-mono hidden sm:inline">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => setScale((s) => Math.min(2.2, s + 0.15))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Fit to width */}
          <button
            onClick={() => setScale(1.35)}
            className="hidden md:inline px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded font-medium transition"
            title="Fit to Width"
          >
            Fit Width
          </button>

          {/* Open Local PDF */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 text-xs transition"
            title="Open local PDF from device without uploading"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline font-medium">Open Local PDF</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`p-1.5 rounded transition ${
              sidebarOpen ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
            title="Toggle Reader Tools"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Reader Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left/Center PDF Canvas Stage */}
        <main className="flex-1 overflow-auto bg-slate-900/95 flex flex-col items-center p-4 sm:p-6 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Rendering PDF pages...</p>
            </div>
          ) : errorMsg ? (
            <div className="max-w-md bg-rose-950/80 border border-rose-500/50 rounded-2xl p-6 text-center text-rose-200 mt-12 space-y-3 shadow-xl">
              <HelpCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="font-bold text-base text-white">Reading Notice</h3>
              <p className="text-xs leading-relaxed">{errorMsg}</p>
              <div className="pt-2 flex justify-center space-x-3">
                <Link
                  to="/app/library"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Return to Library
                </Link>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Open Local File
                </button>
              </div>
            </div>
          ) : (
            <div
              className="pdf-page-container relative shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white"
              style={{
                width: pageSize.width ? `${pageSize.width}px` : 'auto',
                height: pageSize.height ? `${pageSize.height}px` : 'auto',
              }}
            >
              {/* Layer 1: PDF Canvas */}
              <canvas ref={canvasRef} className="pdf-canvas-layer block" style={{ zIndex: 1 }} />

              {/* Layer 2: Text Layer Overlay for natural selection */}
              <div
                ref={textLayerRef}
                className="pdf-text-layer textLayer absolute inset-0 select-text cursor-text pointer-events-auto"
                style={{
                  zIndex: 2,
                  width: pageSize.width ? `${pageSize.width}px` : '100%',
                  height: pageSize.height ? `${pageSize.height}px` : '100%',
                  transformOrigin: '0 0',
                }}
              />

              {/* Layer 3: Rendered Annotations Overlays on Current Page */}
              <div
                className="pdf-annotation-layer absolute inset-0 pointer-events-none"
                style={{ zIndex: 3 }}
              >
                {annotations
                  .filter((ann) => ann.pageNumber === currentPage)
                  .map((ann) => {
                    const boxes =
                      ann.normalizedRects &&
                      ann.normalizedRects.length > 0 &&
                      pageSize.width > 0 &&
                      pageSize.height > 0
                        ? ann.normalizedRects.map((norm) => ({
                            top: norm.y * pageSize.height,
                            left: norm.x * pageSize.width,
                            width: norm.width * pageSize.width,
                            height: norm.height * pageSize.height,
                          }))
                        : ann.rects || [];

                    const isUnderline = ann.annotationType === 'UNDERLINE';
                    const underlineColor =
                      ann.color === '#fef08a'
                        ? '#eab308'
                        : ann.color === '#bbf7d0'
                        ? '#16a34a'
                        : ann.color === '#fbcfe8'
                        ? '#db2777'
                        : ann.color || '#2563eb';

                    return (
                      <div key={ann.id} className="contents">
                        {boxes.map((b, idx) => {
                          if (isUnderline) {
                            return (
                              <div
                                key={`${ann.id}-${idx}`}
                                className="absolute pointer-events-none transition-all shadow-sm"
                                style={{
                                  top: `${Math.round(b.top + b.height - 2)}px`,
                                  left: `${Math.round(b.left)}px`,
                                  width: `${Math.round(b.width)}px`,
                                  height: '3px',
                                  backgroundColor: underlineColor,
                                  borderRadius: '1.5px',
                                }}
                                title={ann.selectedText}
                              />
                            );
                          }

                          return (
                            <div
                              key={`${ann.id}-${idx}`}
                              className="absolute pointer-events-none transition-all rounded-[2px]"
                              style={{
                                top: `${Math.round(b.top)}px`,
                                left: `${Math.round(b.left)}px`,
                                width: `${Math.round(b.width)}px`,
                                height: `${Math.round(b.height)}px`,
                                backgroundColor: ann.color || '#fef08a',
                                opacity: 0.42,
                                mixBlendMode: 'multiply',
                              }}
                              title={ann.note ? `${ann.selectedText}: ${ann.note}` : ann.selectedText}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Floating Text Selection Toolbar */}
          {selectionToolbar && selectionToolbar.visible && (
            <div
              className="fixed z-50 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl p-1.5 flex items-center space-x-1 text-xs animate-scaleUp"
              style={{
                top: `${selectionToolbar.y}px`,
                left: `${selectionToolbar.x}px`,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Highlight Action */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCreateAnnotation('HIGHLIGHT')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition font-medium"
                title="Highlight selected text"
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Highlight</span>
              </button>

              {/* Color picker pills */}
              <div className="flex items-center space-x-1 px-1 border-r border-slate-700">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSelectedColor(c.bg)}
                    className={`w-4 h-4 rounded-full border transition ${
                      selectedColor === c.bg ? 'scale-125 ring-2 ring-white' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Underline Action */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCreateAnnotation('UNDERLINE')}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium"
                title="Underline selected text"
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
                <span>Underline</span>
              </button>

              {/* Contextual Explain Action */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleTriggerExplanation}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold shadow transition animate-pulse"
                title="Open Contextual Explanation with interactive visual model"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-200" />
                <span>Explain</span>
              </button>

              {/* Add Note Action */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCreateAnnotation('NOTE')}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium"
                title="Add student note"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>
            </div>
          )}
        </main>

        {/* Right Collapsible Reader Sidebar: Thumbnails, Annotations & Search */}
        {sidebarOpen && (
          <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col z-20 shadow-xl transition-all">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-semibold text-slate-400">
              <button
                onClick={() => setActiveTab('pages')}
                className={`flex-1 py-3 text-center transition ${
                  activeTab === 'pages'
                    ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/50'
                    : 'hover:text-slate-200'
                }`}
              >
                Pages ({numPages})
              </button>
              <button
                onClick={() => setActiveTab('annotations')}
                className={`flex-1 py-3 text-center transition ${
                  activeTab === 'annotations'
                    ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/50'
                    : 'hover:text-slate-200'
                }`}
              >
                Notes ({annotations.length})
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 text-center transition ${
                  activeTab === 'search'
                    ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/50'
                    : 'hover:text-slate-200'
                }`}
              >
                Search
              </button>
            </div>

            {/* Tab 1: Pages & Thumbnails */}
            {activeTab === 'pages' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Document Overview
                </div>
                {Array.from({ length: numPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        currentPage === pNum
                          ? 'bg-brand-900/40 border-brand-500/60 text-brand-200 shadow-md'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-9 rounded flex items-center justify-center font-mono text-xs border ${
                            currentPage === pNum
                              ? 'bg-brand-800 border-brand-400 text-white font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {pNum}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            {pNum === 1
                              ? 'Part I: Force and Motion'
                              : pNum === 2
                              ? 'Part II: Surface Interlocking'
                              : 'Part III: Types & Village STEM'}
                          </p>
                          <span className="text-[10px] text-slate-500">Page {pNum}</span>
                        </div>
                      </div>
                      {currentPage === pNum && (
                        <CheckCircle className="w-4 h-4 text-brand-400" />
                      )}
                    </button>
                  );
                })}

                {/* Educational companion badge */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mt-6">
                  <div className="flex items-center space-x-2 text-xs font-bold text-brand-300 mb-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>In-App Authorized Guide</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This document is an original GaonLab visual learning guide designed for Class 8
                    Science. It connects textbook concepts with local village observations.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Saved Annotations */}
            {activeTab === 'annotations' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  <span>Saved Annotations</span>
                  <span>{annotations.length} items</span>
                </div>

                {annotations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs">No highlights saved yet.</p>
                    <p className="text-[11px] text-slate-600">
                      Select any text in the textbook and click <strong>Highlight</strong> or{' '}
                      <strong>Note</strong>.
                    </p>
                  </div>
                ) : (
                  annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: ann.color + '33',
                            color: ann.color,
                          }}
                        >
                          {ann.annotationType} • Page {ann.pageNumber}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnotation(ann.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete annotation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p
                        onClick={() => setCurrentPage(ann.pageNumber)}
                        className="text-xs text-slate-200 italic font-serif leading-relaxed line-clamp-3 cursor-pointer hover:underline"
                        title="Click to jump to page"
                      >
                        "{ann.selectedText}"
                      </p>

                      {ann.note && (
                        <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[11px] text-brand-300">
                          📌 <strong>Note:</strong> {ann.note}
                        </div>
                      )}

                      <div className="text-[9px] text-slate-500">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Search within document */}
            {activeTab === 'search' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words (e.g. friction)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                </form>

                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(res.page)}
                      className="w-full text-left p-2.5 bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800 text-xs transition"
                    >
                      <div className="font-bold text-brand-400 text-[10px] uppercase">
                        Page {res.page}
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                        {res.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Note Input Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-brand-400" />
              <span>Add Learning Note to Selected Text</span>
            </h3>

            <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-h-20 overflow-y-auto font-serif">
              "{selectionToolbar?.text}"
            </p>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Write your observation, question, or study reminder..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              autoFocus
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Explanation Modal */}
      {activeExplanation && (
        <ContextualExplanationModal
          explanation={activeExplanation.explanation}
          selectedText={activeExplanation.selectedText}
          onClose={() => setActiveExplanation(null)}
        />
      )}
    </div>
  );
};
