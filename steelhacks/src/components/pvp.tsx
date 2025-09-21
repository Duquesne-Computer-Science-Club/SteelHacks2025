"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

// adjustable size limits
const MIN_COLS = 3;
const MAX_COLS = 15;
const MIN_ROWS = 3;
const MAX_ROWS = 15;

export default function PVP(): JSX.Element {
	// dynamic board size
	const [cols, setCols] = useState<number>(8);
	const [rows, setRows] = useState<number>(6);

	// game status
	const [box, setBox] = useState<number[][]>(() => emptyBoard());
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [gameMessage, setGameMessage] = useState<string>("");
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

	// new-game button visual
	const [buttonPressed, setButtonPressed] = useState<boolean>(false);

	// helper to create empty board using provided dimensions
	function emptyBoard(rCount = rows, cCount = cols): number[][] {
		const b: number[][] = [];
		for (let r = 0; r <= rCount; r++) {
			b[r] = [];
			for (let col = 0; col <= cCount; col++) {
				b[r][col] = 0;
			}
		}
		return b;
	}

	// rand int inclusive
	const randInt = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	// start a new random game
	const playAgain = () => {
		setGameOver(false);
		setGameMessage("");
		const newCols = randInt(MIN_COLS, MAX_COLS);
		const newRows = randInt(MIN_ROWS, MAX_ROWS);
		setCols(newCols);
		setRows(newRows);
		const b = emptyBoard(newRows, newCols);
		for (let r = 1; r <= newRows; r++) {
			for (let col = 1; col <= newCols; col++) {
				b[r][col] = 1;
			}
		}
		setBox(b);
		setCurrentPlayer(1);
	};

	useEffect(() => {
		playAgain();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// apply a chomp move (remove row>=r and col>=c)
	const doMove = (r: number, col: number, curBox: number[][] | null = null) => {
		const prev = curBox ?? box;
		const b = emptyBoard(rows, cols);
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

	// handle a player's click
	const playerMove = (r: number, col: number) => {
		if (gameOver) return;
		if (box[r]?.[col] !== 1) return;
		const after = doMove(r, col);
		setBox(after);
		if (isPoisonEaten(after)) {
			// current player ate poison and loses
			const loser = currentPlayer;
			const winner = loser === 1 ? 2 : 1;
			setGameOver(true);
			setGameMessage(`Player ${loser} ate the poison — Player ${winner} wins!`);
			return;
		}
		// toggle player
		setCurrentPlayer((p) => (p === 1 ? 2 : 1));
	};

	// cell visuals
	const cellStyle = (present: boolean, isPoison: boolean) =>
		({
			width: 44,
			height: 44,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			border: "1px solid #444",
			background: present ? (isPoison ? "rgba(153,79,0,1)" : "rgba(225,190,106,1)") : "#ddd",
			color: isPoison ? "white" : "black",
			fontWeight: isPoison ? 700 : 400,
			cursor: present && !gameOver ? "pointer" : "default",
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
	};

	return (
		<div style={{ fontFamily: "sans-serif", padding: 12 }}>
			<hr />
			<h1>CHOMP — Player vs Player</h1>
			<p>Players alternate chomps. Bottom-left square is poisoned — avoid it. Start a new random board with the button below.</p>

			<div style={{ display: "inline-block", border: "2px solid #222", padding: 6 }}>
				{/* render rows top -> bottom */}
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
									onClick={() => present && !gameOver && playerMove(r, col)}
									title={isPoison ? "Poison" : present ? "Chocolate" : "Removed"}
								/>
							);
						})}
					</div>
				))}
			</div>

			<div style={{ marginTop: 12 }}>
				<button
					onClick={playAgain}
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

				{gameOver && (
					<div style={{ marginTop: 8, color: "#ffddcc", fontWeight: 700 }}>{gameMessage}</div>
				)}

				<div style={{ marginTop: 8, color: "#ccc" }}>
					Current: Player {currentPlayer} &nbsp;·&nbsp; Board: {rows} rows × {cols} cols
				</div>
			</div>
		</div>
	);
}
