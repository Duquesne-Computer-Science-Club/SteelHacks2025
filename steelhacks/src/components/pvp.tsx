"use client";

import React, { useEffect, useState } from "react";

type ChompState = {
  board: number[][];
  currentPlayer: 1 | 2;
  gameOver: boolean;
  gameMessage: string;
};

type Move = { row: number; col: number } | null;

const POLL_INTERVAL = 1500; // ms

export default function PVP() {
  const lobbyId = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("activeLobby") || "{}")?.id
    : null;

  const [state, setState] = useState<ChompState | null>(null);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Fetch current game state
  const fetchState = async () => {
    if (!lobbyId) return;
    try {
      const res = await fetch(`/api/chomp?lobbyId=${lobbyId}`);
      if (!res.ok) throw new Error("Failed to fetch game");
      const data: ChompState = await res.json();
      setState(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply move
  const makeMove = async (row: number, col: number) => {
    if (!lobbyId || !state || state.gameOver) return;
    try {
      const res = await fetch("/api/chomp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lobbyId, move: { row, col } }),
      });
      if (!res.ok) throw new Error("Move failed");
      const data: ChompState = await res.json();
      setState(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Start new game
  const newGame = async () => {
    if (!lobbyId) return;
    try {
      const res = await fetch("/api/chomp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lobbyId, move: null }),
      });
      if (!res.ok) throw new Error("Failed to start new game");
      const data: ChompState = await res.json();
      setState(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Poll server every POLL_INTERVAL
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [lobbyId]);

  if (!state) return <p>Loading game...</p>;

  const rows = state.board.length - 1;
  const cols = state.board[1].length - 1;

  const cellStyle = (present: boolean, isPoison: boolean) => ({
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #444",
    background: present ? (isPoison ? "rgba(153,79,0,1)" : "rgba(225,190,106,1)") : "#ddd",
    color: isPoison ? "white" : "black",
    fontWeight: isPoison ? 700 : 400,
    cursor: present && !state.gameOver ? "pointer" : "default",
    userSelect: "none",
  } as React.CSSProperties);

  const onButtonPressStart = () => setButtonPressed(true);
  const onButtonPressEnd = () => setButtonPressed(false);

  const newGameButtonStyle: React.CSSProperties = {
    padding: "8px 14px",
    border: "2px solid #8fb3ff",
    borderRadius: 8,
    background: buttonPressed ? "#2b6be0" : "#1f2937",
    color: buttonPressed ? "#fff" : "#dbeafe",
    cursor: "pointer",
    transition: "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
    boxShadow: buttonPressed ? "inset 0 2px 6px rgba(0,0,0,0.4)" : "0 4px 10px rgba(16,24,40,0.4)",
    transform: buttonPressed ? "scale(0.98)" : "scale(1)",
    marginTop: 8,
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 12 }}>
      <h1>CHOMP — Player vs Player</h1>
      <p>Players alternate chomps. Bottom-left square is poisoned — avoid it.</p>

      <div style={{ display: "inline-block", border: "2px solid #222", padding: 6 }}>
        {Array.from({ length: rows }, (_, i) => rows - i).map((r) => (
          <div key={r} style={{ display: "flex" }}>
            {Array.from({ length: cols }, (_, idx) => {
              const col = idx + 1;
              const present = state.board[r]?.[col] === 1;
              const isPoison = r === 1 && col === 1;
              return (
                <div
                  key={`${r}-${col}`}
                  style={cellStyle(present, isPoison)}
                  onClick={() => present && !state.gameOver && makeMove(r, col)}
                  title={isPoison ? "Poison" : present ? "Chocolate" : "Removed"}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={newGame}
          onMouseDown={onButtonPressStart}
          onMouseUp={onButtonPressEnd}
          onMouseLeave={onButtonPressEnd}
          onTouchStart={onButtonPressStart}
          onTouchEnd={onButtonPressEnd}
          style={newGameButtonStyle}
          aria-pressed={buttonPressed}
        >
          New Game
        </button>

        {state.gameOver && (
          <div style={{ marginTop: 8, color: "#ffddcc", fontWeight: 700 }}>{state.gameMessage}</div>
        )}

        <div style={{ marginTop: 8, color: "#ccc" }}>
          Current: Player {state.currentPlayer} · Board: {rows} rows × {cols} cols
        </div>
      </div>
    </div>
  );
}