"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditMembershipPlan() {
  const [formData, setFormData] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: planId } = useParams();

  useEffect(() => {
    if (!planId) return;

    const fetchData = async () => {
      try {
        const [planRes, infoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/get/${planId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/get_by_membership_id/${planId}`),
        ]);

        if (!planRes.ok || !infoRes.ok) throw new Error("Failed to fetch data");

        const plan = await planRes.json();
        const planInfoData = await infoRes.json();

        setFormData({
          name: plan.name || "",
          price: plan.price?.toString() || "",
          discount: plan.discount?.toString() || "",
          final_price: plan.final_price?.toString() || "",
          duration: plan.duration || "",
          plan_info: plan.plan_info || "",
          status: plan.status || "",
        });

        setPlanInfo({
          membership_id: planId,
          line_1: planInfoData[0]?.line_1 || "",
          line_2: planInfoData[0]?.line_2 || "",
          line_3: planInfoData[0]?.line_3 || "",
          line_4: planInfoData[0]?.line_4 || "",
          line_5: planInfoData[0]?.line_5 || "",
          line_6: planInfoData[0]?.line_6 || "",
          line_7: planInfoData[0]?.line_7 || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("❌ Failed to load plan or plan info.");
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "discount", "final_price"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    // Limit input length for planInfo fields
    const limits = {
      line_1: 30,
      line_2: 30,
      line_3: 30,
      line_4: 30,
      line_5: 30,
      line_6: 60,
      line_7: 30,
    };

    if (name in limits && value.length > limits[name]) return;

    if (formData && name in formData) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (planInfo && name in planInfo) {
      setPlanInfo((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "price",
      "discount",
      "final_price",
      "duration",
      "plan_info",
      "status",
      "line_1",
      "line_2",
      "line_3",
      "line_4",
      "line_5",
      "line_6",
      "line_7",
    ];

    for (const field of requiredFields) {
      const value = formData?.[field] ?? planInfo?.[field];
      if (!value?.trim()) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("❗ Please correct all required fields.");
      return;
    }

    try {
      const updatePlanRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/update/${planId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            price: parseInt(formData.price),
            discount: parseInt(formData.discount),
            final_price: parseInt(formData.final_price),
          }),
        }
      );

      const updateInfoRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/update_by_membership_id/${planId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planInfo),
        }
      );

      if (updatePlanRes.ok && updateInfoRes.ok) {
        toast.success("✅ Membership plan and info updated successfully!");
        router.push("/admin/membership");
      } else {
        toast.error("❌ Failed to update plan or plan info.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Something went wrong during update.");
    }
  };

  if (loading) return <p>🔄 Loading plan...</p>;
  if (!formData || !planInfo)
    return <p className="text-red-500">❌ Failed to load plan data.</p>;

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <button
        type="button"
        onClick={() => router.push("/admin/membership")}
        className="back-btn"
      >
        ◀ Back
      </button>

      <table className="edit-table">
        <tbody>
          {[
            { label: "Plan Name", name: "name" },
            { label: "Price", name: "price" },
            { label: "Discount %", name: "discount" },
            { label: "Final Price", name: "final_price" },
            { label: "Duration", name: "duration" },
           
          ].map(({ label, name }) => (
            <tr key={name}>
              <td>{label}</td>
              <td>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`edit-input ${errors[name] ? "input-error" : ""}`}
                  required
                />
                {errors[name] && (
                  <small className="error-text">{errors[name]}</small>
                )}
              </td>
            </tr>
          ))}

          {[
            "line_1",
            "line_2",
            "line_3",
            "line_4",
            "line_5",
            "line_6",
            "line_7",
          ].map((name) => (
            <tr key={name}>
              <td>{name.replace("_", " ").toUpperCase()}</td>
              <td>
                <input
                  type="text"
                  name={name}
                  value={planInfo[name]}
                  onChange={handleChange}
                  className={`edit-input ${errors[name] ? "input-error" : ""}`}
                  required
                />
                {errors[name] && (
                  <small className="error-text">{errors[name]}</small>
                )}
              </td>
            </tr>
          ))}

          <tr>
            <td>Status</td>
            <td>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`edit-input ${errors.status ? "input-error" : ""}`}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="active">Active</option>
                <option value="non-active">Inactive</option>
              </select>
              {errors.status && (
                <small className="error-text">{errors.status}</small>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="edit-submit-container">
        <button type="submit" className="edit-submit-button">
          Update Plan
        </button>
      </div>
    </form>
  );
}
