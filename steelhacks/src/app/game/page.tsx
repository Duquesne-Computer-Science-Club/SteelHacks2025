"use client";
import Chatroom from "@/components/chatroom";

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
        {/* Removed icon */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#333",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bbb",
            fontSize: "1.5rem",
            flex: 1,
          }}
        >
          Game Placeholder
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