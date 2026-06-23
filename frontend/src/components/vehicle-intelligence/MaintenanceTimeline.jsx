import React from "react";

const MaintenanceTimeline = ({ timeline }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Maintenance Forecast</h3>

      <ul>
        {timeline.map((t, index) => (
          <li key={index}>
            {t.label} — {t.date || t.km} km
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceTimeline;