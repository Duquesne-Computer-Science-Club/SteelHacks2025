"use client";
import Chatroom from "@/components/chatroom";
import PVE from "@/components/pve";
import PVP from "@/components/pvp";
import React, { useState } from "react";

export default function GamePage() {
  const [mode, setMode] = useState<"pve" | "pvp">("pve");
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
          flex: mode === "pve" ? 1 : 2, // expand when PVE selected
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "2px solid #444",
          paddingRight: "20px",
        }}
      >
        {/* mode toggle */}
        <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode("pve")}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: mode === "pve" ? "2px solid #8fb3ff" : "1px solid #444",
              background: mode === "pve" ? "#1f2937" : "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Player vs Env
          </button>
          <button
            onClick={() => setMode("pvp")}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: mode === "pvp" ? "2px solid #8fb3ff" : "1px solid #444",
              background: mode === "pvp" ? "#1f2937" : "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Player vs Player
          </button>
        </div>

        {/* Render selected game component */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {mode === "pve" ? <PVE /> : <PVP />}
        </div>
        {/* Removed Main Page button */}
      </div>

      {/* Right side: Chatroom (render only for PVP) */}
      {mode === "pvp" && (
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
      )}
    </div>
  );
}