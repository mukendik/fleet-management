export default function DriverTable({ drivers, onEdit, onDelete }) {
  return (
    <table width="100%" border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Permis</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {drivers.map((d) => (
          <tr key={d.id}>
            <td>{d.first_name} {d.last_name}</td>
            <td>{d.email}</td>
            <td>{d.phone}</td>
            <td>{d.license_number}</td>
            <td>{d.status}</td>
            <td>
              <button onClick={() => onEdit(d)}>Edit</button>
              <button onClick={() => onDelete(d.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}