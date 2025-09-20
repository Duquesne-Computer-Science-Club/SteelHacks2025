"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

// replace fixed-size constants with adjustable min/max and state
const MIN_COLS = 3;
const MAX_COLS = 15;
const MIN_ROWS = 3;
const MAX_ROWS = 15;

export default function Chomp(): JSX.Element {
	// rows/cols are dynamic now
	const [cols, setCols] = useState<number>(8);
	const [rows, setRows] = useState<number>(9);
	// game status
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [gameMessage, setGameMessage] = useState<string>("");

	const emptyBoard = (rCount = rows, cCount = cols): number[][] => {
		const b: number[][] = [];
		for (let r = 0; r <= rCount; r++) {
			b[r] = [];
			for (let col = 0; col <= cCount; col++) {
				b[r][col] = 0;
			}
		}
		return b;
	};

	const [box, setBox] = useState<number[][]>(() => emptyBoard());

	// helper to get random int inclusive
	const randInt = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	// initialize board — pick a random size each game
	const playAgain = () => {
		// clear any previous game state
		setGameOver(false);
		setGameMessage("");
		const newCols = randInt(MIN_COLS, MAX_COLS);
		const newRows = randInt(MIN_ROWS, MAX_ROWS);
		// set state
		setCols(newCols);
		setRows(newRows);
		// build board using chosen sizes (use local variables to avoid relying on async setState)
		const b = emptyBoard(newRows, newCols);
		for (let r = 1; r <= newRows; r++) {
			for (let col = 1; col <= newCols; col++) {
				b[r][col] = 1; // square present
			}
		}
		// poison is at (1,1) bottom-left but it's present at start
		setBox(b);
	};

	useEffect(() => {
		playAgain();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// remove (chomp) all squares with row >= r and col >= c (rows counted bottom->top)
	const doMove = (r: number, col: number, curBox: number[][] | null = null) => {
		const prev = curBox ?? box;
		const b = emptyBoard(rows, cols);
		// copy previous (only up to current rows/cols)
		for (let rr = 1; rr <= rows; rr++) {
			for (let cc = 1; cc <= cols; cc++) {
				b[rr][cc] = prev[rr]?.[cc] ?? 0;
			}
		} 
		for (let rr = r; rr <= rows; rr++) {
			for (let cc = col; cc <= cols; cc++) {
				b[rr][cc] = 0;
			}
		}
		return b;
	};

	const isPoisonEaten = (b: number[][]) => b[1]?.[1] === 0;

	const playerMove = (r: number, col: number) => {
		if (box[r]?.[col] !== 1) return; // invalid click
		const afterPlayer = doMove(r, col);
		setBox(afterPlayer);
		if (isPoisonEaten(afterPlayer)) {
			// stop and show message; user must click New Game
			setGameOver(true);
			setGameMessage("You died, cmon man.");
			return;
		}
		// Computer turn
		setTimeout(() => {
			computerTurn(afterPlayer);
		}, 300);
	};

	// Simple AI: collect valid moves, avoid immediate poison-eating move if possible
	const computerTurn = (curBox: number[][]) => {
		const moves: { r: number; c: number }[] = [];
		for (let r = 1; r <= rows; r++) {
			for (let c = 1; c <= cols; c++) {
				if (curBox[r]?.[c] === 1) moves.push({ r, c });
			}
		}
		if (moves.length === 0) {
			setGameOver(true);
			setGameMessage("No moves left — draw.");
			return;
		}
		// prefer moves that do NOT immediately eat the poison if possible
		const safeMoves = moves.filter((m) => {
			const b = doMove(m.r, m.c, curBox);
			return !isPoisonEaten(b);
		});
		let chosen: { r: number; c: number };
		if (safeMoves.length > 0) {
			chosen = safeMoves[Math.floor(Math.random() * safeMoves.length)];
		} else {
			// forced to eat poison
			chosen = moves[Math.floor(Math.random() * moves.length)];
		}
		const afterAI = doMove(chosen.r, chosen.c, curBox);
		setBox(afterAI);
		if (isPoisonEaten(afterAI)) {
			setGameOver(true);
			setGameMessage("Computer ate the poison — you will not win ever again!");
		}
	};

	// Rendering utilities
	const cellStyle = (present: boolean, isPoison: boolean) =>
		({
			width: 44,
			height: 44,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			border: "1px solid #444",
			background: present ? (isPoison ? "rgba(47, 40, 32, 1)" : "#4c391cff") : "#ddd",
			color: isPoison ? "white" : "black",
			fontWeight: isPoison ? 700 : 400,
			cursor: present ? "pointer" : "default",
			userSelect: "none",
		} as React.CSSProperties);

	return (
		<div style={{ fontFamily: "sans-serif", padding: 12 }}>
			<hr />
			<h1>CHOMP!</h1>
			<p>The lower-left square is poisoned — don't eat it. Start a new random board with the button below.</p>

			<div style={{ display: "inline-block", border: "2px solid #222", padding: 6 }}>
				{/* render rows top -> bottom (adjustable via rows/cols) */}
				{Array.from({ length: rows }, (_, i) => rows - i).map((r) => (
					<div key={r} style={{ display: "flex" }}>
						{Array.from({ length: cols }, (_, idx) => {
							const col = idx + 1;
							const present = box[r]?.[col] === 1;
							const isPoison = r === 1 && col === 1;
							return (
								<div
									key={`${r}-${col}`}
									style={cellStyle(present, isPoison)}
									// disable clicking when game is over
									onClick={() => present && !gameOver && playerMove(r, col)}
									title={isPoison ? "Poison" : present ? "Chocolate" : "Removed"}
								>
									{/* no emoji: visual state is conveyed by background color */}
								</div>
							);
						})}
					</div>
				))}
			</div>

			<div style={{ marginTop: 12 }}>
				<button onClick={playAgain}>New Game</button>
				{gameOver && (
					<div style={{ marginTop: 8, color: "#ffddcc", fontWeight: 700 }}>
						{gameMessage}
					</div>
				)}
 				{/* show current board size */}
 				<div style={{ marginTop: 8, color: "#ccc" }}>
 					Board: {rows} rows × {cols} cols
 				</div>
 			</div>
 		</div>
 	);
 }