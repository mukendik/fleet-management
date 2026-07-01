export default function AssignmentToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onCreate,
}) {
  return (
    <div style={styles.bar}>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search driver, vehicle, plate..."
        style={styles.input}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={styles.select}
      >
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="ENDED">Ended</option>
      </select>

      <button onClick={onCreate} style={styles.button}>
        + New Assignment
      </button>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};