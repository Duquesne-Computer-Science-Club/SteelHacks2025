"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
	
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "6rem", marginBottom: "20px" }}>🎮</div>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>"Josh will make this page have authentication later :)"</h2>
      <button
        onClick={() => window.location.href = '/game'}
        style={{
          padding: "12px 24px",
          backgroundColor: "#8B4513",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor = "#A0522D";
          (e.target as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor = "#8B4513";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        Login
      </button>
    </div>
  );
}