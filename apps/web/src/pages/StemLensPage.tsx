import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Camera,
  X,
  Copy,
  Check,
  Volume2,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  BookOpen,
  ArrowLeft,
  Mic,
  MicOff,
  Trash2,
  FileCode2,
  Database,
  Cloud,
} from 'lucide-react';
import {
  sendStemLensChat,
  StemLensChatMessage,
  StemLensSessionData,
  fetchStemLensPrompt,
  fetchStemLensSessions,
  fetchStemLensSessionById,
  createStemLensSession,
  deleteStemLensSession,
} from '../services/api';

export const StemLensPage: React.FC = () => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Supabase Chat Sessions state
  const [sessions, setSessions] = useState<StemLensSessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Input & attachments state
  const [inputText, setInputText] = useState('');
  const [stagedImage, setStagedImage] = useState<{
    file: File | null;
    previewUrl: string;
    base64: string;
    mimeType: string;
    name: string;
    sizeKb: number;
  } | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & previews
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState<{
    systemPrompt: string;
    filePath: string;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load persistent sessions from Supabase
  const loadSessions = useCallback(async (preferredId?: string) => {
    setIsLoadingSessions(true);
    try {
      const res = await fetchStemLensSessions('student-robin');
      setSupabaseConnected(!res.isFallback);

      if (res.data && res.data.length > 0) {
        setSessions(res.data);
        if (preferredId && res.data.some((s) => s.id === preferredId)) {
          setActiveSessionId(preferredId);
        } else {
          setActiveSessionId(res.data[0].id);
        }
      } else {
        // Create an initial persistent session in Supabase if brand new
        const createRes = await createStemLensSession(
          'New STEM Investigation',
          'student-robin'
        );
        if (createRes.data) {
          setSessions([createRes.data]);
          setActiveSessionId(createRes.data.id);
        }
      }
    } catch (err) {
      console.error('Failed to load sessions from Supabase:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSessions();
    fetchStemLensPrompt().then((res) => {
      if (res.data) {
        setPromptTemplate(res.data);
      }
    });
  }, [loadSessions]);

  // Active session
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] || {
      id: 'default',
      title: 'New STEM Investigation',
      userId: 'student-robin',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages?.length, isLoading]);

  // Close attachment menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Handle switching sessions and loading full message thread from Supabase
  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Refresh messages for that session from Supabase
    const res = await fetchStemLensSessionById(sessionId);
    if (res.data) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? res.data! : s))
      );
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
      setStagedImage({
        file,
        previewUrl: resultStr,
        base64: base64Data,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
      });
      setMenuOpen(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Voice recognition toggle (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Text-to-speech speaker
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#_`$]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .slice(0, 400);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Start a new chat session in Supabase
  const handleNewChat = async () => {
    try {
      const res = await createStemLensSession('New STEM Investigation', 'student-robin');
      if (res.data) {
        setSessions((prev) => [res.data, ...prev]);
        setActiveSessionId(res.data.id);
        setInputText('');
        setStagedImage(null);
        setIsImageMode(false);
      }
    } catch (err) {
      console.error('Failed to create new chat session in Supabase:', err);
    }
  };

  // Delete / clear a chat session in Supabase
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteStemLensSession(sessionId);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const createRes = await createStemLensSession(
          'New STEM Investigation',
          'student-robin'
        );
        if (createRes.data) {
          setSessions([createRes.data]);
          setActiveSessionId(createRes.data.id);
        }
      } else {
        setSessions(remaining);
        if (activeSessionId === sessionId) {
          setActiveSessionId(remaining[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Send message with Supabase persistence
  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt !== undefined ? overridePrompt : inputText.trim();
    if (!textToSend && !stagedImage) return;

    const tempUserId = `temp-${Date.now()}`;
    const newUserMessage: StemLensChatMessage = {
      id: tempUserId,
      sessionId: activeSessionId,
      role: 'user',
      content: textToSend,
      imageUrl: stagedImage?.previewUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...(s.messages || []), newUserMessage],
          };
        }
        return s;
      })
    );

    const imagePayload = stagedImage?.base64;
    const imageMime = stagedImage?.mimeType;
    const modePayload = isImageMode ? 'image' : 'chat';

    setInputText('');
    setStagedImage(null);
    setIsImageMode(false);
    setIsLoading(true);

    try {
      const res = await sendStemLensChat({
        sessionId: activeSessionId,
        userId: 'student-robin',
        message: textToSend,
        imageBase64: imagePayload,
        imageMimeType: imageMime,
        mode: modePayload,
      });

      const returnedSessionId = res.data.sessionId || activeSessionId;
      const assistantMessage: StemLensChatMessage = {
        id: res.data.assistantMessageId || `msg-ai-${Date.now()}`,
        sessionId: returnedSessionId,
        role: 'assistant',
        content: res.data.reply,
        generatedImageUrl: res.data.generatedImageUrl,
        model: res.data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Sync updated session with Supabase data
      setActiveSessionId(returnedSessionId);
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId || s.id === returnedSessionId) {
            const currentMsgs = (s.messages || []).filter((m) => m.id !== tempUserId);
            return {
              ...s,
              id: returnedSessionId,
              title: res.data.sessionTitle || s.title,
              updatedAt: new Date().toISOString(),
              messages: [
                ...currentMsgs,
                {
                  ...newUserMessage,
                  id: res.data.userMessageId || tempUserId,
                  sessionId: returnedSessionId,
                },
                assistantMessage,
              ],
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      console.error('Failed to get answer:', err);
      const errorMessage: StemLensChatMessage = {
        id: `msg-err-${Date.now()}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: `Error: Unable to connect to xAI Grok. ${err.message || 'Please check your connection and XAI_API_KEY in .env.'
          }`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return { ...s, messages: [...(s.messages || []), errorMessage] };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard Enter handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple Markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-base font-bold text-[#352F2A] mt-4 mb-2 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#FA9C4D]"></span>
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-lg font-extrabold text-[#352F2A] mt-5 mb-2.5 pb-1 border-b border-[#EFECE6]"
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-black text-[#352F2A] mt-5 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-[#4A4540] my-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemContent) }} />
          </li>
        );
      }

      if (/^\d+\.\s+/.test(line.trim())) {
        const itemContent = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <div
            key={idx}
            className="flex items-start gap-2 text-sm text-[#4A4540] my-1.5 leading-relaxed"
          >
            <span className="font-bold text-[#FA9C4D] shrink-0 text-xs mt-0.5">●</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemContent) }} />
          </div>
        );
      }

      if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
        const formula = line.trim().slice(2, -2).trim();
        return (
          <div
            key={idx}
            className="my-3 p-3 rounded-2xl bg-[#F7F5F2] border border-[#EFECE6] text-center font-mono text-sm text-[#352F2A] overflow-x-auto shadow-inner"
          >
            {formula}
          </div>
        );
      }

      // Markdown table row support
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line
          .trim()
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        // Skip separator row |---|---|
        if (cells.every((c) => /^[-:\s]+$/.test(c))) {
          return null;
        }
        return (
          <div
            key={idx}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-1 p-2.5 rounded-xl bg-[#FAF5EF] border border-[#EFECE6] text-xs shadow-soft-xs"
          >
            {cells.map((cell, cIdx) => (
              <div
                key={cIdx}
                className="font-medium text-[#352F2A] break-words"
                dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
              />
            ))}
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }

      return (
        <p
          key={idx}
          className="text-sm text-[#4A4540] leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#352F2A]">$1</strong>')
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded-md bg-[#F2EEE9] font-mono text-xs text-[#D47220] border border-[#E8E2D9]">$1</code>'
      )
      .replace(
        /\$([^\$]+)\$/g,
        '<span class="font-mono bg-[#F7F5F2] px-1 py-0.5 rounded text-xs text-[#2A2421] font-semibold border border-[#EFECE6]">$1</span>'
      );
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Filtered session list for search
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#FBFAF9] text-[#352F2A] antialiased overflow-hidden select-text font-sans">
      {/* =========================================================================
          LEFT SIDEBAR (COLLAPSIBLE - CHATGPT & SKILLUP HYBRID WITH SUPABASE SYNC)
          ========================================================================= */}
      <aside
        className={`${sidebarOpen ? 'w-72 sm:w-80' : 'w-0'
          } transition-all duration-300 ease-in-out flex flex-col bg-[#FFFFFF] border-r border-[#EFECE6] shrink-0 h-full overflow-hidden relative z-20 shadow-soft-sm`}
      >
        <div className="p-4 flex flex-col h-full w-72 sm:w-80">
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
            <Link to="/app/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] group-hover:scale-105 transition-transform shadow-soft-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-[#352F2A] flex items-center gap-1.5">
                  STEM Lens
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl hover:bg-[#F7F5F2] text-[#8A827A] hover:text-[#352F2A] transition-colors"
              title="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="mt-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#FFD9B8] text-[#352F2A] font-bold text-sm shadow-soft-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#FA9C4D] text-white flex items-center justify-center shadow-soft-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <span>New STEM Chat</span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-[#8A827A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous chats..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F7F5F2] border border-[#EFECE6] text-xs text-[#352F2A] placeholder-[#8A827A] focus:outline-none focus:border-[#FA9C4D]"
            />
          </div>

          {/* Database & Cloud Sync Badge */}
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#F7F5F2] border border-[#EFECE6] flex items-center justify-between text-[11px] text-[#636160]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
              <span className="font-semibold text-[#352F2A]">Supabase Storage</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-[#3ECF8E] animate-pulse' : 'bg-amber-400'
                  }`}
              ></span>
            </div>
          </div>

          {/* STEM Quick Navigation */}
          <div className="mt-3 pt-2 border-t border-[#EFECE6] space-y-1">
            <button
              onClick={() => {
                setIsImageMode(true);
                handleNewChat();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#636160] hover:bg-[#FAF5EF] hover:text-[#FA9C4D] transition-colors text-left"
            >
              <ImageIcon className="w-4 h-4 text-[#FA9C4D]" />
              <span>Generate STEM Diagrams</span>
            </button>
            <Link
              to="/app/dashboard"
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#636160] hover:bg-[#FAF5EF] hover:text-[#FA9C4D] transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-[#FFCF4F]" />
              <span>NCERT Curriculum Map</span>
            </Link>
          </div>

          {/* Recents List from Supabase */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[11px] font-bold text-[#8A827A] uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="w-3 h-3 text-[#3ECF8E]" />
                Saved Conversations
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F5F2] text-[#8A827A]">
                {filteredSessions.length}
              </span>
            </div>

            {isLoadingSessions ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-[#F7F5F2] rounded-xl animate-pulse flex items-center px-3"
                  />
                ))}
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#8A827A]">
                No conversations found. Start a new STEM chat above!
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const relativeTime = formatRelativeTime(session.updatedAt);
                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${isActive
                        ? 'bg-[#FFEEDD] text-[#352F2A] font-bold border border-[#FFD9B8] shadow-soft-xs'
                        : 'text-[#636160] hover:bg-[#FAF5EF] hover:text-[#352F2A]'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Camera
                          className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FA9C4D]' : 'text-[#8A827A]'
                            }`}
                        />
                        <div className="overflow-hidden">
                          <p className="truncate text-xs font-semibold text-[#352F2A]">
                            {session.title}
                          </p>
                          <span className="text-[10px] text-[#8A827A] font-normal block">
                            {relativeTime} • {session.messages?.length || 0} msgs
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1.5 rounded-lg hover:bg-white shrink-0"
                        title="Delete conversation from Supabase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CHAT CANVAS
          ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FBFAF9]">
        {/* Top Floating App Bar */}
        <header className="h-14 px-4 sm:px-8 border-b border-[#EFECE6] bg-[#FFFFFF]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-[#F7F5F2] text-[#8A827A] hover:text-[#352F2A] transition-colors"
                title="Open sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">

            {/* Exit to Dashboard */}
            <Link
              to="/app/dashboard"
              className="p-2 rounded-xl text-[#8A827A] hover:text-[#352F2A] hover:bg-[#F7F5F2] transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
          </div>
        </header>

        {/* Chat Stream / Empty State */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-4xl w-full mx-auto flex flex-col">
          {!currentSession.messages || currentSession.messages.length === 0 ? (
            /* ===================================================================
               EMPTY STATE (MATCHING ATTACHMENT 2: "Ready when you are.")
               =================================================================== */
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
              <div className="w-16 h-16 rounded-3xl bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] shadow-soft-md mb-6 animate-bounce">
                <Camera className="w-8 h-8" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#352F2A] tracking-tight">
                Ready when you are.
              </h1>
              <p className="mt-2 text-sm text-[#8A827A] max-w-md font-medium leading-relaxed">
                Capture leaves, tools, machinery, or soil to discover hidden physics, biology, and
                mathematics mapped to your syllabus. All chats are saved to Supabase so you can
                continue anytime.
              </p>
            </div>
          ) : (
            /* ===================================================================
               MESSAGE STREAM (LOADED DIRECTLY FROM SUPABASE)
               =================================================================== */
            <div className="space-y-6 pb-24">
              {currentSession.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'
                      } items-start group`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-soft-xs ${isUser
                        ? 'bg-[#FA9C4D] text-white'
                        : 'bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D]'
                        }`}
                    >
                      {isUser ? 'RP' : <Camera className="w-4 h-4" />}
                    </div>

                    {/* Message Body */}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-soft-sm ${isUser
                        ? 'bg-[#FFFFFF] border border-[#EFECE6] text-[#352F2A] rounded-tr-sm'
                        : 'bg-[#FFFFFF] border border-[#EFECE6] text-[#352F2A] rounded-tl-sm'
                        }`}
                    >
                      {/* Attached User Image Thumbnail */}
                      {msg.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-2xl border border-[#EFECE6] relative group/img cursor-pointer">
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded specimen"
                            className="max-h-64 w-full object-cover rounded-2xl hover:scale-102 transition-transform"
                            onClick={() => setLightboxUrl(msg.imageUrl || null)}
                          />
                          <button
                            onClick={() => setLightboxUrl(msg.imageUrl || null)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                            title="Expand image"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Text / Markdown Content */}
                      {isUser ? (
                        <p className="text-sm text-[#352F2A] font-medium leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {renderMarkdown(msg.content)}
                        </div>
                      )}

                      {/* Rendered Generated Image (if xAI Grok Imagine returned one) */}
                      {msg.generatedImageUrl && (
                        <div className="mt-4 pt-4 border-t border-[#EFECE6]">
                          <div className="flex items-center justify-between mb-2">
                            <a
                              href={msg.generatedImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-[#8A827A] hover:text-[#FA9C4D] flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Save Visual
                            </a>
                          </div>

                          <div className="relative group/gen rounded-2xl overflow-hidden border border-[#EFECE6] shadow-soft-sm bg-[#FAF5EF]">
                            <img
                              src={msg.generatedImageUrl}
                              alt="Generated STEM Visual"
                              className="w-full max-h-96 object-contain rounded-2xl cursor-pointer hover:scale-102 transition-transform"
                              onClick={() => setLightboxUrl(msg.generatedImageUrl || null)}
                            />
                            <button
                              onClick={() => setLightboxUrl(msg.generatedImageUrl || null)}
                              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover/gen:opacity-100 transition-opacity shadow-md"
                              title="Expand Visual"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions (Copy, TTS, Timestamp) */}
                      {!isUser && (
                        <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#8A827A]">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                              className="p-1 rounded-md hover:bg-[#F7F5F2] hover:text-[#352F2A] transition-colors"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-[#48AF76]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => speakText(msg.content)}
                              className="p-1 rounded-md hover:bg-[#F7F5F2] hover:text-[#352F2A] transition-colors"
                              title="Listen to explanation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-[10px] font-medium">
                            {msg.timestamp || 'Saved in Supabase'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4 items-start animate-in fade-in duration-300">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D] shadow-soft-xs">
                    <Camera className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#FFFFFF] border border-[#EFECE6] rounded-3xl p-5 shadow-soft-sm rounded-tl-sm flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FA9C4D] animate-bounce"></span>
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-[#FFCF4F] animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></span>
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-[#48AF76] animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></span>
                    </div>
                    <span className="text-xs text-[#8A827A] font-semibold">
                      {isImageMode
                        ? 'Grok Imagine is generating visual (saving to Supabase)...'
                        : stagedImage
                          ? 'xAI Grok Vision is examining specimen...'
                          : 'STEM Lens is consulting NCERT curriculum...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* =========================================================================
            BOTTOM FLOATING INPUT BAR (MATCHING ATTACHMENT 2)
            ========================================================================= */}
        <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto shrink-0 relative z-20">
          {/* Staged Image Thumbnail / Mode Chip */}
          {stagedImage && (
            <div className="mb-2 p-2 bg-[#FFFFFF] border border-[#EFECE6] rounded-2xl shadow-soft-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={stagedImage.previewUrl}
                  alt="Staged"
                  className="w-12 h-12 object-cover rounded-xl border border-[#EFECE6]"
                />
                <div>
                  <h5 className="text-xs font-bold text-[#352F2A] truncate max-w-[200px]">
                    {stagedImage.name}
                  </h5>
                  <p className="text-[10px] text-[#8A827A]">{stagedImage.sizeKb} KB • Ready to send</p>
                </div>
              </div>
              <button
                onClick={() => setStagedImage(null)}
                className="p-1.5 rounded-xl hover:bg-[#F7F5F2] text-[#8A827A] hover:text-red-500 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Mode Active Banner */}
          {isImageMode && !stagedImage && (
            <div className="mb-2 px-3.5 py-2 bg-[#FFEEDD] border border-[#FFD9B8] rounded-2xl flex items-center justify-between text-xs text-[#D47220] font-bold shadow-soft-xs animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FA9C4D]" />
                <span>
                  Create Image Mode: <strong>ON</strong> — Grok Imagine will generate an image for
                  this prompt
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsImageMode(false)}
                className="hover:text-[#352F2A] hover:bg-[#FFD9B8]/60 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                title="Turn off image mode"
              >
                <span>Turn OFF</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Attachment Popup Menu (Attachment 2 style) */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute bottom-24 left-6 sm:left-8 bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] shadow-soft-xl p-2 w-72 z-30 animate-in fade-in zoom-in-95"
            >
              <div className="p-2 border-b border-[#EFECE6] mb-1">
                <span className="text-[11px] font-bold text-[#8A827A] uppercase tracking-wider">
                  Add to STEM Investigation
                </span>
              </div>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-[#FAF5EF] text-left text-xs font-bold text-[#352F2A] transition-colors group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFEEDD] text-[#FA9C4D] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="group-hover:text-[#FA9C4D] transition-colors">
                    Add photos & files
                  </div>
                  <div className="text-[10px] text-[#8A827A] font-normal">
                    Upload specimen or camera capture
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsImageMode(!isImageMode);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                  isImageMode
                    ? 'bg-[#FFEEDD] border border-[#FA9C4D] text-[#D47220]'
                    : 'hover:bg-[#FAF5EF] text-[#352F2A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isImageMode ? 'bg-[#FA9C4D] text-white' : 'bg-[#CEECDA] text-[#48AF76]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={isImageMode ? 'text-[#D47220]' : 'text-[#352F2A]'}>
                      Create image
                    </div>
                    <div className="text-[10px] text-[#8A827A] font-normal">
                      {isImageMode
                        ? 'Image mode is ON (click to disable)'
                        : 'Toggle ON to generate an image'}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isImageMode ? 'bg-[#FA9C4D] text-white' : 'bg-[#F2EEE9] text-[#8A827A]'
                  }`}
                >
                  {isImageMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* The Rounded Capsule Input Box */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] shadow-soft-lg p-2 sm:p-2.5 flex items-center gap-2 focus-within:border-[#FA9C4D] transition-all">
            {/* Plus Button (Attachment Menu Toggle) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all shrink-0 ${menuOpen
                ? 'bg-[#FA9C4D] text-white rotate-45'
                : 'bg-[#F7F5F2] hover:bg-[#FFEEDD] text-[#8A827A] hover:text-[#FA9C4D]'
                }`}
              title="Add photos, files, or actions"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Input Textarea */}
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isImageMode
                  ? 'Describe the scientific image or diagram you want Grok Imagine to create...'
                  : stagedImage
                    ? 'Ask a question about this specimen, or leave blank to auto-analyze...'
                    : 'Ask STEM Lens or upload an image to analyze...'
              }
              className="flex-1 bg-transparent border-0 text-sm text-[#352F2A] placeholder-[#8A827A] focus:outline-none resize-none py-1.5 px-2 max-h-32"
            />

            {/* Controls on Right: Model Chip, Mic, Send */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mic / Voice Button */}
              <button
                onClick={toggleSpeechRecognition}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#F7F5F2] hover:bg-[#FFEEDD] text-[#8A827A] hover:text-[#FA9C4D]'
                  }`}
                title="Voice prompt"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                disabled={isLoading || (!inputText.trim() && !stagedImage)}
                onClick={() => handleSend()}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isLoading || (!inputText.trim() && !stagedImage)
                  ? 'bg-[#EFECE6] text-[#8A827A] cursor-not-allowed'
                  : 'bg-[#FA9C4D] hover:bg-[#EB8833] text-white shadow-soft-sm hover:scale-105 active:scale-95'
                  }`}
                title="Send Prompt (Saves to Supabase)"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between mt-2 px-2 text-[10px] text-[#8A827A]">
            <span className="hidden sm:inline">Press Enter to send, Shift + Enter for new line</span>
          </div>
        </div>
      </main>

      {/* =========================================================================
          LIGHTBOX MODAL (FOR ENLARGING USER OR GENERATED IMAGES)
          ========================================================================= */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-[#EFECE6] flex items-center justify-between">
              <span className="text-xs font-bold text-[#352F2A] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FA9C4D]" />
                STEM Visual Lightbox
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxUrl}
                  download="stem_specimen.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl hover:bg-[#F7F5F2] text-[#8A827A] hover:text-[#352F2A] transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxUrl(null)}
                  className="p-1.5 rounded-xl hover:bg-[#F7F5F2] text-[#8A827A] hover:text-[#352F2A] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-[#FAF5EF]">
              <img
                src={lightboxUrl}
                alt="Enlarged Visual"
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-soft-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SYSTEM PROMPT TEMPLATE MODAL
          ========================================================================= */}
      {showPromptModal && (
        <div
          onClick={() => setShowPromptModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#EFECE6] overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-5 border-b border-[#EFECE6] flex items-center justify-between bg-[#FAF5EF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D] flex items-center justify-center shadow-soft-xs">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#352F2A]">
                    STEM Lens System Prompt Template
                  </h3>
                  <p className="text-[11px] text-[#8A827A]">
                    Editable file:{' '}
                    <code className="text-[#D47220] font-mono font-bold">
                      {promptTemplate?.filePath || 'apps/api/src/modules/stem-lens/stemLensPrompt.ts'}
                    </code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPromptModal(false)}
                className="p-2 rounded-xl hover:bg-[#EFECE6] text-[#8A827A] hover:text-[#352F2A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FFEEDD]/60 border border-[#FFD9B8] text-xs text-[#352F2A] leading-relaxed">
                <strong className="text-[#D47220] block mb-1">Developer Notice:</strong>
                This system prompt is sent as the <code className="font-mono">system</code> role
                message to xAI Grok before every user prompt. You can customize the prompt directly in
                the file below:
                <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded-xl border border-[#FFD9B8] select-all">
                  apps/api/src/modules/stem-lens/stemLensPrompt.ts
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8A827A] uppercase tracking-wider block mb-2">
                  Active Template Content
                </label>
                <pre className="p-4 rounded-2xl bg-[#F7F5F2] border border-[#EFECE6] font-mono text-xs text-[#352F2A] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {promptTemplate?.systemPrompt || 'Loading prompt...'}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#EFECE6] flex items-center justify-between bg-[#FBFAF9]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptTemplate?.systemPrompt || '');
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#FFD9B8] text-xs font-bold text-[#D47220] transition-colors flex items-center gap-1.5"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-[#48AF76]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 rounded-xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-bold shadow-soft-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
