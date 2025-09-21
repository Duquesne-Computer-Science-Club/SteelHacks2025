"use client";

import { useRouter } from "next/navigation";
import { auth0 } from "../lib/auth0";
import React from "react";


export default function HomePage() {
  const router = useRouter();

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.target as HTMLAnchorElement).style.transform = 'scale(1.05)';
  };
  interface MouseEventHandler {
    (e: React.MouseEvent<HTMLAnchorElement>): void;
  }

  const handleMouseLeave: MouseEventHandler = (e) => {
    (e.target as HTMLAnchorElement).style.transform = 'scale(1)';
  };
  
  const session = auth0.getSession();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1f2937", // dark background
      }}
    >
      <button
        onClick={() => router.push("/auth")}
        style={{
          padding: "16px 32px",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#4f46e5",
          color: "#fff",
          fontSize: "1.25rem",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Login
      </button>
    </div>
  );
}