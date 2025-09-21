"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Lobby = {
  id: string;
  name: string;
  players: number;
};

export default function LobbiesPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const router = useRouter();

  // ✅ If user is already in a game, redirect them
  useEffect(() => {
    const stored = localStorage.getItem("activeLobby");
    if (stored) {
      router.replace("/game"); // skip lobby list
    }
  }, [router]);

  // Load lobbies
  useEffect(() => {
    fetch("/api/lobbies")
      .then((res) => res.json())
      .then((data) => setLobbies(data.lobbies))
      .catch((err) => console.error("Failed to load lobbies:", err));
  }, []);

  // ✅ Create lobby → save + redirect
  const handleCreateLobby = async () => {
    if (!newLobbyName.trim()) return;

    try {
      const res = await fetch("/api/lobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLobbyName }),
      });

      if (!res.ok) throw new Error("Failed to create lobby");

      const { lobby } = await res.json();

      setLobbies((prev) => [...prev, lobby]);
      setNewLobbyName("");

      localStorage.setItem("activeLobby", JSON.stringify(lobby));
      router.push("/game");
    } catch (err) {
      console.error(err);
      alert("Error creating lobby");
    }
  };

  // ✅ Join lobby → save + redirect
  const handleJoinLobby = async (id: string) => {
    try {
      const res = await fetch(`/api/lobbies?id=${id}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Failed to join lobby");

      const { lobby } = await res.json();

      setLobbies((prev) =>
        prev.map((l) => (l.id === lobby.id ? lobby : l))
      );

      localStorage.setItem("activeLobby", JSON.stringify(lobby));
      router.push("/game");
    } catch (err) {
      console.error(err);
      alert("Error joining lobby");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lobbies</h1>

      {/* Create lobby form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Lobby name"
          value={newLobbyName}
          onChange={(e) => setNewLobbyName(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleCreateLobby}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Lobby list */}
      {lobbies.length === 0 ? (
        <p className="text-gray-500">No lobbies yet. Create one!</p>
      ) : (
        <ul className="space-y-3">
  {lobbies.map((lobby) => (
    <li
      key={lobby.id}
      className="flex justify-between items-center border p-3 rounded"
    >
      <div>
        <p className="font-medium">{lobby.name}</p>
        <p className="text-sm text-gray-500">
          {lobby.players} players
        </p>
      </div>
      <button
        onClick={() => handleJoinLobby(lobby.id)}
        disabled={lobby.players >= 2} // ✅ disable if full
        className={`px-3 py-1 rounded text-white ${
          lobby.players >= 2
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600"
        }`}
      >
        {lobby.players >= 2 ? "Full" : "Join"}
      </button>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}