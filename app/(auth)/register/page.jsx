"use client";

import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    date_of_birth: "",
    phone_number: "",
    hire_date: "",
    department_id: "",
    position_id: "",
    gender: "",
  });

  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/create-user", {
        ...form,
        date_of_birth: formatDate(form.date_of_birth),
        hire_date: formatDate(form.hire_date),
      });
      router.push("/login");
    } catch (err) {
      alert("Register failed");
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <input name="full_name" onChange={handleChange} placeholder="Full Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="phone_number" onChange={handleChange} placeholder="Phone" />
      <input name="gender" onChange={handleChange} placeholder="Gender" />
      <input type="date" name="date_of_birth" onChange={handleChange} />
      <input type="date" name="hire_date" onChange={handleChange} />
      <input name="department_id" onChange={handleChange} placeholder="Department ID" />
      <input name="position_id" onChange={handleChange} placeholder="Position ID" />
      <button type="submit">Register</button>
    </form>
  );
}
