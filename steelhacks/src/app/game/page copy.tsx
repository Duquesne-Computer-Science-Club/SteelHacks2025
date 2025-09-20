"use client";
import PVE from "@/components/pve";
import React from "react";

export default function GamePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200, display: "flex", justifyContent: "center" }}>
        <PVE />
      </div>
    </div>
  );
}