import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: "500px",
            background: "#1e293b",
            padding: "2.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155"
          }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#f43f5e" }}>Something went wrong</h1>
            <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: "1.6" }}>
              FocusoraHQ encountered an unexpected error. Please try reloading the page or returning home.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Reload Page
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #475569",
                  background: "transparent",
                  color: "#f8fafc",
                  fontWeight: "600",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
