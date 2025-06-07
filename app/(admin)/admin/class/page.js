"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Make sure this is imported

const DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "All Classes"
];

export default function ClassManager() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState("monday");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [trainerMap, setTrainerMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/classes/get_all")
            .then((res) => res.json())
            .then(async (data) => {
                setClasses(data);
                const trainerIds = [...new Set(data.map((cls) => cls.trainer_id))];
                const map = {};
                for (const id of trainerIds) {
                    try {
                        const res = await fetch(`http://127.0.0.1:8000/trainer/get_by_id/${id}`);
                        const trainer = await res.json();
                        map[id] = trainer.name;
                    } catch (err) {
                        console.error(`Failed to fetch trainer ${id}`, err);
                        map[id] = "Unknown";
                    }
                }
                setTrainerMap(map);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch classes:", err);
                toast.error("❌ Failed to load classes.");
                setLoading(false);
            });
    }, []);

   const filteredClasses = classes
    .filter((cls) =>
        selectedDay === "All Classes" || cls.day.toLowerCase() === selectedDay
    )
    .filter((cls) =>
        cls.class_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelectOne = (index) => {
        if (selectedIds.includes(index)) {
            setSelectedIds(selectedIds.filter((id) => id !== index));
        } else {
            setSelectedIds([...selectedIds, index]);
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredClasses.map((_, index) => index));
        }
        setSelectAll(!selectAll);
    };

    const handleDelete = async (indexList) => {
        const confirmed = confirm(
            `Are you sure you want to delete ${indexList.length > 1 ? "these classes" : "this class"}?`
        );
        if (!confirmed) return;

        try {
            const deleteRequests = indexList.map((index) => {
                const classId = filteredClasses[index].id;  // ✅ Get actual class ID here
                return fetch(`http://127.0.0.1:8000/classes/delete/${classId}`, {
                    method: "DELETE",
                });
            });

            const results = await Promise.all(deleteRequests);
            const allSuccessful = results.every((res) => res.ok);

            if (allSuccessful) {
                toast.success("Class(es) deleted successfully!");

                // Remove deleted classes from state
                const deletedIds = new Set(indexList.map((i) => filteredClasses[i].id));
                const updatedClasses = classes.filter((cls) => !deletedIds.has(cls.id));

                setClasses(updatedClasses);
                setSelectedIds([]);
                setSelectAll(false);
            } else {
                toast.error("⚠️ Some deletions failed.");
            }
        } catch (err) {
            console.error("Error deleting classes:", err);
            toast.error("⚠️ Something went wrong.");
        }
    };


    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(`Classes on ${selectedDay}`, 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["Class Name", "Timing", "Trainer"]],
            body: filteredClasses.map((cls) => [
                cls.class_name,
                cls.timeing,
                trainerMap[cls.trainer_id] || "Loading...",
            ]),
        });
        doc.save(`${selectedDay}_classes.pdf`);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredClasses.map((cls) => ({
                "Class Name": cls.class_name,
                Timing: cls.timeing,
                Trainer: trainerMap[cls.trainer_id] || "Loading...",
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${selectedDay}_classes.xlsx`);
    };

    const handleEdit = (classData) => {
        // console.log("Class ID:", classData); // 👈 This will log class_id
        toast.info(`📝 Redirecting to edit class: ${classData.class_name}`);
        router.push(`/admin/class/edit/${classData.id}`);
    };


    const goBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="loader-container">
                <p className="loader-text">🔄 Loading classes...</p>
            </div>
        );
    }

    return (
        <div className="product-manager-wrapper">
            <h2 className="title">Class Manager</h2>

            <div className="toolbar">
                <button onClick={goBack} className="btn-back">⬅️ Back</button>
                <button
                    onClick={() => router.push("/admin/class/add")}
                    className="btn-add"
                >
                    ➕ Add Class
                </button>
                <input
                    type="text"
                    placeholder="🔍 Search by class name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="day-tabs">
                {DAYS.map((day) => (

                    <button
                        key={day}
                        className={`day-tab ${selectedDay === day ? "active" : ""}`}
                        onClick={() => {
                            setSelectedDay(day);
                            setSelectedIds([]);
                            setSelectAll(false);
                        }}
                    >
                        
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                ))}
            </div>

            <div className="actions">
                <button onClick={downloadPDF} className="download-button">
                    📄 Download PDF
                </button>
                <button onClick={downloadExcel} className="download-button">
                    📊 Download Excel
                </button>
                <button
                    onClick={() => {
                        if (selectedIds.length === 0) {
                            toast.warning("⚠️ Please select at least one class to delete.");
                        } else {
                            handleDelete(selectedIds);
                        }
                    }}
                    className="delete-button"
                >
                    🗑️ Delete Selected ({selectedIds.length})
                </button>
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
                            <th>Class Name</th>
                            <th>Timing</th>
                            <th>Trainer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.length === 0 ? (
                            <tr>
                                <td colSpan="5">❌ No classes found for {selectedDay}</td>
                            </tr>
                        ) : (
                            filteredClasses.map((cls, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(index)}
                                            onChange={() => toggleSelectOne(index)}
                                        />
                                    </td>
                                    <td>{cls.class_name}</td>
                                    <td>{cls.timeing}</td>
                                    <td>{trainerMap[cls.trainer_id] || "Loading..."}</td>
                                    <td>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(cls)}
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete([index])}
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
