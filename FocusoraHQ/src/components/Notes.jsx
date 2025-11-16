import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, Download, Mic, Save, Volume2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const Notes = ({ addNotification = () => {} }) => {
  const { roomData, updateNotes, currentRoom } = useStudyRoom();
  const { user, userProfile } = useAuth();
  const [notes, setNotes] = useState("");
  const notesAreaRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [voicesList, setVoicesList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    try {
      const raw = localStorage.getItem("sr_files");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [dictationLang, setDictationLang] = useState('en-US');
  const [autoPunct, setAutoPunct] = useState(true);

  // active format states for toolbar buttons
  const [activeBold, setActiveBold] = useState(false);
  const [activeItalic, setActiveItalic] = useState(false);
  const [activeUnderline, setActiveUnderline] = useState(false);
  const [activeAlign, setActiveAlign] = useState('left');

  /* ===== Sync from room (real-time) or fallback to local ===== */
  useEffect(() => {
    if (roomData && typeof roomData.sharedNotes === 'string') {
      setNotes(roomData.sharedNotes || "");
      const el = notesAreaRef.current;
      if (el && el.innerHTML !== (roomData.sharedNotes || "")) {
        el.innerHTML = roomData.sharedNotes || "";
      }
    } else {
      const local = localStorage.getItem("sr_notes") || "";
      setNotes(local);
    }
  }, [roomData]);
  
  // Persist locally as a fallback (non-room usage)
  useEffect(() => {
    if (!currentRoom) {
      localStorage.setItem("sr_notes", notes);
    }
  }, [notes, currentRoom]);

  useEffect(() => {
    localStorage.setItem("sr_files", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  // Remove shared files list (real-time) per request
  // const { roomFiles, addRoomFile, removeRoomFile } = useStudyRoom();

  /* ===== Sync editable area ===== */
  useEffect(() => {
    const el = notesAreaRef.current;
    if (el && el.innerHTML !== notes) el.innerHTML = notes;
  }, [notes]);

  /* ===== Auto-save debounce (to room if joined) ===== */
  useEffect(() => {
    const el = notesAreaRef.current;
    if (!el) return;

    let t = null;
    const onInput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const html = el.innerHTML;
        setNotes(html);
        if (currentRoom) {
          updateNotes(html);
          const name = user?.displayName || userProfile?.displayName || 'You';
          addNotification(`💾 Notes saved to room by ${name}`);
        } else {
          try { localStorage.setItem("sr_notes", html); } catch {}
          addNotification("💾 Notes auto-saved");
        }
      }, 1000);
    };

    const onSelection = () => {
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
    // enforce plain-text paste to avoid accidental markup/code in notes
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

    // initialize active states
    onSelection();

    return () => {
      el.removeEventListener("input", onInput);
      el.removeEventListener('paste', onPaste);
      document.removeEventListener('selectionchange', onSelection);
      el.removeEventListener('keyup', onSelection);
      el.removeEventListener('mouseup', onSelection);
      clearTimeout(t);
    };
  }, [currentRoom, updateNotes, user, userProfile, addNotification]);

  /* ===== Notify on external updates ===== */
  const lastNotesRef = useRef("");
  const lastUpdaterRef = useRef(null);
  useEffect(() => {
    const incoming = roomData?.sharedNotes ?? null;
    const updaterId = roomData?.notesUpdatedById || null;
    const updaterName = roomData?.notesUpdatedByName || 'Someone';
    if (currentRoom && typeof incoming === 'string') {
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
  }, [roomData, currentRoom, user]);

  /* ===== Voice list for TTS ===== */
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
  }, []);

  /* ===== Helpers ===== */
  const formatText = (cmd) => {
    const el = notesAreaRef.current;
    if (!el) return;
    el.focus();
    try {
      document.execCommand(cmd, false, null);
    } catch (e) {
      // ignore execCommand errors
    }
    setNotes(el.innerHTML);

    // refresh toolbar active state shortly after execCommand
    setTimeout(() => {
      try {
        if (document.queryCommandState) {
          setActiveBold(!!document.queryCommandState('bold'));
          setActiveItalic(!!document.queryCommandState('italic'));
          setActiveUnderline(!!document.queryCommandState('underline'));
          // update alignment states
          if (document.queryCommandState('justifyCenter')) setActiveAlign('center');
          else if (document.queryCommandState('justifyRight')) setActiveAlign('right');
          else setActiveAlign('left');
        }
      } catch (e) {
        // ignore
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

  /* ===== Dictation ===== */
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
        setNotes(el.innerHTML);
        finalTranscript = '';
      }
    };
    rec.onerror = () => addNotification("❌ Dictation error");
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    addNotification("🎤 Listening...");
  };

  const stopDictation = () => {
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setIsRecording(false);
    addNotification('⏹️ Stopped listening');
  };

  const postProcessTranscript = (text) => {
    let t = ' ' + text + ' ';
    // word-to-punctuation replacements
    t = t.replace(/\s(comma|,)(\s|$)/gi, ', ');
    t = t.replace(/\s(full stop|period|\.)(\s|$)/gi, '. ');
    t = t.replace(/\s(question mark|\?)(\s|$)/gi, '? ');
    t = t.replace(/\s(exclamation mark|!)(\s|$)/gi, '! ');
    t = t.replace(/\s(new line|line break)(\s|$)/gi, '\n');
    // cleanup extra spaces
    t = t.replace(/\s+([,\.!\?])/g, '$1 ');
    t = t.replace(/\s{2,}/g, ' ');
    t = t.trim();
    // sentence case basic
    t = t.replace(/(^\s*[a-z])|([\.\!\?]\s+[a-z])/g, (m) => m.toUpperCase());
    return t;
  };

  /* ===== TTS ===== */
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

  /* ===== File upload ===== */
  const handleFileUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const meta = {
      id: Date.now(),
      name: f.name,
      size: `${Math.round(f.size / 1024)} KB`,
      uploadedAt: new Date().toLocaleString(),
    };
    setUploadedFiles((s) => [meta, ...s]);
    addNotification("📎 File added");
  };

  const removeFile = (id) => {
    setUploadedFiles((s) => s.filter((x) => x.id !== id));
    addNotification("🗑️ File removed");
  };

  /* ===== Stats ===== */
  const getNotesStats = () => {
    const text = notesAreaRef.current?.innerText || (notes || "");
    const chars = text.length;
    const words = text.trim()
      ? text.trim().split(/\s+/).filter(Boolean).length
      : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { chars, words, minutes };
  };

  const saveLocalNotes = () => {
    try {
      if (currentRoom) {
        updateNotes(notes);
        addNotification("💾 Notes saved to room");
      } else {
        localStorage.setItem("sr_notes", notes);
        addNotification("💾 Notes saved");
      }
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
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl" style={{ height: 'calc(725px - 120px)' }}>
      {/* Top header with title and action buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>Notes</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={saveLocalNotes}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={downloadNotes}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-4 space-y-3 flex-shrink-0" style={{ userSelect: 'none' }}>
        {/* First row: B, I, U, and alignment buttons */}
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => formatText('bold')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeBold ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatText('italic')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeItalic ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatText('underline')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeUnderline ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <u>U</u>
          </button>

          {/* Alignment buttons */}
          <button 
            onClick={() => formatText('justifyLeft')} 
            className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'left' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => formatText('justifyCenter')} 
            className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'center' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => formatText('justifyRight')} 
            className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'right' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Second row: Speak, Listen, and stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={readNotesAloud}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              isSpeaking ? 'bg-red-600' : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isSpeaking ? 'Stop' : 'Speak'}
          </button>
          <select
            value={dictationLang}
            onChange={(e) => setDictationLang(e.target.value)}
            className="px-2 py-2 rounded-md bg-white/10 text-white outline-none"
            title="Dictation language"
          >
            <option className="bg-gray-900" value="en-US">English (US)</option>
            <option className="bg-gray-900" value="en-IN">English (India)</option>
            <option className="bg-gray-900" value="en-GB">English (UK)</option>
            <option className="bg-gray-900" value="hi-IN">Hindi (India)</option>
            <option className="bg-gray-900" value="en-CA">English (Canada)</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked={autoPunct} onChange={(e) => setAutoPunct(e.target.checked)} />
            Auto punctuation
          </label>
          <button
            onClick={startDictation}
            disabled={isRecording}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              isRecording
                ? 'bg-red-600 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Listening...' : 'Dictate'}
          </button>
          <div className="text-sm text-white/70">
            {chars} chars • {words} words • {minutes} min read
          </div>
        </div>
      </div>

      {/* Editable area - flex-1 makes it take remaining space */}
      {/* Pasting is sanitized to plain text in the effect below */}
      <div
        ref={notesAreaRef}
        contentEditable
        suppressContentEditableWarning
        className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-lg leading-relaxed outline-none overflow-y-auto focus:ring-2 focus:ring-emerald-500/50 mb-4"
      />

      {/* Upload notes block (local only, shared list removed) - flex-shrink-0 prevents it from shrinking */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <UploadCloud className="w-5 h-5 text-white/70" />
          <span className="text-sm font-semibold text-white/70">📥 Upload Notes</span>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer transition text-sm"
          >
            Choose File
          </label>
          <div className="text-gray-300">{uploadedFiles.length ? `${uploadedFiles[0].name}` : 'No file chosen'}</div>
          <div className="ml-auto text-xs text-gray-300">Local only</div>
        </div>
        <div className="mt-3 max-h-40 overflow-auto space-y-2">
          {uploadedFiles.map((f) => (
            <div key={f.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
              <div className="text-sm text-white">{f.name} <span className="text-xs text-gray-400">• {f.size}</span></div>
              <button onClick={() => removeFile(f.id)} className="text-red-400 text-xs">Remove</button>
            </div>
          ))}
        </div>
          <span className="text-sm text-white/60">
            {uploadedFiles.length ? `${uploadedFiles[0].name}` : 'No file chosen'}
          </span>
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
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default Notes;
