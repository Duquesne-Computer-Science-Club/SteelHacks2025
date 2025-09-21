"use client";
import Chatroom from "@/components/chatroom";
import PVP from "@/components/pvp";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lobby = {
  id: string;
  name: string;
  players: number;
};

export default function GamePage() {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const router = useRouter();

  // Load active lobby from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("activeLobby");
    if (stored) {
      setLobby(JSON.parse(stored));
    } else {
      router.replace("/lobby");
    }
  }, [router]);

  // Leave lobby button pressed state
  const [leavePressed, setLeavePressed] = useState(false);
  const onLeavePressStart = () => setLeavePressed(true);
  const onLeavePressEnd = () => setLeavePressed(false);

  // Handle leaving the lobby
  const handleLeaveLobby = async () => {
    if (!lobby) {
      router.replace("/lobby");
      return;
    }

    try {
      const res = await fetch(`/api/lobbies?id=${lobby.id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn(`Lobby ${lobby.id} could not be left. Status: ${res.status}`);
      }
    } catch (err) {
      console.error("Error leaving lobby:", err);
    } finally {
      localStorage.removeItem("activeLobby");
      router.replace("/lobby");
    }
  };

  const leaveButtonStyle: React.CSSProperties = {
    padding: "8px 14px",
    border: "2px solid #ff7b7b",
    borderRadius: 8,
    background: leavePressed ? "#e02b2b" : "#1f2937",
    color: leavePressed ? "#fff" : "#ffe5e5",
    cursor: "pointer",
    transition:
      "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
    boxShadow: leavePressed
      ? "inset 0 2px 6px rgba(0,0,0,0.4)"
      : "0 4px 10px rgba(16,24,40,0.4)",
    transform: leavePressed ? "scale(0.98)" : "scale(1)",
    position: "fixed", // ✅ stays visible even if page scrolls
    bottom: "20px",
    left: "20px",
    zIndex: 1000,
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
      {/* Left side: Game */}
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <PVP />
          </div>
        </div>
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

      {/* Leave Lobby Button - Bottom Left */}
      <button
        onClick={handleLeaveLobby}
        onMouseDown={onLeavePressStart}
        onMouseUp={onLeavePressEnd}
        onMouseLeave={onLeavePressEnd}
        onTouchStart={onLeavePressStart}
        onTouchEnd={onLeavePressEnd}
        style={leaveButtonStyle}
        aria-pressed={leavePressed}
      >
        Leave Lobby
      </button>
    </div>
  );
}