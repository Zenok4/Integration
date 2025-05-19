"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/services/api";
import { useAuth } from "@/app/context/AuthContext";

export default function AddSalary() {
  const router = useRouter();
  const [form, setForm] = useState({
    employee_id: "",
    base_salary: "",
    bonus: "",
    deductions: "",
    salary_month: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Lấy danh sách nhân viên khi load trang
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      if (res) {
        setEmployees(res.data.employees);
      }
    } catch {
      setEmployees([]);
    }
  };

  console.log(employees);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const netSalary =
        parseFloat(form.base_salary || 0) +
        parseFloat(form.bonus || 0) -
        parseFloat(form.deductions || 0);
      await API.post("/salaries/add-payroll", {
        employee_id: form.employee_id,
        salary_month: form.salary_month,
        base_salary: parseFloat(form.base_salary),
        bonus: parseFloat(form.bonus),
        deductions: parseFloat(form.deductions),
        net_salary: netSalary,
      });
      setSuccess("Thêm bảng lương thành công!");
      setForm({
        employee_id: "",
        base_salary: "",
        bonus: "",
        deductions: "",
        salary_month: "",
      });
      setTimeout(() => router.push("/luong"), 1000);
    } catch {
      setError("Thêm bảng lương thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    if (user?.role !== "admin" && user?.role !== "payroll_manager") {
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/");
    }
  }, [user]);

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <div className="w-full h-10 flex items-center justify-between rounded-lg shadow-md bg-amber-300 mb-4">
        <Link
          href="/luong"
          className="text-purple-900 hover:text-blue-600 font-bold px-4"
        >
          Bảng lương
        </Link>
      </div>
      <form
        onSubmit={handleAdd}
        className="bg-white shadow-md rounded-lg border border-gray-300 p-6"
      >
        <h2 className="text-lg font-bold mb-4">Thêm bảng lương</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Tên nhân viên</label>
            <select
              className="form-input w-full"
              value={form.employee_id}
              name="employee_id"
              onChange={handleChange}
            >
              <option value="" disabled>
                -- Chọn nhân viên --
              </option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.sqlserver.FullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">ID nhân viên</label>
            <input
              type="text"
              name="employee_id"
              value={form.employee_id}
              className="form-input w-full"
              disabled
            />
          </div>
          <div>
            <label className="form-label">Lương cơ bản</label>
            <input
              type="text"
              name="base_salary"
              value={form.base_salary}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="form-label">Thưởng</label>
            <input
              type="text"
              name="bonus"
              value={form.bonus}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>
          <div>
            <label className="form-label">Khấu trừ</label>
            <input
              type="text"
              name="deductions"
              value={form.deductions}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>
          <div>
            <label className="form-label">Ngày trả</label>
            <input
              type="date"
              name="salary_month"
              value={form.salary_month}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-8 gap-4">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
          <Link href="/luong" className="btn-cancel">
            Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}
