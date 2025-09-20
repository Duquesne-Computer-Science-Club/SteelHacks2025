"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Not used for auth, just for UI

  const handleLogin = () => {
    // Generate a random session id
    const sessionId =
      Math.random().toString(36).substring(2) +
      Date.now().toString(36);
    // Store username and session flag in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("sessionActive", "true");
    localStorage.setItem("sessionId", sessionId);
    // Set session id cookie
    document.cookie = `sessionId=${sessionId}; path=/;`;
    window.location.href = "/pvp";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "6rem", marginBottom: "20px" }}>🎮</div>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Login to play!</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "300px",
          margin: "0 auto",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            fontSize: "1rem",
            backgroundColor: "#333",
            color: "#fff",
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            fontSize: "1rem",
            backgroundColor: "#333",
            color: "#fff",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: "#8B4513",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#A0522D";
            (e.target as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#8B4513";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}