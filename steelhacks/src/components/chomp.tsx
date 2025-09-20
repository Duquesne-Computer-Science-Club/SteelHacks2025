"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

const C = 10; // number of columns (6..10 allowed in original, using 7 here)
const ROWS = 10;

export default function Chomp(): JSX.Element {
	// box[r][c] uses 1-based indices for convenience: rows 1..ROWS (1=bottom), cols 1..C
	const emptyBoard = (): number[][] => {
		const b: number[][] = [];
		for (let r = 0; r <= ROWS; r++) {
			b[r] = [];
			for (let col = 0; col <= C; col++) {
				b[r][col] = 0;
			}
		}
		return b;
	};

	const [box, setBox] = useState<number[][]>(emptyBoard);

	// initialize board
	const playAgain = () => {
		const b = emptyBoard();
		for (let r = 1; r <= ROWS; r++) {
			for (let col = 1; col <= C; col++) {
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
		const b = emptyBoard();
		// copy previous
		for (let rr = 1; rr <= ROWS; rr++) {
			for (let cc = 1; cc <= C; cc++) {
				b[rr][cc] = prev[rr][cc];
			}
		}
		for (let rr = r; rr <= ROWS; rr++) {
			for (let cc = col; cc <= C; cc++) {
				b[rr][cc] = 0;
			}
		}
		return b;
	};

	const isPoisonEaten = (b: number[][]) => b[1][1] === 0;

	const playerMove = (r: number, col: number) => {
		if (box[r][col] !== 1) return; // invalid click
		const afterPlayer = doMove(r, col);
		setBox(afterPlayer);
		if (isPoisonEaten(afterPlayer)) {
			alert("You chomped the poison! You lose.");
			playAgain();
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
		for (let r = 1; r <= ROWS; r++) {
			for (let c = 1; c <= C; c++) {
				if (curBox[r][c] === 1) moves.push({ r, c });
			}
		}
		if (moves.length === 0) {
			alert("No moves left — draw.");
			playAgain();
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
			alert("Computer chomped the poison — you win!");
			playAgain();
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
			background: present ? (isPoison ? "rgba(0, 0, 0, 1)" : "#00ff04ff") : "#ddd",
			color: isPoison ? "white" : "black",
			fontWeight: isPoison ? 700 : 400,
			cursor: present ? "pointer" : "default",
			userSelect: "none",
		} as React.CSSProperties);

	return (
		<div style={{ fontFamily: "sans-serif", padding: 12 }}>
			<hr />
			<h1>CHOMP!</h1>
			<p>The lower-left square is poisoned. Click a square to chomp it and everything to its right and above. Don't eat the poison!</p>

			<div style={{ display: "inline-block", border: "2px solid #222", padding: 6 }}>
				{/* render rows top -> bottom (adjustable via ROWS) */}
				{Array.from({ length: ROWS }, (_, i) => ROWS - i).map((r) => (
					<div key={r} style={{ display: "flex" }}>
						{Array.from({ length: C }, (_, idx) => {
							const col = idx + 1;
							const present = box[r]?.[col] === 1;
							const isPoison = r === 1 && col === 1;
							return (
								<div
									key={`${r}-${col}`}
									style={cellStyle(present, isPoison)}
									onClick={() => present && playerMove(r, col)}
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
			</div>
		</div>
	);
}