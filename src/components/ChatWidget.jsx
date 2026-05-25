import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api";
import "./ChatWidget.css";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hi! I am your Focusora AI assistant. Ask me to plan a session, summarize notes, or craft a focus routine.",
};
const MaximizeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <path
      d="M8 3H3V8M16 21H21V16M3 3L10 10M21 21L14 14"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <path
      d="M21 3L14 10M3 21L10 14M15 3H21V9M3 15V21H9"
      stroke="white"
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

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [mounted, setMounted] = useState(false);
  const endRef = useRef(null);

  const bubbleLabel = useMemo(() => (msg) => (msg.role === "user" ? "You" : "Focusora AI"), []);

  const sendMessage = async (rawMessage) => {
    const message = String(rawMessage || "").trim();
    if (!message || status.loading) return;

    setStatus({ loading: true, error: "" });

    const nextUserMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");

    try {
      const history = buildChatHistory([...messages, nextUserMessage]);
      const response = await api.post("/ai/chat", {
        message,
        history,
      });

      const reply = response?.data?.reply || "I did not get a response. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setStatus({ loading: false, error: "" });
    } catch (error) {
      setStatus({ loading: false, error: "AI is unavailable right now. Please try again." });
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
        style={{ position: "fixed", right: 12, bottom: 12, top: "auto", left: "auto", zIndex: 10000 }}
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
  className="cw-panel__expand"
  onClick={() => setIsExpanded((prev) => !prev)}
  aria-label={isExpanded ? "Shrink assistant" : "Expand assistant"}
>
  {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
</button>
            <button
              type="button"
              className="cw-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>
        </header>

        <div className="cw-panel__log" role="log" aria-live="polite">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`cw-bubble cw-bubble--${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div className="cw-bubble__role">{bubbleLabel(msg)}</div>
              <div className="cw-bubble__text">{msg.content}</div>
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
      </section>
    </div>,
    document.body
  );
};

export default ChatWidget;
