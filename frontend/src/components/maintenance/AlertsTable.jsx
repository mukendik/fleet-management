import React from "react";

const AlertsTable = ({ alerts, onResolve }) => {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Alerts</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Rule</th>
            <th>Severity</th>
            <th>KM</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.vehicle_id}</td>
              <td>{a.rule_name}</td>
              <td>{a.severity}</td>
              <td>{a.current_km}</td>
              <td>
                {!a.resolved && (
                  <button onClick={() => onResolve(a.id)}>
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable;