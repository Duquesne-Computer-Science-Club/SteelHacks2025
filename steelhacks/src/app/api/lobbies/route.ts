import { NextResponse } from "next/server";

type Lobby = {
  id: string;
  name: string;
  players: number;
};

let lobbies: Lobby[] = [];

// ✅ Get all active lobbies
export async function GET() {
  lobbies = lobbies.filter((l) => l.players > 0); // cleanup empty lobbies
  return NextResponse.json({ lobbies });
}

// ✅ Create new lobby
export async function POST(req: Request) {
  const { name } = await req.json();

  const newLobby: Lobby = {
    id: crypto.randomUUID(),
    name,
    players: 1, // creator is the first player
  };

  lobbies.push(newLobby);

  return NextResponse.json({ lobby: newLobby }, { status: 201 });
}

// ✅ Join lobby
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const lobby = lobbies.find((l) => l.id === id);
  if (!lobby) {
    return NextResponse.json({ error: "Lobby not found" }, { status: 404 });
  }

  // ✅ Only allow join if less than 2 players
  if (lobby.players >= 2) {
    return NextResponse.json({ error: "Lobby is full" }, { status: 400 });
  }

  lobby.players += 1;
  return NextResponse.json({ lobby });
}

// ✅ Leave lobby
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const lobby = lobbies.find((l) => l.id === id);
  if (!lobby) {
    return NextResponse.json({ error: "Lobby not found" }, { status: 404 });
  }

  // 🔒 Decrement but not below 0
  lobby.players = Math.max(0, lobby.players - 1);

  // 🧹 Remove if empty
  if (lobby.players === 0) {
    lobbies = lobbies.filter((l) => l.id !== id);
    return NextResponse.json({ success: true, removed: true });
  }

  return NextResponse.json({ success: true, lobby });
}