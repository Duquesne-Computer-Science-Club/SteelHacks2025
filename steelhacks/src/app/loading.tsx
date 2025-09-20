export default function Loading() {
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
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Loading...</h2>
    </div>
  );
}