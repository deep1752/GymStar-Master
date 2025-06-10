"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import Image from "next/image"; // Add at the top

export default function SliderManager({ onEdit, onAdd }) {
  const router = useRouter();
  const [sliders, setSliders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/get`)
      .then((res) => res.json())
      .then((data) => {
        setSliders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sliders:", err);
        toast.error("❌ Failed to load sliders.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these sliders" : "this slider"}?`
    );
    if (!confirmed) return;

    try {
      const deleteRequests = idList.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/delete/${id}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deleteRequests);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Slider(s) deleted successfully!");
        setSliders(sliders.filter((slider) => !idList.includes(slider.id)));
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        toast.error("⚠️ Some deletions failed.");
      }
    } catch (err) {
      console.error("Error deleting slider(s):", err);
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

  const toggleSliderStatus = async (slider) => {
    const newStatus = slider.status === "active" ? "inactive" : "active";

    const formData = new FormData();
    formData.append("title", slider.title);
    formData.append("subtitle", slider.subtitle);
    formData.append("status", newStatus);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/update/${slider.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setSliders((prev) =>
          prev.map((s) =>
            s.id === slider.id ? { ...s, status: newStatus } : s
          )
        );
        toast.success(`✅ Slider is now ${newStatus}`);
      } else {
        const errData = await res.json();
        console.error("Update error:", errData);
        toast.error("❌ Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("⚠️ Something went wrong");
    }
  };



  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSliders.map((slider) => slider.id));
    }
    setSelectAll(!selectAll);
  };

  const sortedSliders = [...sliders].sort((a, b) => b.id - a.id);

  const filteredSliders = sortedSliders.filter((slider) =>
    `${slider.title} ${slider.subtitle}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Slider List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Subtitle", "Status"]],
      body: filteredSliders.map((slider) => [
        slider.title,
        slider.subtitle,
        slider.status,
      ]),
    });
    doc.save("sliders.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSliders.map((slider) => ({
        Title: slider.title,
        Subtitle: slider.subtitle,
        Status: slider.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sliders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "sliders.xlsx");
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading sliders...</p>
      </div>
    );
  }

  return (
    <div className="product-manager-wrapper">
      <div className="header-bar">
        <div className="product-header">
          {/* <button
            type="button"
            onClick={() => router.push("/admin")}
            className="back-btn"
          >
            ◀ Back
          </button> */}
          <button onClick={goBack} className="btn-back">⬅️ Back</button>
        </div>
        <h2 className="title">Slider Manager</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link href="/admin/sliders/add">
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
                toast.warning("⚠️ Please select at least one slider to delete.");
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
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSliders.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users-found">
                  🔍 No sliders found matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            ) : (
              filteredSliders.map((slider) => (
                <tr key={slider.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(slider.id)}
                      onChange={() => toggleSelectOne(slider.id)}
                    />
                  </td>
                  <td>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${slider.image}`}
                      alt={slider.title}
                      width={80}
                      height={50} // adjust height accordingly
                      className="slider-image-thumb"
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{slider.title}</td>
                  <td>{slider.subtitle}</td>
                  <td>
                    <button
                      className={`status-toggle-btn ${slider.status === "active" ? "active" : "inactive"}`}
                      onClick={() => toggleSliderStatus(slider)}
                    >
                      {slider.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                    </button>
                  </td>


                  <td className="action-buttons">
                    <Link href={`/admin/sliders/edit/${slider.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(slider.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([slider.id])}
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
