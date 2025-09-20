"use client";
import Chatroom from "@/components/chatroom";
import PVP from "@/components/pvp"; // use player-vs-player component

export default function GamePage() {
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
      {/* Left side: Game placeholder */}
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
        {/* Render Chomp game here instead of placeholder */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <PVP />
        </div>
        {/* Removed Main Page button */}
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
    </div>
  );
}