import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./ChatWidget.css";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hi! I am your Focusora AI assistant. Ask me to plan a session, summarize notes, or craft a focus routine.",
};
const MaximizeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path
      d="M8 3H3V8M16 21H21V16M3 3L10 10M21 21L14 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path
      d="M21 3L14 10M3 21L10 14M15 3H21V9M3 15V21H9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const buildChatHistory = (messages, maxPairs = 6) => {
  const history = messages
    .filter((msg) => msg?.role && msg?.content)
    .map((msg) => ({ role: msg.role, content: msg.content }));

  return history.slice(Math.max(0, history.length - maxPairs * 2));
};

const GUEST_TRIAL_DURATION_MS = 10 * 60 * 1000;
const GUEST_TRIAL_MESSAGE_LIMIT = 6;
const GUEST_TRIAL_STARTED_KEY = "focusora_ai_trial_started_at";
const GUEST_TRIAL_COUNT_KEY = "focusora_ai_trial_message_count";

const getStoredNumber = (key) => {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(key);
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
};

const setStoredNumber = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(value));
};

const trimText = (value, limit = 800) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const getActiveNotesContext = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const pathname = String(window.location?.pathname || '/');
  const notesEditor = document.querySelector('[data-focusora-notes-editor="true"]');
  const activeElement = document.activeElement;
  const selection = window.getSelection?.();

  const editorText = notesEditor
    ? trimText(notesEditor.innerText || notesEditor.textContent || '')
    : '';

  const selectedText =
    selection && selection.rangeCount > 0 && notesEditor && notesEditor.contains(selection.anchorNode)
      ? trimText(selection.toString(), 240)
      : '';

  const context = {
    page: pathname,
    activeTask: notesEditor ? 'editing notes' : 'general browsing',
  };

  if (notesEditor) {
    context.workspace = 'notes editor';
    context.notesPreview = editorText;
    context.selection = selectedText;
    context.isEditingNotes = activeElement === notesEditor || notesEditor.contains(activeElement);
  }

  try {
    const rawFiles = localStorage.getItem('sr_files');
    if (rawFiles) {
      const files = JSON.parse(rawFiles);
      if (Array.isArray(files) && files.length) {
        context.uploadedFiles = files.slice(0, 3).map((file) => ({
          name: file?.name,
          type: file?.type,
        }));
      }
    }
  } catch {
    // Ignore storage parsing errors and continue with the available context.
  }

  return context;
};

const INLINE_PATTERNS = [
  { type: "code", regex: /`([^`]+)`/g },
  { type: "bold", regex: /\*\*([^*\n]+)\*\*/g },
  { type: "bold", regex: /__([^_\n]+)__/g },
  { type: "italic", regex: /\*([^*\n]+)\*/g },
  { type: "italic", regex: /_([^_\n]+)_/g },
  { type: "link", regex: /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g },
];

const renderInlineText = (text) => {
  const segments = [{ text, type: "text" }];

  INLINE_PATTERNS.forEach(({ type, regex }) => {
    const nextSegments = [];

    segments.forEach((segment) => {
      if (segment.type !== "text") {
        nextSegments.push(segment);
        return;
      }

      const source = segment.text;
      let lastIndex = 0;
      regex.lastIndex = 0;
      let match = regex.exec(source);

      if (!match) {
        nextSegments.push(segment);
        return;
      }

      while (match) {
        if (match.index > lastIndex) {
          nextSegments.push({ type: "text", text: source.slice(lastIndex, match.index) });
        }

        const value = match[1];

        if (type === "link") {
          nextSegments.push({ type, text: value, href: match[2] });
        } else {
          nextSegments.push({ type, text: value });
        }

        lastIndex = regex.lastIndex;
        match = regex.exec(source);
      }

      if (lastIndex < source.length) {
        nextSegments.push({ type: "text", text: source.slice(lastIndex) });
      }
    });

    segments.splice(0, segments.length, ...nextSegments);
  });

  return segments.map((segment, index) => {
    if (segment.type === "bold") {
      return <strong key={`bold-${index}`}>{segment.text}</strong>;
    }

    if (segment.type === "italic") {
      return <em key={`italic-${index}`}>{segment.text}</em>;
    }

    if (segment.type === "code") {
      return <code key={`code-${index}`}>{segment.text}</code>;
    }

    if (segment.type === "link") {
      return (
        <a key={`link-${index}`} href={segment.href} target="_blank" rel="noreferrer">
          {segment.text}
        </a>
      );
    }

    return <React.Fragment key={`text-${index}`}>{segment.text}</React.Fragment>;
  });
};

const renderFormattedMessage = (content) => {
  const lines = String(content || "").split(/\n/);

  return lines.flatMap((line, lineIndex) => {
    const nodes = renderInlineText(line);

    if (lineIndex === lines.length - 1) {
      return nodes;
    }

    return [...nodes, <br key={`br-${lineIndex}`} />];
  });
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [mounted, setMounted] = useState(false);
  const endRef = useRef(null);
  const isLoggedIn = Boolean(user);
  const isGuestAccount = user?.provider === "guest";

  const getGuestTrialState = () => {
    if (typeof window === "undefined") {
      return { startedAt: 0, usedCount: 0, expired: false, exhausted: false };
    }

    const startedAt = getStoredNumber(GUEST_TRIAL_STARTED_KEY);
    const usedCount = getStoredNumber(GUEST_TRIAL_COUNT_KEY);
    const now = Date.now();
    const actualStart = startedAt || now;
    const expired = now - actualStart >= GUEST_TRIAL_DURATION_MS;
    const exhausted = usedCount >= GUEST_TRIAL_MESSAGE_LIMIT;

    return { startedAt: actualStart, usedCount, expired, exhausted };
  };

  const ensureGuestTrialStarted = () => {
    if (typeof window === "undefined") return;
    if (!getStoredNumber(GUEST_TRIAL_STARTED_KEY)) {
      setStoredNumber(GUEST_TRIAL_STARTED_KEY, Date.now());
    }
  };

  const recordGuestTrialUse = () => {
    if (typeof window === "undefined") return;
    ensureGuestTrialStarted();
    const nextCount = getStoredNumber(GUEST_TRIAL_COUNT_KEY) + 1;
    setStoredNumber(GUEST_TRIAL_COUNT_KEY, nextCount);
  };

  const clearGuestTrialState = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(GUEST_TRIAL_STARTED_KEY);
    window.localStorage.removeItem(GUEST_TRIAL_COUNT_KEY);
  };

  useEffect(() => {
    if (isLoggedIn && !isGuestAccount) {
      clearGuestTrialState();
    }
  }, [isLoggedIn, isGuestAccount]);

  useEffect(() => {
    const handleOpenBot = () => {
      setIsOpen(true);
    };
    window.addEventListener("openFocusoraBot", handleOpenBot);
    return () => window.removeEventListener("openFocusoraBot", handleOpenBot);
  }, []);

  const promptLogin = () => {
    setStatus({ loading: false, error: "Your free AI trial ended. Sign in to continue with full access." });
    navigate("/signin");
  };

  const promptGuestStart = () => {
    setStatus({ loading: false, error: "Please sign in to start a short AI trial." });
    navigate("/signin");
  };

  const bubbleLabel = useMemo(() => (msg) => (msg.role === "user" ? "You" : "Focusora AI"), []);

  const sendMessage = async (rawMessage) => {
    const message = String(rawMessage || "").trim();
    if (!message || status.loading) return;

    if (!isLoggedIn) {
      const trialState = getGuestTrialState();
      if (trialState.expired || trialState.exhausted) {
        promptLogin();
        return;
      }
      ensureGuestTrialStarted();
    }

    if (isGuestAccount) {
      const trialState = getGuestTrialState();
      if (trialState.expired || trialState.exhausted) {
        promptLogin();
        return;
      }
    }

    setStatus({ loading: true, error: "" });

    const nextUserMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");

    try {
      const history = buildChatHistory([...messages, nextUserMessage]);
      const response = await api.post("/ai/chat", {
        message,
        history,
        context: getActiveNotesContext(),
      });

      const reply = response?.data?.reply || "I did not get a response. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (!isLoggedIn || isGuestAccount) {
        recordGuestTrialUse();
      }
      setStatus({ loading: false, error: "" });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        "AI is unavailable right now. Please try again.";

      setStatus({ loading: false, error: backendMessage });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !endRef.current) return;
    endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={`cw-shell ${isOpen ? "cw-shell--open" : ""}`}
      style={{ position: "fixed", inset: 0, padding: 16 }}
    >
      <button
        type="button"
        className={`cw-fab ${isOpen ? "cw-fab--open" : ""}`}
        style={{ position: "fixed", right: "24px", left: "auto", bottom: "20px", top: "auto", zIndex: 10000 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="focusora-chat"
      >
        <span className="cw-fab__pulse" aria-hidden="true" />
        <img
          className="cw-fab__image"
          src="/images/chatbot.png"
          alt=""
          aria-hidden="true"
        />
        <span className="cw-fab__sr">Focusora AI assistant</span>
      </button>

      <section
        id="focusora-chat"
        className={`cw-panel ${isExpanded ? "cw-panel--expanded" : ""}`}
        role="dialog"
        aria-label="Focusora AI assistant"
      >
        <header className="cw-panel__header">
          <div>
            <div className="cw-panel__title">Focusora AI</div>
          </div>
          <div className="cw-panel__actions">
            <button
              type="button"
              className="cw-panel__icon-button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? "Shrink assistant" : "Expand assistant"}
            >
              {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
            <button
              type="button"
              className="cw-panel__icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="cw-panel__log" role="log" aria-live="polite">
          {!isLoggedIn ? (
            <div className="cw-panel__notice">
              Free trial: {GUEST_TRIAL_MESSAGE_LIMIT} messages or 10 minutes. Sign in for full access.
            </div>
          ) : isGuestAccount ? (
            <div className="cw-panel__notice">
              Guest mode: limited AI trial. Sign in with your account for full access.
            </div>
          ) : null}
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`cw-bubble cw-bubble--${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div className="cw-bubble__role">{bubbleLabel(msg)}</div>
              <div className="cw-bubble__text">{renderFormattedMessage(msg.content)}</div>
            </div>
          ))}
          {status.loading ? (
            <div className="cw-bubble cw-bubble--assistant">
              <div className="cw-bubble__role">Focusora AI</div>
              <div className="cw-bubble__text">Thinking...</div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {status.error ? <div className="cw-panel__error">{status.error}</div> : null}

        <form
          className="cw-panel__composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            type="text"
            className="cw-panel__input"
            placeholder="Ask for a study plan, summary, or focus tip..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={status.loading}
          />
          <button
            type="submit"
            className="cw-panel__send"
            disabled={status.loading || !input.trim()}
          >
            Send
          </button>
        </form>
        {!isLoggedIn ? (
          <div className="cw-panel__footer-cta">
            <button type="button" className="cw-panel__login" onClick={promptGuestStart}>
              Sign in for full access
            </button>
          </div>
        ) : null}
      </section>
    </div>,
    document.body
  );
};

export default ChatWidget;
