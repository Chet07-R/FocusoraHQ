import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "80vh",
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
      <div style={{ maxWidth: "500px" }}>
        <h1 style={{ fontSize: "6rem", fontWeight: "800", color: "#3b82f6", margin: "0 0 1rem 0" }}>404</h1>
        <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: "1.6" }}>
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            background: "#3b82f6",
            color: "#ffffff",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.4)"
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
