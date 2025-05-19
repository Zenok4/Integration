"use client";

import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { formatDate } from "../tai-khoan/utils/account-utils";
import { useDepartments } from "../hooks/get-departments-hook";
import { usePositions } from "../hooks/get-position-hook";
import { useAuth } from "../context/AuthContext";

export default function EmployeeList() {
  const [employeesData, setEmployeesData] = useState([]);

  const departments = useDepartments();
  const positions = usePositions();
  const { user } = useAuth();

  const fetchEmployees = async () => {
    const data = await API.get("/employees");
    console.log(data.data);
    if (data) setEmployeesData(data?.data?.employees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getDepartmentName = (departmentId) => {
    if (departments[departmentId]) {
      return departments[departmentId].DepartmentName;
    }
    return "";
  };

  /**
   * Lấy tên chức vụ từ position_id
   */
  const getPositionName = (positionId) => {
    if (positions[positionId]) {
      return positions[positionId].PositionName;
    }
    return "";
  };

  const handleDelete = async (id) => {
    try {
      const response = await API.delete("/employees/delete-employee", {
        params: { employee_id: id },
      });

      if (response) {
        alert("Xóa thành công!");
        fetchEmployees();
      }
    } catch (error) {
      console.log(error);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="p-5">
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            DANH SÁCH NHÂN VIÊN
          </h3>
          {((user && user?.role === "admin") ||
            user?.role === "hr_manager") && (
            <Link
              href="/nhan-vien/them"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              Thêm nhân viên
            </Link>
          )}
        </div>

        <div className="overflow-y-auto max-h-[590px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header">
                <th className="table-cell">ID</th>
                <th className="table-cell">Họ tên</th>
                <th className="table-cell">Ngày sinh</th>
                <th className="table-cell">Giới tính</th>
                <th className="table-cell">Số điện thoại</th>
                <th className="table-cell">Phòng ban</th>
                <th className="table-cell">Chức vụ</th>
                <th className="table-cell">Ngày thuê</th>
                {(user?.role === "admin" || user?.role === "hr_manager") && (
                  <th className="table-cell">Hành động</th>
                )}
              </tr>
            </thead>
            <tbody>
              {employeesData.map((employee, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="table-cell">{employee?.employee_id}</td>
                  <td className="table-cell">
                    {employee?.sqlserver?.FullName}
                  </td>
                  <td className="table-cell">
                    {formatDate(employee?.sqlserver?.DateOfBirth)}
                  </td>
                  <td className="table-cell">{employee?.sqlserver?.Gender}</td>
                  <td className="table-cell">
                    {employee?.sqlserver?.PhoneNumber}
                  </td>
                  <td className="table-cell">
                    {getDepartmentName(employee?.sqlserver?.DepartmentID)}
                  </td>
                  <td className="table-cell">
                    {getPositionName(employee?.sqlserver?.PositionID)}
                  </td>
                  <td className="table-cell">
                    {formatDate(employee?.sqlserver?.PositionID)}
                  </td>
                  {(user?.role === "admin" || user?.role === "hr_manager") && (
                    <td className="flex items-center justify-around p-5">
                      <Link
                        href={`/nhan-vien/cap-nhat/${employee?.employee_id}`}
                        className="btn btn-edit p-2 rounded-full"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn btn-delete p-2 rounded-full"
                        onClick={() => handleDelete(employee?.employee_id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
