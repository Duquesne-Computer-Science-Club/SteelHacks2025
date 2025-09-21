import { NextResponse } from "next/server";

type ChompState = {
  board: number[][];
  currentPlayer: 1 | 2;
  gameOver: boolean;
  gameMessage: string;
};

interface LobbyGames {
  [lobbyId: string]: ChompState;
}

let games: LobbyGames = {}; // in-memory store per lobby

// Helper to create a new random board
const createNewBoard = (): ChompState => {
  const rows = 6;
  const cols = 8;
  const board: number[][] = [];
  for (let r = 1; r <= rows; r++) {
    board[r] = [];
    for (let c = 1; c <= cols; c++) board[r][c] = 1;
  }
  return { board, currentPlayer: 1, gameOver: false, gameMessage: "" };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lobbyId = searchParams.get("lobbyId");

  if (!lobbyId) return NextResponse.json({ error: "Missing lobbyId" }, { status: 400 });

  if (!games[lobbyId]) games[lobbyId] = createNewBoard();

  return NextResponse.json(games[lobbyId]);
}

export async function POST(req: Request) {
  const { lobbyId, move } = await req.json();
  if (!lobbyId) return NextResponse.json({ error: "Missing lobbyId" }, { status: 400 });

  if (!games[lobbyId] || move === null) {
    // New game
    games[lobbyId] = createNewBoard();
    return NextResponse.json(games[lobbyId]);
  }

  const state = games[lobbyId];
  const { row, col } = move;

  if (state.gameOver) return NextResponse.json(state);

  // Apply move
  for (let r = row; r < state.board.length; r++) {
    for (let c = col; c < state.board[r].length; c++) {
      state.board[r][c] = 0;
    }
  }

  // Check poison eaten
  if (state.board[1][1] === 0) {
    const loser = state.currentPlayer;
    const winner = loser === 1 ? 2 : 1;
    state.gameOver = true;
    state.gameMessage = `Player ${loser} ate the poison — Player ${winner} wins!`;
  } else {
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
  }

  games[lobbyId] = state;

  return NextResponse.json(state);
}