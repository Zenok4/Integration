"use client";

import Link from "next/link";
import API from "@/app/services/api";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function UpdateSalaryClient(props) {
  const router = useRouter();
  const params = useParams();
  const id = props.id || params.id;
  const [form, setForm] = useState({
    employee_id: "",
    base_salary: "",
    bonus: "",
    deductions: "",
    salary_month: "",
  });

  useEffect(() => {
    if (id) fetchPayroll();
  }, [id]);

  const fetchPayroll = async () => {
    try {
      const res = await API.get("/salaries");
      if (res.data && Array.isArray(res.data.payroll)) {
        const payroll = res.data.payroll.find((p) => p.SalaryID == id);
        if (payroll) {
          setForm({
            employee_id: payroll.EmployeeID,
            base_salary: payroll.BaseSalary,
            bonus: payroll.Bonus,
            deductions: payroll.Deductions,
            salary_month: convertToDateInput(payroll.SalaryMonth),
          });
        }
      }
    } catch {
      alert("Không thể lấy dữ liệu lương.");
    }
  };

  console.log("Form:", form);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put("/salaries/update-payroll", {
        salary_id: id,
        employee_id: form.employee_id,
        base_salary: parseFloat(form.base_salary),
        bonus: parseFloat(form.bonus),
        deductions: parseFloat(form.deductions),
        salary_month: form.salary_month,
      });
      alert("Cập nhật thành công!");
      router.push("/luong");
    } catch {
      alert("Cập nhật thất bại!");
    }
  };

  const convertToDateInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
    <div className="p-4 max-w-6xl mx-auto">
      <div className="w-full h-10 flex items-center justify-between rounded-lg shadow-md bg-amber-300 mb-4">
        <div className="px-4 h-full flex items-center font-bold">
          <Link
            href="/luong"
            className="text-purple-900 hover:text-blue-600 transition-colors"
          >
            Bảng lương
          </Link>
        </div>
      </div>

      <div className="shadow-md w-full bg-white rounded-lg border border-gray-300 p-6">
        <div className="mb-6">
          <label className="form-label mr-4">ID nhân viên</label>
          <input
            type="text"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            className="form-input max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Lương cơ bản</label>
            <input
              name="base_salary"
              value={form.base_salary}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Thưởng</label>
            <input
              name="bonus"
              value={form.bonus}
              onChange={handleChange}
              className="form-input text-gray-500 italic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="form-label">Khấu trừ</label>
            <input
              name="deductions"
              value={form.deductions}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Ngày trả</label>
            <input
              type="date"
              name="salary_month"
              value={form.salary_month}
              onChange={handleChange}
              className="form-input text-gray-500 italic"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button onClick={handleUpdate} className="btn-update">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
