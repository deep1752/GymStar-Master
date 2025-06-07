"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function TrainerManager({ onEdit, onAdd }) {
  const router = useRouter();

  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/trainer/get_all")
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trainers:", err);
        toast.error("❌ Failed to load trainers.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these trainers" : "this trainer"}?`
    );
    if (!confirmed) return;

    try {
      const deleteRequests = idList.map((id) =>
        fetch(`http://127.0.0.1:8000/trainer/delete/${id}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deleteRequests);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Trainer(s) deleted successfully!");
        setTrainers(trainers.filter((trainer) => !idList.includes(trainer.id)));
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        toast.error("⚠️ Some deletions failed.");
      }
    } catch (err) {
      console.error("Error deleting trainer(s):", err);
      toast.error("⚠️ Something went wrong.");
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTrainers.map((trainer) => trainer.id));
    }
    setSelectAll(!selectAll);
  };

  const sortedTrainers = [...trainers].sort((a, b) => b.id - a.id);

  const filteredTrainers = sortedTrainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Trainer List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Designation", "Mobile", "Twitter", "Facebook", "LinkedIn"]],
      body: filteredTrainers.map((t) => [
        t.name,
        t.designation,
        t.mobile_number,
        t.twitter_link,
        t.fb_link,
        t.linkedin_link,
      ]),
    });
    doc.save("trainers.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTrainers.map((t) => ({
        Name: t.name,
        Designation: t.designation,
        Mobile: t.mobile_number,
        Twitter: t.twitter_link,
        Facebook: t.fb_link,
        LinkedIn: t.linkedin_link,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "trainers.xlsx");
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading trainers...</p>
      </div>
    );
  }

  return (
    <div className="product-manager-wrapper">
      <div className="header-bar">
        <div className="product-header">
          <button onClick={goBack} className="btn-back">⬅️ Back</button>
        </div>
        <h2 className="title">Trainer Manager</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link href="/admin/trainer/add">
            <button className="add-button" onClick={onAdd}>➕ Add</button>
          </Link>
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>
          <button
            onClick={() =>
              selectedIds.length === 0
                ? toast.warning("⚠️ Please select at least one trainer to delete.")
                : handleDelete(selectedIds)
            }
            className="delete-button"
          >
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>Twitter</th>
              <th>Facebook</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-users-found">
                  🔍 No trainers found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredTrainers.map((t) => (
                <tr key={t.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => toggleSelectOne(t.id)}
                    />
                  </td>
                  <td>{t.name}</td>
                  <td>{t.designation}</td>
                  <td>{t.mobile_number}</td>
                  <td>{t.twitter_link}</td>
                  <td>{t.fb_link}</td>
                  <td>{t.linkedin_link}</td>
                  <td className="action-buttons">
                    <Link href={`/admin/trainer/edit/${t.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(t.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([t.id])}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
