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
    <section className="relative rounded-2xl p-6 shadow-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-lg text-white overflow-hidden">
      {/* Top header with title and action buttons */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center text-white text-2xl">✍️</div>
          <div>
            <div className="text-2xl font-semibold">Notes</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button onClick={saveLocalNotes} className="px-3 py-2 bg-emerald-500 rounded-md text-white flex items-center gap-2">
            <Save size={14} /> Save
          </button>
          <button onClick={downloadNotes} className="px-3 py-2 bg-white/10 rounded-md text-white flex items-center gap-2">
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-3">
        {/* First row: B, I, U, and alignment buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <button
              onClick={() => formatText('bold')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeBold ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
            >
              B
            </button>
            <button
              onClick={() => formatText('italic')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeItalic ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
            >
              I
            </button>
            <button
              onClick={() => formatText('underline')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeUnderline ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}
            >
              U
            </button>
            
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button onClick={() => setAlignment('left')} className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'left' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}><AlignLeft size={14} /></button>
            <button onClick={() => setAlignment('center')} className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'center' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}><AlignCenter size={14} /></button>
            <button onClick={() => setAlignment('right')} className={`w-9 h-9 rounded-md flex items-center justify-center transition ${activeAlign === 'right' ? 'bg-emerald-500 text-white' : 'bg-white/6 text-white'}`}><AlignRight size={14} /></button>
          </div>
        </div>

        {/* Second row: Speak, Listen, and stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={startDictation}
            aria-label="Speak"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition">
            <Mic size={16} />
            <span className="select-none">Speak</span>
          </button>
          <button
            onClick={readNotesAloud}
            aria-label="Listen"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition">
            <Volume2 size={16} />
            <span className="select-none">Listen</span>
          </button>
          <div className="text-xs text-gray-300 ml-auto">{chars} chars • {words} words • {minutes} min read</div>
        </div>
      </div>

      {/* Editable area */}
      <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 min-h-[8rem] mb-4">
        <div
          id="notesArea"
          ref={notesAreaRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          placeholder="Write your notes..."
          className="w-full min-h-[6rem] text-white resize-none outline-none"
          dangerouslySetInnerHTML={{ __html: notes }}
        />
      </div>

      {/* Upload notes block */}
      <div className="mt-2 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-semibold flex items-center gap-2">📥 Upload Notes</div>
        </div>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded-md inline-flex items-center gap-3">
            <UploadCloud size={16} /> Choose File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <div className="text-gray-300">{uploadedFiles.length ? `${uploadedFiles[0].name}` : 'No file chosen'}</div>
          <div className="ml-auto">
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-md">Upload</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notes;
