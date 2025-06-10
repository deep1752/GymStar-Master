"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function MembershipPlanManager({ onEdit, onAdd }) {
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/get_all`)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        toast.error("❌ Failed to load membership plans.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (idList) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${idList.length > 1 ? "these plans" : "this plan"}?`
    );
    if (!confirmed) return;

    try {
      // For each membership, first find and delete its plan info
      for (const id of idList) {
        // Fetch plan info for this membership
        const infoRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/get_by_membership_id/${id}`);
        const infoData = await infoRes.json();

        if (infoData && infoData.length > 0) {
          // Delete each plan info record
          for (const info of infoData) {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/delete/${info.id}`, {
              method: "DELETE",
            });
          }
        }
      }

      // Then delete the membership plans
      const deletePlanRequests = idList.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/delete/${id}`, {
          method: "DELETE",
        })
      );

      const planResults = await Promise.all(deletePlanRequests);
      const allPlansDeleted = planResults.every((res) => res.ok);

      if (allPlansDeleted) {
        toast.success("Membership plan(s) and associated info deleted successfully!");
        setPlans(plans.filter((plan) => !idList.includes(plan.id)));
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        toast.error("⚠️ Some plan deletions failed.");
      }
    } catch (err) {
      console.error("Error deleting membership plan(s):", err);
      toast.error("⚠️ Something went wrong during deletion.");
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
      setSelectedIds(filteredPlans.map((plan) => plan.id));
    }
    setSelectAll(!selectAll);
  };

  const sortedPlans = [...plans].sort((a, b) => b.id - a.id);

  const filteredPlans = sortedPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInfo = async (membershipId) => {
    setInfoLoading(true);
    setShowModal(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/get_by_membership_id/${membershipId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPlanInfo(data[0]);
      } else {
        toast.error("ℹ️ No plan info found.");
        setPlanInfo(null);
      }
    } catch (error) {
      console.error("Error fetching plan info:", error);
      toast.error("❌ Failed to load plan info.");
      setPlanInfo(null);
    } finally {
      setInfoLoading(false);
    }
  };


  const handleStatusToggle = async (plan) => {
    const updatedStatus = plan.status === "active" ? "inactive" : "active";
    const updatedPlan = { ...plan, status: updatedStatus };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/update/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlan),
      });

      if (response.ok) {
        toast.success(`✔️ Plan "${plan.name}" marked as ${updatedStatus}`);
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, status: updatedStatus } : p))
        );
      } else {
        toast.error("❌ Failed to update plan status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("⚠️ Error updating status.");
    }
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Membership Plans", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Price", "Discount", "Final Price", "Duration", "Status"]],
      body: filteredPlans.map((plan) => [
        plan.name,
        `₹${plan.price}`,
        `${plan.discount}%`,
        `₹${plan.final_price}`,
        plan.duration,
        plan.status,
      ]),
    });
    doc.save("membership_plans.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPlans.map((plan) => ({
        Name: plan.name,
        Price: plan.price,
        Discount: `${plan.discount}%`,
        "Final Price": plan.final_price,
        Duration: plan.duration,
        "Plan Info": plan.plan_info,
        Status: plan.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MembershipPlans");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "membership_plans.xlsx");
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading membership plans...</p>
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
        <h2 className="title">Membership Plan Manager</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link href="/admin/membership/add">
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
                toast.warning("⚠️ Please select at least one plan to delete.");
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
              <th>Name</th>
              <th>Price</th>
              <th>Discount %</th>
              <th>Final Price</th>
              <th>Duration</th>
              <th>Plan Info</th>
              <th>Status</th>
              <th>Actions</th>
              

            </tr>
          </thead>

          <tbody>
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-users-found">
                  🔍 No plans found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(plan.id)}
                      onChange={() => toggleSelectOne(plan.id)}
                    />
                  </td>
                  <td>{plan.name}</td>
                  <td>₹{plan.price}</td>
                  <td>{plan.discount}%</td>
                  <td>₹{plan.final_price}</td>
                  <td>{plan.duration}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewInfo(plan.id)}
                    >
                      👁️ View
                    </button>
                  </td>

                  <td>
                    <button
                      className={`status-toggle ${plan.status === "active" ? "active" : "inactive"}`}
                      onClick={() => handleStatusToggle(plan)}
                    >
                      {plan.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                    </button>
                  </td>

                  <td className="action-buttons">
                    <Link href={`/admin/membership/edit/${plan.id}`}>
                      <button className="edit-button" onClick={() => onEdit?.(plan.id)}>
                        ✏️
                      </button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete([plan.id])}
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>⬅ Back</button>
            <h3 className="modal-title">📋 Plan Information</h3>
            {infoLoading ? (
              <p>🔄 Loading...</p>
            ) : planInfo ? (
              <ul className="plan-info-list">
                {Object.entries(planInfo)
                  .filter(([key]) => key.startsWith("line_"))
                  .map(([key, value]) => (
                    <li key={key}>✅ {value}</li>
                  ))}
              </ul>
            ) : (
              <p>No info available for this plan.</p>
            )}
          </div>
        </div>
      )}

    </div>


  );
}
