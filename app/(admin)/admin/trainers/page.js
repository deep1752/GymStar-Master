"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import Image from "next/image";

export default function TrainerManager({ onEdit, onAdd }) {
  const router = useRouter();
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_all`)
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
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/delete/${id}`, {
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
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
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
      body: filteredTrainers.map((trainer) => [
        trainer.name,
        trainer.designation,
        trainer.mobile_number,
        trainer.twitter_link,
        trainer.fb_link,
        trainer.linkedin_link,
      ]),
    });
    doc.save("trainers.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTrainers.map((trainer) => ({
        Name: trainer.name,
        Designation: trainer.designation,
        Mobile: trainer.mobile_number,
        Twitter: trainer.twitter_link,
        Facebook: trainer.fb_link,
        LinkedIn: trainer.linkedin_link,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
          {/* <button onClick={() => router.push("/admin")} className="back-btn">
            ◀ Back
          </button> */}
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
          <Link href="/admin/trainers/add">
            <button className="add-button" onClick={onAdd}>
              ➕ Add
            </button>
          </Link>
          <button onClick={downloadPDF} className="download-button">
            📄 Download PDF
          </button>
          <button onClick={downloadExcel} className="download-button">
            📊 Download Excel
          </button>
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("⚠️ Please select at least one trainer to delete.");
              } else {
                handleDelete(selectedIds);
              }
            }}
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
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              </th>
              <th>Image</th>
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
                <td colSpan="9" className="no-users-found">
                  🔍 No trainers found matching {searchTerm}
                </td>

              </tr>
            ) : (
              filteredTrainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(trainer.id)}
                      onChange={() => toggleSelectOne(trainer.id)}
                    />
                  </td>
                  <td>
                    // Inside your map/render
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${trainer.image}`}
                      alt={trainer.name}
                      width={50}
                      height={50}
                      className="trainer-img"
                      style={{ borderRadius: "8px" }}
                    />
                  </td>
                  <td>{trainer.name}</td>
                  <td>{trainer.designation}</td>
                  <td>{trainer.mobile_number}</td>
                  <td>
                    <a href={trainer.twitter_link} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </td>
                  <td>
                    <a href={trainer.fb_link} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </td>
                  <td>
                    <a href={trainer.linkedin_link} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </td>
                  <td className="action-buttons">
                    <Link href={`/admin/trainers/edit/${trainer.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(trainer.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([trainer.id])}
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
