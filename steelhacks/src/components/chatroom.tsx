"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

function getSessionIdFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)sessionId=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getUsernameFromSession(): string {
  const sessionId = getSessionIdFromCookie();
  if (!sessionId) return "Unknown";
  const username = localStorage.getItem("username");
  return username || "Unknown";
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // get username + lobby on mount
  useEffect(() => {
    setUsername(getUsernameFromSession());
    const activeLobby = localStorage.getItem("activeLobby");
    if (activeLobby) {
      setRoom(activeLobby);
    }
  }, []);

  // poll messages
  useEffect(() => {
    if (!room) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?room=${encodeURIComponent(room)}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "" || !room) return;
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: username,
          text: input,
          timestamp: Date.now(),
          room,
        }),
      });
      setInput("");
    } catch {}
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && room) {
      setMessages([
        ...messages,
        { sender: username, text: trimmed, timestamp: Date.now() },
      ]);
    }
    setInput("");
  };

  if (!room) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "0 auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
          color: "#fff",
          background: "#232526",
        }}
      >
        <h2>No lobby active</h2>
        <p>Join a lobby to access chat.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        color: "#f5f5f5",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: "flex-start",
              background: "rgba(60, 60, 80, 0.85)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              maxWidth: "80%",
              fontSize: "1rem",
              border: "1px solid #6c63ff",
            }}
          >
            {msg.sender}: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #6c63ff",
            backgroundColor: "#232526",
            color: "#f5f5f5",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;