import { useEffect, useState } from "react";

import DriverModal from "../components/drivers/DriverModal";
import DriverTable from "../components/drivers/DriverTable";

import { driverService } from "../services/driverService";
import { useToast } from "../components/ui/toast";
import { getApiErrorMessage } from "../utils/apiError";

export default function DriverPage() {
  const { toast } = useToast();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await driverService.getAll({
        page: currentPage,
        limit,
        search,
        status,
      });

      const data = res.data;

      setDrivers(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Error fetching drivers", err);
      toast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 central fetch (comme Vehicles)
  useEffect(() => {
    fetchDrivers();
  }, [currentPage, limit, search, status]);

  const openCreate = () => {
    setSelectedDriver(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);

      if (selectedDriver) {
        await driverService.update(selectedDriver.id, data);
        toast("Driver updated successfully", "success");
      } else {
        await driverService.create(data);
        toast("Driver created successfully", "success");
      }

      setModalOpen(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (err) {
      toast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("API DELETE CALL:", id);

      if (!id) {
        console.error("Missing driver id");
        return;
      }
      await driverService.delete(id);

      toast("Driver deleted", "success");

      fetchDrivers();
    } catch (e) {
      console.error("DELETE ERROR:", e);
      toast("Delete failed", "error");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      {/* ACTION BAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>

        <button onClick={openCreate}>
          + Create Driver
        </button>

        <input
          placeholder="Search driver..."
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setCurrentPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setCurrentPage(1);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* TABLE */}
      <DriverTable
        drivers={drivers}
        onEdit={(d) => {
          setSelectedDriver(d);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      <div style={{ marginTop: 15, display: "flex", gap: 10 }}>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {pages} ({total})
        </span>

        <button
          disabled={currentPage === pages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
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