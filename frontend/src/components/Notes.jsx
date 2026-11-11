import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, Download, Mic, Save, Volume2, AlignLeft, AlignCenter, AlignRight, Eye } from "lucide-react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Notes = ({ addNotification = () => {}, onNotesSaved = () => {}, scope = "auto" }) => {
  const { roomData, updateNotes, currentRoom } = useStudyRoom();
  const { user, userProfile } = useAuth();
  const { darkMode } = useTheme();
  const isRoomMode = scope === "room" ? Boolean(currentRoom) : scope === "personal" ? false : Boolean(currentRoom);
  const notesStorageKey = isRoomMode ? "sr_notes" : "myspace_notes";
  const filesStorageKey = isRoomMode ? "sr_files" : "myspace_files";
  const [notes, setNotes] = useState("");
  const notesAreaRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [voicesList, setVoicesList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dictationLang, setDictationLang] = useState('en-US');
  const [autoPunct, setAutoPunct] = useState(true);

  const [activeBold, setActiveBold] = useState(false);
  const [activeItalic, setActiveItalic] = useState(false);
  const [activeUnderline, setActiveUnderline] = useState(false);
  const [activeAlign, setActiveAlign] = useState('left');

  useEffect(() => {
    if (isRoomMode && roomData && typeof roomData.sharedNotes === "string") {
      setNotes(roomData.sharedNotes || "");
      const el = notesAreaRef.current;
      if (el && el.innerHTML !== (roomData.sharedNotes || "")) {
        el.innerHTML = roomData.sharedNotes || "";
      }
      return;
    }

    const local = localStorage.getItem(notesStorageKey) || "";
    if (!isRoomMode && notesStorageKey === "myspace_notes" && !local) {
      const legacy = localStorage.getItem("sr_notes") || "";
      if (legacy) {
        localStorage.setItem(notesStorageKey, legacy);
        setNotes(legacy);
        return;
      }
    }
    setNotes(local);
  }, [roomData, isRoomMode, notesStorageKey]);

  useEffect(() => {
    if (!isRoomMode) {
      localStorage.setItem(notesStorageKey, notes);
    }
  }, [notes, isRoomMode, notesStorageKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(filesStorageKey);
      setUploadedFiles(raw ? JSON.parse(raw) : []);
    } catch {
      setUploadedFiles([]);
    }
  }, [filesStorageKey]);

  useEffect(() => {
    localStorage.setItem(filesStorageKey, JSON.stringify(uploadedFiles));
  }, [uploadedFiles, filesStorageKey]);

  useEffect(() => {
    const el = notesAreaRef.current;
    if (el && el.innerHTML !== notes) el.innerHTML = notes;
  }, [notes]);

  useEffect(() => {
    const el = notesAreaRef.current;
    if (!el) return;

    let t = null;
    const onInput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const html = el.innerHTML;
        setNotes(html);
        if (isRoomMode) {
          updateNotes(html);
          const name = user?.displayName || userProfile?.displayName || "You";
          addNotification(`💾 Notes saved to room by ${name}`);
        } else {
          try { localStorage.setItem(notesStorageKey, html); } catch {}
          addNotification("💾 Notes auto-saved");
        }
      }, 1000);
    };

    const onSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) {
        setActiveBold(false);
        setActiveItalic(false);
        setActiveUnderline(false);
        setActiveAlign('left');
        return;
      }
      
      try {
        if (document.queryCommandState) {
          setActiveBold(!!document.queryCommandState('bold'));
          setActiveItalic(!!document.queryCommandState('italic'));
          setActiveUnderline(!!document.queryCommandState('underline'));
          // alignment
          if (document.queryCommandState('justifyCenter')) setActiveAlign('center');
          else if (document.queryCommandState('justifyRight')) setActiveAlign('right');
          else setActiveAlign('left');
        }
      } catch (e) {}
    };

    el.addEventListener("input", onInput);
    const onPaste = (e) => {
      try {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
      } catch {}
    };
    el.addEventListener('paste', onPaste);
    document.addEventListener('selectionchange', onSelection);
    el.addEventListener('keyup', onSelection);
    el.addEventListener('mouseup', onSelection);

    return () => {
      el.removeEventListener("input", onInput);
      el.removeEventListener('paste', onPaste);
      document.removeEventListener('selectionchange', onSelection);
      el.removeEventListener('keyup', onSelection);
      el.removeEventListener('mouseup', onSelection);
      clearTimeout(t);
    };
  }, [isRoomMode, updateNotes, user, userProfile, addNotification, notesStorageKey]);

  const lastNotesRef = useRef("");
  const lastUpdaterRef = useRef(null);
  useEffect(() => {
    const incoming = roomData?.sharedNotes ?? null;
    const updaterId = roomData?.notesUpdatedById || null;
    const updaterName = roomData?.notesUpdatedByName || 'Someone';
    if (isRoomMode && typeof incoming === "string") {
      const isOwn = user && updaterId && updaterId === user.uid;
      const changed = incoming !== lastNotesRef.current;
      if (changed) {
        if (!isOwn && lastNotesRef.current !== "") {
          addNotification(`📝 Notes updated by ${updaterName}`);
        }
        lastNotesRef.current = incoming;
        lastUpdaterRef.current = updaterId;
      }
    }
  }, [roomData, isRoomMode, user]);

  useEffect(() => {
    const load = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      setVoicesList(vs);
      const pick =
        vs.find((v) => /siri/i.test(v.name)) ||
        vs.find((v) => /google us english/i.test(v.name)) ||
        vs[0] ||
        null;
      setSelectedVoice(pick);
    };
    load();
    if (window.speechSynthesis)
      window.speechSynthesis.onvoiceschanged = load;

  
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const formatText = (cmd) => {
    const el = notesAreaRef.current;
    if (!el) return;
    el.focus();
    try {
      document.execCommand(cmd, false, null);
    } catch (e) {
    }
    setNotes(el.innerHTML);

    setTimeout(() => {
      try {
        if (document.queryCommandState) {
          setActiveBold(!!document.queryCommandState('bold'));
          setActiveItalic(!!document.queryCommandState('italic'));
          setActiveUnderline(!!document.queryCommandState('underline'));
          if (document.queryCommandState('justifyCenter')) setActiveAlign('center');
          else if (document.queryCommandState('justifyRight')) setActiveAlign('right');
          else setActiveAlign('left');
        }
      } catch (e) {
      }
    }, 20);
  };

  const setAlignment = (align) => {
    const el = notesAreaRef.current;
    if (!el) return;
    el.focus();
    const cmd = align === 'center' ? 'justifyCenter' : align === 'right' ? 'justifyRight' : 'justifyLeft';
    try { document.execCommand(cmd, false, null); } catch {}
    setNotes(el.innerHTML);
    setActiveAlign(align);
  };

  const silenceTimerRef = useRef(null);

  const startDictation = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return addNotification("⚠️ Speech recognition not supported");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const rec = new SpeechRecognition();
    rec.lang = dictationLang || 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    let finalTranscript = '';
    
    rec.onresult = (ev) => {
  
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      let interimTranscript = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        const text = res[0]?.transcript || '';
        if (res.isFinal) {
          finalTranscript += text + ' ';
        } else {
          interimTranscript += text;
        }
      }
      if (finalTranscript) {
        const el = notesAreaRef.current;
        if (!el) return;
        const processed = autoPunct ? postProcessTranscript(finalTranscript) : finalTranscript;
        const current = el.innerText.trim();
        const sep = current && !/[\s\n]$/.test(el.innerText) ? ' ' : '';
        el.innerText = (current + sep + processed).trim();
        const html = el.innerHTML;
        setNotes(html);
        if (isRoomMode) {
          updateNotes(html);
        } else {
          try { localStorage.setItem(notesStorageKey, html); } catch {}
        }
        finalTranscript = '';


        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsRecording(false);
            addNotification('⏹️ Stopped (silence detected)');
          }
        }, 2000); 
      }
    };
    
    rec.onerror = (event) => {
      if (event.error !== 'no-speech') {
        addNotification("❌ Dictation error");
      }
      setIsRecording(false);
    };
    
    rec.onend = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setIsRecording(false);
    };
    
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    addNotification("🎤 Listening...");
  };

  const stopDictation = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setIsRecording(false);
    addNotification('⏹️ Stopped listening');
  };

  const postProcessTranscript = (text) => {
    let t = ' ' + text + ' ';

    t = t.replace(/\s(comma|,)(\s|$)/gi, ', ');
    t = t.replace(/\s(full stop|period|\.)(\s|$)/gi, '. ');
    t = t.replace(/\s(question mark|\?)(\s|$)/gi, '? ');
    t = t.replace(/\s(exclamation mark|!)(\s|$)/gi, '! ');
    t = t.replace(/\s(new line|line break)(\s|$)/gi, '\n');

    t = t.replace(/\s+([,\.!\?])/g, '$1 ');
    t = t.replace(/\s{2,}/g, ' ');
    t = t.trim();

    t = t.replace(/(^\s*[a-z])|([\.\!\?]\s+[a-z])/g, (m) => m.toUpperCase());
    return t;
  };

  const readNotesAloud = () => {
    const el = notesAreaRef.current;
    if (!el) return;
    const text = el.innerText.trim();
    if (!text) return addNotification("ℹ️ No notes to read");
    if (!("speechSynthesis" in window))
      return addNotification("🚫 Speech synthesis not supported");

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      addNotification("⏹️ Stopped reading");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utter.voice = selectedVoice;
    utter.onend = () => {
      setIsSpeaking(false);
      addNotification("✅ Finished reading");
    };
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    addNotification("🔊 Reading notes");
  };

  const handleFileUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const meta = {
          id: Date.now(),
          name: f.name,
          size: `${Math.round(f.size / 1024)} KB`,
          uploadedAt: new Date().toLocaleString(),
          content: content,
          type: f.type
        };
        setUploadedFiles((s) => [meta, ...s]);
        addNotification("📎 File added");
      };

      if (f.type.startsWith('text/') || f.name.endsWith('.txt') || f.name.endsWith('.md')) {
        reader.readAsText(f);
      } else {
        reader.readAsDataURL(f);
      }
    };

    const openFile = (file) => {
      if (file.type?.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const el = notesAreaRef.current;
        if (!el) return;
      
        if (confirm(`Load "${file.name}" into notes? This will replace current content.`)) {
          const htmlContent = file.content.replace(/\n/g, '<br>');
          el.innerHTML = htmlContent;
          setNotes(htmlContent);
          addNotification(`📄 Loaded ${file.name}`);
        }
      } else if (file.content?.startsWith('data:')) {
        const win = window.open();
        if (win) {
          win.document.write(`
            <html>
              <head><title>${file.name}</title></head>
              <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a1a;">
                ${file.type?.startsWith('image/') 
                  ? `<img src="${file.content}" alt="${file.name}" style="max-width:100%;max-height:100vh;" />`
                  : `<iframe src="${file.content}" style="width:100%;height:100vh;border:none;"></iframe>`
                }
              </body>
            </html>
          `);
          win.document.close();
        }
        addNotification(`📂 Opened ${file.name}`);
      }
    };

    const downloadFile = (file) => {
      if (file.content?.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = file.content;
        a.download = file.name;
        a.click();
      } else {
        const blob = new Blob([file.content], { type: file.type || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
      addNotification(`💾 Downloaded ${file.name}`);
  };

  const removeFile = (id) => {
    setUploadedFiles((s) => s.filter((x) => x.id !== id));
    addNotification("🗑️ File removed");
  };

  const getNotesStats = () => {
    const text = notesAreaRef.current?.innerText || (notes || "");
    const chars = text.length;
    const words = text.trim()
      ? text.trim().split(/\s+/).filter(Boolean).length
      : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { chars, words, minutes };
  };

  const saveLocalNotes = async () => {
    try {
      if (currentRoom) {
        updateNotes(notes);
        addNotification("💾 Notes saved to room");
      } else {
        localStorage.setItem("sr_notes", notes);
        addNotification("💾 Notes saved");
      }
      await onNotesSaved();
    } catch {
      addNotification("❌ Could not save notes");
    }
  };

  const downloadNotes = () => {
    const blob = new Blob([notes || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("📥 Notes downloaded");
  };

  const { chars, words, minutes } = getNotesStats();

  return (
    <div className="w-full flex flex-col flex-1 h-full bg-white/70 dark:bg-slate-900 text-slate-800 dark:text-white p-3 sm:p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden min-h-0">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 gap-2 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span>Notes</span>
        </h1>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={saveLocalNotes}
            className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Save
          </button>
          <button
            onClick={downloadNotes}
            className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="bg-slate-100/50 dark:bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-2.5 sm:mb-3 space-y-2 flex-shrink-0" style={{ userSelect: 'none' }}>
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap">
          <button
            onClick={() => formatText('bold')}
            className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg flex items-center justify-center transition ${activeBold ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatText('italic')}
            className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg flex items-center justify-center transition ${activeItalic ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatText('underline')}
            className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg flex items-center justify-center transition ${activeUnderline ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <u>U</u>
          </button>

          <span className="w-px h-5 bg-slate-300 dark:bg-white/10 mx-0.5" />

          <button 
            onClick={() => setAlignment('left')} 
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'left' ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => setAlignment('center')} 
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'center' ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <AlignCenter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => setAlignment('right')} 
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'right' ? 'bg-emerald-500 text-white' : 'bg-slate-200/50 text-slate-700 dark:bg-white/6 dark:text-white'}`}
          >
            <AlignRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={readNotesAloud}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition text-white ${
              isSpeaking ? 'bg-red-600' : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isSpeaking ? 'Stop' : 'Speak'}
          </button>

          <button
            onClick={isRecording ? stopDictation : startDictation}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition ${
              isRecording
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isRecording ? 'Stop' : 'Dictate'}
          </button>

          <select
            value={dictationLang}
            onChange={(e) => setDictationLang(e.target.value)}
            className="px-2 py-1.5 text-xs sm:text-sm rounded-md bg-slate-100/50 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200/50 dark:border-white/10 outline-none"
            title="Dictation language"
          >
            <option className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white" value="en-US">English (US)</option>
            <option className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white" value="en-IN">English (India)</option>
            <option className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white" value="en-GB">English (UK)</option>
            <option className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white" value="hi-IN">Hindi (India)</option>
            <option className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white" value="en-CA">English (Canada)</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={autoPunct} onChange={(e) => setAutoPunct(e.target.checked)} className="rounded" />
            Auto punctuation
          </label>

          <div className="w-full text-xs text-slate-500 dark:text-white/70 pt-1">
            {chars} chars • {words} words • {minutes} min read
          </div>
        </div>
      </div>

      <div
        ref={notesAreaRef}
        contentEditable
        suppressContentEditableWarning
        data-focusora-notes-editor="true"
        className="flex-1 min-h-[60px] bg-slate-100/50 dark:bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm sm:text-base leading-relaxed outline-none overflow-y-auto focus:ring-2 focus:ring-emerald-500/50 mb-2 text-slate-800 dark:text-white"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(16, 185, 129, 0.4) transparent'
        }}
      />

      <div className="bg-slate-100/60 dark:bg-white/5 backdrop-blur-lg rounded-xl p-2 sm:p-2.5 flex-shrink-0 mt-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <UploadCloud className="w-4 h-4 text-slate-500 dark:text-white/70 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 dark:text-white/70 shrink-0">Upload Notes</span>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="px-2.5 sm:px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer transition text-xs font-semibold text-white inline-flex items-center justify-center shrink-0 shadow-sm"
          >
            Choose File
          </label>
          <div className="text-xs text-slate-600 dark:text-gray-300 truncate max-w-[110px] sm:max-w-[180px]">
            {uploadedFiles.length ? `${uploadedFiles[0].name}` : 'No file chosen'}
          </div>
          <div className="ml-auto text-[10px] text-slate-500 dark:text-gray-300 shrink-0">Local only</div>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-white/10 rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-white/60">
                    {file.size} • {file.uploadedAt}
                  </p>
                </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openFile(file)}
                      className="text-blue-400 hover:text-blue-300 transition p-1"
                      title="Open/View file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadFile(file)}
                      className="text-green-400 hover:text-green-300 transition p-1"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-400 hover:text-red-300 transition text-xs px-2"
                    >
                      Remove
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
