"use client";
import Chatroom from "@/components/chatroom";
import PVP from "@/components/pvp"; // use player-vs-player component
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const [mainPressed, setMainPressed] = useState(false);
  const onMainPressStart = () => setMainPressed(true);
  const onMainPressEnd = () => setMainPressed(false);
  const mainButtonStyle: React.CSSProperties = {
    padding: "8px 14px",
    border: "2px solid #8fb3ff",
    borderRadius: 8,
    background: mainPressed ? "#2b6be0" : "#1f2937",
    color: mainPressed ? "#fff" : "#dbeafe",
    cursor: "pointer",
    transition: "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
    boxShadow: mainPressed ? "inset 0 2px 6px rgba(0,0,0,0.4)" : "0 4px 10px rgba(16,24,40,0.4)",
    transform: mainPressed ? "scale(0.98)" : "scale(1)",
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Left side: Game placeholder */}
      <div
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "2px solid #444",
          paddingRight: "20px",
        }}
      >
        {/* Render Chomp game here instead of placeholder */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <PVP />
          </div>
          <button
            onClick={() => router.push("/")}
            onMouseDown={onMainPressStart}
            onMouseUp={onMainPressEnd}
            onMouseLeave={onMainPressEnd}
            onTouchStart={onMainPressStart}
            onTouchEnd={onMainPressEnd}
            style={mainButtonStyle}
            aria-pressed={mainPressed}
          >
            Main Page
          </button>
        </div>
        {/* Removed Main Page button */}
      </div>
      {/* Right side: Chatroom */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "20px",
        }}
      >
        <Chatroom />
      </div>
    </div>
  );
}