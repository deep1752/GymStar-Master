"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditTrainer() {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        mobile_number: "",
        twitter_link: "",
        fb_link: "",
        linkedin_link: "",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [existingImage, setExistingImage] = useState(null);
    const router = useRouter();
    const { id: trainerId } = useParams();

    useEffect(() => {
        if (!trainerId) return;

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_by_id/${trainerId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch trainer");
                return res.json();
            })
            .then((trainer) => {
                setFormData({
                    name: trainer.name || "",
                    designation: trainer.designation || "",
                    mobile_number: trainer.mobile_number || "",
                    twitter_link: trainer.twitter_link || "",
                    fb_link: trainer.fb_link || "",
                    linkedin_link: trainer.linkedin_link || "",
                    image: null,
                });

                setExistingImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${trainer.image}`);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trainer:", err);
                toast.error("❌ Failed to load trainer data.");
                setLoading(false);
            });
    }, [trainerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        setExistingImage(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.designation.trim()) newErrors.designation = "Designation is required";
        if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
        if (!/^\d{10}$/.test(formData.mobile_number)) {
            toast.warning("⚠️ Please enter a valid 10-digit mobile number.");
            return;
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

        const data = new FormData();
        data.append("name", formData.name);
        data.append("designation", formData.designation);
        data.append("mobile_number", formData.mobile_number);
        data.append("twitter_link", formData.twitter_link);
        data.append("fb_link", formData.fb_link);
        data.append("linkedin_link", formData.linkedin_link);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/update/${trainerId}`, {
                method: "PUT",
                body: data,
            });

            if (res.ok) {
                toast.success("✅ Trainer updated successfully!");
                router.push("/admin/trainers");
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
                <p className="loader-text">🔄 Loading trainer...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <button
                type="button"
                onClick={() => router.push("/admin/trainers")}
                className="back-btn"
            >
                ◀ Back
            </button>

            <table className="edit-table">
                <tbody>
                    <tr className="edit-row">
                        <td className="edit-label">Name</td>
                        <td className="edit-input-cell">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`edit-input ${errors.name ? "input-error" : ""}`}
                                required
                            />
                            {errors.name && <small className="error-text">{errors.name}</small>}
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">Designation</td>
                        <td className="edit-input-cell">
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className={`edit-input ${errors.designation ? "input-error" : ""}`}
                                required
                            />
                            {errors.designation && (
                                <small className="error-text">{errors.designation}</small>
                            )}
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">Mobile Number</td>
                        <td className="edit-input-cell">
                            <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setFormData({ ...formData, mobile_number: value });
                                    }
                                }}
                                onPaste={(e) => {
                                    const paste = e.clipboardData.getData("text");
                                    if (!/^\d+$/.test(paste)) {
                                        e.preventDefault();
                                        toast.error("❌ Only numeric values allowed.");
                                    }
                                }}
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                                className="input-field"
                            />


                            {errors.mobile_number && (
                                <small className="error-text">{errors.mobile_number}</small>
                            )}
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">Twitter Link</td>
                        <td className="edit-input-cell">
                            <input
                                type="url"
                                name="twitter_link"
                                value={formData.twitter_link}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">Facebook Link</td>
                        <td className="edit-input-cell">
                            <input
                                type="url"
                                name="fb_link"
                                value={formData.fb_link}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">LinkedIn Link</td>
                        <td className="edit-input-cell">
                            <input
                                type="url"
                                name="linkedin_link"
                                value={formData.linkedin_link}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        </td>
                    </tr>

                    <tr className="edit-row">
                        <td className="edit-label">Upload Image</td>
                        <td className="edit-input-cell">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-input"
                            />
                            {(formData.image || existingImage) && (
                                <div style={{ marginTop: "10px" }}>
                                    <strong>Preview:</strong>
                                    <br />
                                    <img
                                        src={
                                            formData.image
                                                ? URL.createObjectURL(formData.image)
                                                : existingImage
                                        }
                                        alt="Preview"
                                        style={{
                                            maxWidth: "200px",
                                            marginTop: "8px",
                                            borderRadius: "6px",
                                        }}
                                    />
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="edit-submit-container">
                <button type="submit" className="edit-submit-button">
                    Update Trainer
                </button>
            </div>
        </form>
    );
}
