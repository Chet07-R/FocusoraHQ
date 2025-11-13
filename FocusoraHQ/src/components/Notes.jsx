import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, Download, Mic, Save, Volume2, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const Notes = ({ addNotification = () => {} }) => {
  const [notes, setNotes] = useState(() => localStorage.getItem("sr_notes") || "");
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

  // active format states for toolbar buttons
  const [activeBold, setActiveBold] = useState(false);
  const [activeItalic, setActiveItalic] = useState(false);
  const [activeUnderline, setActiveUnderline] = useState(false);
  const [activeAlign, setActiveAlign] = useState('left');

  /* ===== Auto-persist ===== */
  useEffect(() => {
    localStorage.setItem("sr_notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("sr_files", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  /* ===== Sync editable area ===== */
  useEffect(() => {
    const el = notesAreaRef.current;
    if (el && el.innerHTML !== notes) el.innerHTML = notes;
  }, [notes]);

  /* ===== Auto-save debounce ===== */
  useEffect(() => {
    const el = notesAreaRef.current;
    if (!el) return;

    let t = null;
    const onInput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const html = el.innerHTML;
        setNotes(html);
        addNotification("💾 Notes auto-saved");
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
    document.addEventListener('selectionchange', onSelection);
    el.addEventListener('keyup', onSelection);
    el.addEventListener('mouseup', onSelection);

    // initialize active states
    onSelection();

    return () => {
      el.removeEventListener("input", onInput);
      document.removeEventListener('selectionchange', onSelection);
      el.removeEventListener('keyup', onSelection);
      el.removeEventListener('mouseup', onSelection);
      clearTimeout(t);
    };
  }, []);

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
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (ev) => {
      const transcript =
        ev.results[ev.results.length - 1][0].transcript.trim();
      const el = notesAreaRef.current;
      if (!el) return;
      el.innerText = `${el.innerText.trim()} ${transcript}`.trim();
      setNotes(el.innerHTML);
      addNotification("✅ Dictation added");
    };
    rec.onerror = () => addNotification("❌ Dictation error");
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    addNotification("🎤 Listening...");
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
    addNotification("📎 File uploaded");
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
      localStorage.setItem("sr_notes", notes);
      addNotification("💾 Notes saved");
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
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-4 space-y-3 flex-shrink-0">
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
      <div
        ref={notesAreaRef}
        contentEditable
        suppressContentEditableWarning
        className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-lg leading-relaxed outline-none overflow-y-auto focus:ring-2 focus:ring-emerald-500/50 mb-4"
      />

      {/* Upload notes block - flex-shrink-0 prevents it from shrinking */}
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
    </div>
  );
};

export default Notes;
