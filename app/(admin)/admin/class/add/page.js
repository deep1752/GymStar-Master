"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultClass = {
    trainer_id: "",
    day: "",
    class_name: "",
    timeing: "",
    customTimeing: "",
};


function generateTimingOptions() {
    const options = [];
    let hour = 5;
    const endHour = 20;
    while (hour < endHour) {
        const start = formatHour(hour);
        const end = formatHour(hour + 1);
        options.push(`${start} - ${end}`);
        hour++;
    }
    return options;
}

function formatHour(hour24) {
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour}:00 ${period}`;
}

export default function AddClass() {
    const [classes, setClasses] = useState([{ ...defaultClass }]);
    const [errors, setErrors] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_all`);
                const data = await res.json();
                setTrainers(data);
            } catch (error) {
                console.error("Failed to fetch trainers:", error);
                toast.error("Failed to load trainers.");
            }
        };
        fetchTrainers();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...classes];
        updated[index][field] = value;
        setClasses(updated);

        const updatedErrors = [...errors];
        if (updatedErrors[index]) updatedErrors[index][field] = "";
        setErrors(updatedErrors);
    };

    const addRow = () => {
        setClasses([...classes, { ...defaultClass }]); // append at bottom
        setErrors([...errors, {}]); // maintain error state in sync
    };


    const removeRow = (index) => {
        if (classes.length === 1) {
            toast.warning("⚠️ You cannot remove the last remaining class row.");
            return;
        }
        setClasses(classes.filter((_, i) => i !== index));
        setErrors(errors.filter((_, i) => i !== index));
    };

    const validate = () => {
        let hasError = false;
        const newErrors = classes.map((c) => {
            const fieldErrors = {};
            if (!c.trainer_id) fieldErrors.trainer_id = "Trainer is required";
            if (!c.day) fieldErrors.day = "Day is required";
            if (!c.class_name.trim()) fieldErrors.class_name = "Class name is required";
            if (!c.timeing.trim()) {
                fieldErrors.timeing = "Timing is required";
            } else if (c.timeing === "custom" && !c.customTimeing.trim()) {
                fieldErrors.timeing = "Custom timing is required";
            }
            if (Object.keys(fieldErrors).length > 0) hasError = true;
            return fieldErrors;
        });
        setErrors(newErrors);
        return !hasError;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("❗ Please correct all required fields.");
            return;
        }
        // Prepare payload with correct timing
        const processedClasses = classes.map(cls => ({
            ...cls,
            timeing: cls.timeing === "custom" ? cls.customTimeing : cls.timeing,
        }));

        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classes: processedClasses }),
            });

            if (res.ok) {
                toast.success("✅ Classes added successfully!");
                router.push("/admin/class");
            } else {
                const text = await res.text();
                toast.error(`❌ Failed to add classes: ${text}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("❌ Something went wrong.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="product-add-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p className="loading-text">Submitting classes...</p>
                </div>
            )}

            <h1 className="product-add-heading">Add Classes</h1>
            <button type="button" onClick={() => router.push("/admin/class")} className="back-btn">
                ◀ Back
            </button>

            <form onSubmit={handleSubmit}>
                <div className="product-table-wrapper">
                    <table className="product-table">
                        <thead className="product-table-header">
                            <tr>
                                <th>Trainer</th>
                                <th>Day</th>
                                <th>Class Name</th>
                                <th>Timing</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls, index) => (
                                <tr key={index} className="product-table-row">
                                    <td>
                                        <select
                                            value={cls.trainer_id}
                                            onChange={(e) => handleChange(index, "trainer_id", e.target.value)}
                                            className={`product-input ${errors[index]?.trainer_id ? "input-error" : ""}`}
                                        >
                                            <option value="">-- Select Trainer --</option>
                                            {trainers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[index]?.trainer_id && (
                                            <small className="error-text">{errors[index].trainer_id}</small>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            value={cls.day}
                                            onChange={(e) => handleChange(index, "day", e.target.value)}
                                            className={`product-input ${errors[index]?.day ? "input-error" : ""}`}
                                        >
                                            <option value="">-- Select Day --</option>
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[index]?.day && (
                                            <small className="error-text">{errors[index].day}</small>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter class name"
                                            value={cls.class_name}
                                            onChange={(e) => handleChange(index, "class_name", e.target.value)}
                                            className={`product-input ${errors[index]?.class_name ? "input-error" : ""}`}
                                        />
                                        {errors[index]?.class_name && (
                                            <small className="error-text">{errors[index].class_name}</small>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            value={cls.timeing}
                                            onChange={(e) => handleChange(index, "timeing", e.target.value)}
                                            className={`product-input ${errors[index]?.timeing ? "input-error" : ""}`}
                                        >
                                            <option value="">-- Select Timing --</option>
                                            {generateTimingOptions().map((time) => (
                                                <option key={time} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                            <option value="custom">Custom</option>
                                        </select>

                                        {cls.timeing === "custom" && (
                                            <input
                                                type="text"
                                                placeholder="e.g. 6:30 AM - 8:00 AM"
                                                value={cls.customTimeing}
                                                onChange={(e) => handleChange(index, "customTimeing", e.target.value)}
                                                className={`product-input mt-2 ${errors[index]?.timeing ? "input-error" : ""}`}
                                            />
                                        )}
                                        {errors[index]?.timeing && (
                                            <small className="error-text">{errors[index].timeing}</small>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="product-actions">
                    <button type="button" onClick={addRow} className="btn add-btn">
                        + Add Class
                    </button>
                    <button type="submit" className="btn submit-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit All"}
                    </button>
                </div>
            </form>
        </div>
    );
}
