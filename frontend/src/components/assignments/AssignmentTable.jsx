import AssignmentRow from "./AssignmentRow";

export default function AssignmentTable({ data }) {
  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Plate</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a) => (
            <AssignmentRow key={a.id} assignment={a} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    padding: 10,
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};