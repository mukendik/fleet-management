export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={card}>Total Vehicles</div>
        <div style={card}>Active</div>
        <div style={card}>Inactive</div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  flex: 1,
};