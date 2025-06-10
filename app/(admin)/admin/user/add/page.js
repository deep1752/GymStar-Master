"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultUser = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  mobile: "",
  age: "",
  gender: "male",
};

export default function AddUser() {
  const [users, setUsers] = useState([{ ...defaultUser }]);
  const [errors, setErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index, field, value) => {
    const updated = [...users];
    if (field === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    if (field === "age") {
      if (!/^\d*$/.test(value) || parseInt(value) > 120) return;
    }
    updated[index][field] = value;
    setUsers(updated);

    const updatedErrors = [...errors];
    if (updatedErrors[index]) updatedErrors[index][field] = "";
    setErrors(updatedErrors);
  };

  const addRow = () => {
    setUsers([{ ...defaultUser }, ...users]);
    setErrors([{}, ...errors]);
  };

  const removeRow = (index) => {
    if (users.length === 1) {
      toast.warning("⚠️ You cannot remove the last remaining user row.");
      return;
    }
    setUsers(users.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const validate = () => {
    let hasError = false;
    const newErrors = users.map((user) => {
      const fieldErrors = {};
      if (!user.first_name.trim()) fieldErrors.first_name = "First name is required";
      if (!user.last_name.trim()) fieldErrors.last_name = "Last name is required";
      if (!user.email.trim()) {
        fieldErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) {
        fieldErrors.email = "Invalid email format";
      }
      if (!user.password.trim()) {
        fieldErrors.password = "Password is required";
      } else if (user.password.length < 6) {
        fieldErrors.password = "Min 6 characters";
      }
      if (!user.mobile.trim()) {
        fieldErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(user.mobile.trim())) {
        fieldErrors.mobile = "Must be 10 digits";
      }
      if (!user.age.trim()) {
        fieldErrors.age = "Age is required";
      } else if (parseInt(user.age) <= 0 || parseInt(user.age) > 120) {
        fieldErrors.age = "Invalid age";
      }
      if (!user.gender.trim()) fieldErrors.gender = "Gender is required";
      if (Object.keys(fieldErrors).length > 0) hasError = true;
      return fieldErrors;
    });
    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("❗ Please correct errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      for (const user of users) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...user,
            age: parseInt(user.age),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json(); // Parse error response
          const errorMessage = errorData?.detail || "Unknown error";

          if (errorMessage.includes("Email")) {
            toast.error(`❌ Email already exists: ${user.email}`);
          } else if (errorMessage.includes("Mobile")) {
            toast.error(`❌ Mobile already exists: ${user.mobile}`);
          } else {
            toast.error(`❌ Failed to add: ${user.email}`);
          }

          setLoading(false);
          return;
        }
      }

      toast.success("✅ Users added successfully!");
      router.push("/admin/user");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="product-add-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Submitting users...</p>
        </div>
      )}

      <h1 className="product-add-heading">Add Users</h1>
      <button type="button" onClick={() => router.push("/admin/user")} className="back-btn">
        ◀ Back
      </button>

      <form onSubmit={handleSubmit}>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead className="product-table-header">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="product-table-row">
                  <td>
                    <input
                      type="text"
                      value={user.first_name}
                      onChange={(e) => handleChange(index, "first_name", e.target.value)}
                      className={`product-input ${errors[index]?.first_name ? "input-error" : ""}`}
                      placeholder="First Name"
                    />
                    {errors[index]?.first_name && <small className="error-text">{errors[index].first_name}</small>}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.last_name}
                      onChange={(e) => handleChange(index, "last_name", e.target.value)}
                      className={`product-input ${errors[index]?.last_name ? "input-error" : ""}`}
                      placeholder="Last Name"
                    />
                    {errors[index]?.last_name && <small className="error-text">{errors[index].last_name}</small>}
                  </td>
                  <td>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => handleChange(index, "email", e.target.value)}
                      className={`product-input ${errors[index]?.email ? "input-error" : ""}`}
                      placeholder="Email"
                    />
                    {errors[index]?.email && <small className="error-text">{errors[index].email}</small>}
                  </td>
                  <td>
                    <input
                      type="password"
                      value={user.password}
                      onChange={(e) => handleChange(index, "password", e.target.value)}
                      className={`product-input ${errors[index]?.password ? "input-error" : ""}`}
                      placeholder="Password"
                    />
                    {errors[index]?.password && <small className="error-text">{errors[index].password}</small>}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.mobile}
                      onChange={(e) => handleChange(index, "mobile", e.target.value)}
                      className={`product-input ${errors[index]?.mobile ? "input-error" : ""}`}
                      placeholder="10-digit number"
                      maxLength={10}
                    />
                    {errors[index]?.mobile && <small className="error-text">{errors[index].mobile}</small>}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.age}
                      onChange={(e) => handleChange(index, "age", e.target.value)}
                      className={`product-input ${errors[index]?.age ? "input-error" : ""}`}
                      placeholder="Age"
                      maxLength={3}
                    />
                    {errors[index]?.age && <small className="error-text">{errors[index].age}</small>}
                  </td>
                  <td>
                    <select
                      value={user.gender}
                      onChange={(e) => handleChange(index, "gender", e.target.value)}
                      className={`product-input ${errors[index]?.gender ? "input-error" : ""}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors[index]?.gender && <small className="error-text">{errors[index].gender}</small>}
                  </td>
                  <td className="text-center">
                    <button type="button" onClick={() => removeRow(index)} className="remove-btn">
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
            + Add User
          </button>
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>
    </div>
  );
}
