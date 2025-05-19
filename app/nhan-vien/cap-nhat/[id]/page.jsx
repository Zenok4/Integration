"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useDepartments } from "@/app/hooks/get-departments-hook";
import { usePositions } from "@/app/hooks/get-position-hook";
import API from "@/app/services/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateEmployee() {
  const [employeesData, setEmployeesData] = useState({
    id: "",
    full_name: "",
    birth_date: "",
    gender: "",
    department: "",
    position: "",
    phone: "",
    hire_date: "",
  });

  const departments = useDepartments();
  const positions = usePositions();

  const param = useParams();
  const router = useRouter();

  const fetchEmployees = async () => {
    const data = await API.get("/employees/get-employee/" + param?.id);
    if (data)
      setEmployeesData({
        id: data.data.employee_id,
        full_name: data.data.sqlserver.FullName,
        birth_date: data.data.sqlserver.DateOfBirth,
        gender: data.data.sqlserver.Gender,
        department: data.data.sqlserver.DepartmentID,
        position: data.data.sqlserver.PositionID,
        phone: data.data.sqlserver.PhoneNumber,
        hire_date: data.data.sqlserver.HireDate,
      });
  };

  useEffect(() => {
    if (!param) return;
    fetchEmployees();
    console.log("Departments: ", departments);
    console.log("Positions: ", positions);
  }, [param, departments, positions]);

  const convertToDateInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    setEmployeesData({
      ...employeesData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        id: employeesData.id,
        full_name: employeesData.full_name,
        date_of_birth: convertToDDMMYYYY(employeesData.birth_date),
        gender: employeesData.gender,
        department_id: employeesData.department,
        position_id: employeesData.position,
        phone_number: employeesData.phone,
        hire_date: convertToDDMMYYYY(employeesData.hire_date),
      };
      const response = await API.put("/employees/update/" + data.id, data);
      if (response) {
        alert("Cập nhật thành công!");
        router.push("/nhan-vien");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    if (user?.role !== "admin" && user?.role !== "hr_manager") {
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/");
    }
  }, [user]);

  const convertToDDMMYYYY = (dateString) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date)) {
        console.warn(`Invalid date format: ${dateString}`);
        return null;
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Date conversion error:", error);
      return null;
    }
  };

  console.log("EmployeeData: ", employeesData);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="w-full h-10 flex items-center justify-between rounded-lg shadow-md bg-amber-300 mb-4">
        <div className="px-4 h-full flex items-center font-bold">
          <Link
            href="/nhan-vien"
            className="text-purple-900 hover:text-blue-600 transition-colors"
          >
            Danh sách nhân viên
          </Link>
        </div>
      </div>

      <div className="shadow-md w-full bg-white rounded-lg border border-gray-300 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">ID nhân viên</label>
              <input
                type="text"
                name="id"
                readOnly
                defaultValue={employeesData?.id}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select
                id="gender"
                value={employeesData?.gender || "--Chọn Giới Tính--"}
                name="gender"
                className="form-input"
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={employeesData?.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                name="full_name"
                value={employeesData?.full_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phòng ban</label>
              <select
                name="department"
                value={employeesData?.department || ""}
                onChange={handleChange}
                className="form-input"
              >
                <option value="" disabled>
                  -- Chọn Phòng Ban --
                </option>
                {Object.values(departments).map((dept) => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ngày thuê</label>
              <input
                type="date"
                name="hire_date"
                value={convertToDateInput(employeesData?.hire_date)}
                onChange={handleChange}
                className="form-input text-gray-500 italic"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                name="birth_date"
                value={convertToDateInput(employeesData?.birth_date)}
                onChange={handleChange}
                className="form-input text-gray-500 italic"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <select
                name="position"
                value={employeesData?.position || ""}
                onChange={handleChange}
                className="form-input"
              >
                <option value="" disabled>
                  -- Chọn Chức Vụ --
                </option>
                {Object.values(positions).map((pos) => (
                  <option key={pos.PositionID} value={pos.PositionID}>
                    {pos.PositionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="btn-update cursor-pointer transition-colors hover:brightness-95"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
