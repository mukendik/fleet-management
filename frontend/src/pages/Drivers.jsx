import { useEffect, useState } from "react";
import DriverModal from "../components/drivers/DriverModal";
import DriverTable from "../components/drivers/DriverTable";

import * as driverService from "../services/driverService";

export default function DriverPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await driverService.getAll();
      setDrivers(res.data.items || res.data);
    } catch (err) {
      console.error("Error fetching drivers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSave = async (data) => {
    try {
      setLoading(true);

      if (selectedDriver) {
        await driverService.update(selectedDriver.id, data);
      } else {
        await driverService.create(data);
      }

      setModalOpen(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await driverService.delete(id);
      fetchDrivers();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Drivers</h1>

      <button
        onClick={() => {
          setSelectedDriver(null);
          setModalOpen(true);
        }}
      >
        + Add Driver
      </button>

      {loading && <p>Loading...</p>}

      <DriverTable
        drivers={drivers}
        onEdit={(d) => {
          setSelectedDriver(d);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <DriverModal
        isOpen={modalOpen}
        initialData={selectedDriver}
        onClose={() => {
          setModalOpen(false);
          setSelectedDriver(null);
        }}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}