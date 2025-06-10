"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

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

export default function EditClass() {
  const [formData, setFormData] = useState({
    trainer_id: "",
    day: "",
    class_name: "",
    timeing: "",
  });
  const [customTiming, setCustomTiming] = useState("");
  const [useCustomTiming, setUseCustomTiming] = useState(false);
  const [errors, setErrors] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const classId = params?.id;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_all`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trainers");
        return res.json();
      })
      .then((data) => setTrainers(data))
      .catch((err) => {
        console.error("Error fetching trainers:", err);
        toast.error("❌ Failed to load trainers");
      });
  }, []);

  useEffect(() => {
    if (!classId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/get_by_id/${classId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch class");
        return res.json();
      })
      .then((cls) => {
        const isCustom = !generateTimingOptions().includes(cls.timeing);
        setFormData({
          trainer_id: cls.trainer_id || "",
          day: cls.day || "",
          class_name: cls.class_name || "",
          timeing: isCustom ? "custom" : cls.timeing || "",
        });
        setUseCustomTiming(isCustom);
        if (isCustom) setCustomTiming(cls.timeing || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching class:", err);
        toast.error("❌ Failed to load class data.");
        setLoading(false);
      });
  }, [classId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "timeing") {
      if (value === "custom") {
        setUseCustomTiming(true);
        setFormData((prev) => ({ ...prev, timeing: "custom" }));
      } else {
        setUseCustomTiming(false);
        setFormData((prev) => ({ ...prev, timeing: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.trainer_id) newErrors.trainer_id = "Trainer is required";
    if (!formData.day.trim()) newErrors.day = "Day is required";
    if (!formData.class_name.trim()) newErrors.class_name = "Class name is required";

    const timingToValidate = useCustomTiming ? customTiming : formData.timeing;
    if (!timingToValidate.trim()) newErrors.timeing = "Timing is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("❗ Please correct all required fields.");
      return;
    }

    const payload = {
      ...formData,
      timeing: useCustomTiming ? customTiming : formData.timeing,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/update/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("✅ Class updated successfully!");
        router.push("/admin/class");
      } else {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          toast.error(`❌ Update failed: ${json.detail || "Unknown error"}`);
        } catch {
          toast.error(`❌ Update failed: ${text || res.statusText}`);
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Something went wrong during update.");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p className="loader-text">🔄 Loading class...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <button type="button" onClick={() => router.push("/admin/class")} className="back-btn">
        ◀ Back
      </button>

      <table className="edit-table">
        <tbody>
          {/* Trainer */}
          <tr className="edit-row">
            <td className="edit-label">Trainer</td>
            <td className="edit-input-cell">
              <select
                name="trainer_id"
                value={formData.trainer_id}
                onChange={handleChange}
                className={`edit-input ${errors.trainer_id ? "input-error" : ""}`}
              >
                <option value="">-- Select Trainer --</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
              {errors.trainer_id && <small className="error-text">{errors.trainer_id}</small>}
            </td>
          </tr>

          {/* Day */}
          <tr className="edit-row">
            <td className="edit-label">Day</td>
            <td className="edit-input-cell">
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className={`edit-input ${errors.day ? "input-error" : ""}`}
              >
                <option value="">-- Select Day --</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.day && <small className="error-text">{errors.day}</small>}
            </td>
          </tr>

          {/* Class Name */}
          <tr className="edit-row">
            <td className="edit-label">Class Name</td>
            <td className="edit-input-cell">
              <input
                type="text"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                className={`edit-input ${errors.class_name ? "input-error" : ""}`}
              />
              {errors.class_name && <small className="error-text">{errors.class_name}</small>}
            </td>
          </tr>

          {/* Timing */}
          <tr className="edit-row">
            <td className="edit-label">Timing</td>
            <td className="edit-input-cell">
              <select
                name="timeing"
                value={useCustomTiming ? "custom" : formData.timeing}
                onChange={handleChange}
                className={`edit-input ${errors.timeing ? "input-error" : ""}`}
              >
                <option value="">-- Select Timing --</option>
                {generateTimingOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>

              {useCustomTiming && (
                <input
                  type="text"
                  placeholder="Enter custom time e.g. 6:30 AM - 8:00 AM"
                  value={customTiming}
                  onChange={(e) => setCustomTiming(e.target.value)}
                  className={`edit-input mt-2 ${errors.timeing ? "input-error" : ""}`}
                />
              )}
              {errors.timeing && <small className="error-text">{errors.timeing}</small>}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Class
        </button>
      </div>
    </form>
  );
}
