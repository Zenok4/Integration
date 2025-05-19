"use client";

import ConfirmDialog from "@/app/components/confirmDialog";
import { useAuth } from "@/app/context/AuthContext";
import { useDepartments } from "@/app/hooks/get-departments-hook";
import { usePositions } from "@/app/hooks/get-position-hook";
import API from "@/app/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    department_id: "",
    position_id: "",
    hire_date: "",
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {user} = useAuth();

  const router = useRouter();

  const departments = useDepartments();
  const positions = usePositions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if(!user) return;
    if(user?.role !== "admin" && user?.role !== "hr_manager") {
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({formData});
    const response = await API.post("/employees/add-employee", formData);
    if (response.status === 200) {
      router.push("/nhan-vien");
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsDialogOpen(false);
    router.push("/nhan-vien");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="w-full h-12 flex items-center justify-center rounded-lg shadow-md bg-amber-300 mb-6">
        <Link
          href="/nhan-vien"
          className="text-purple-900 hover:text-blue-600 transition-colors font-semibold"
        >
          Danh sách nhân viên
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              >
                <option value="" disabled>
                  --Chọn giới tính--
                </option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div className="form-group pt-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức vụ
              </label>
              <select
                name="position_id"
                value={formData.position_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            {/* Empty placeholder to maintain alignment */}
            <div className="form-group h-[84px]"></div>
          </div>

          {/* Third Column */}
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày thuê
              </label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            {/* Empty placeholder to maintain alignment */}
            <div className="form-group h-[84px]"></div>
          </div>
        </form>

        <div className="flex justify-end gap-4 mt-8">
          <div className="w-[200px] h-full flex items-center justify-between">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn-save cursor-pointer"
            >
              Lưu lại
            </button>
            <button
              onClick={handleCancel}
              className="btn-cancel cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn hủy bỏ không?"
      />
    </div>
  );
}
