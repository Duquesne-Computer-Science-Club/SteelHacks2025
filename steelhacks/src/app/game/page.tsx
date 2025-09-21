"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chatroom from "@/components/chatroom";
import Chomp from "@/components/chomp";

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

  // Fetch the latest lobby info periodically
  useEffect(() => {
    if (!lobby) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/lobbies");
        if (!res.ok) return;

        const data = await res.json();
        const updatedLobby = data.lobbies.find((l: Lobby) => l.id === lobby.id);

        if (!updatedLobby) {
          // Lobby no longer exists → remove local storage and redirect
          localStorage.removeItem("activeLobby");
          router.replace("/lobby");
        } else {
          setLobby(updatedLobby); // update players count
        }
      } catch (err) {
        console.error("Failed to refresh lobby:", err);
      }
    }, 2000); // refresh every 2 seconds

    return () => clearInterval(interval);
  }, [lobby, router]);

  // Leave lobby → notify backend + clear localStorage + redirect
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

  if (!lobby) return null;

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
        position: "relative",
      }}
    >
      {/* Left side: Game */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: "20px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Lobby: {lobby.name} ({lobby.players} players)
        </h2>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Chomp />
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

      {/* Leave Lobby button bottom-right */}
      <button
        onClick={handleLeaveLobby}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 18px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#e53935",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        Leave Lobby
      </button>
    </div>
  );
}