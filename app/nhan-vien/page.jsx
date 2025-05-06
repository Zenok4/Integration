"use client"

import Link from "next/link"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function EmployeeList() {
  return (
    <div className="p-5">
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">DANH SÁCH NHÂN VIÊN</h3>
          <Link href="/nhan-vien/them" className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Thêm nhân viên
          </Link>
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
                <th className="table-cell">Lương</th>
                <th className="table-cell">Ngày thuê</th>
                <th className="table-cell">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array(15)
                .fill(0)
                .map((_, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="table-cell">001</td>
                    <td className="table-cell">Nguyễn Văn A</td>
                    <td className="table-cell">20/1/2004</td>
                    <td className="table-cell">Nam</td>
                    <td className="table-cell">0123456789</td>
                    <td className="table-cell">Kế toán</td>
                    <td className="table-cell">Kế toán trưởng</td>
                    <td className="table-cell">20.000.000 ₫</td>
                    <td className="table-cell">19/05/2022</td>
                    <td className="flex items-center justify-around p-5">
                      <Link href={`/nhan-vien/cap-nhat/${index + 1}`} className="btn btn-edit p-2 rounded-full">
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn btn-delete p-2 rounded-full"
                        onClick={() => alert("Bạn có chắc muốn xóa không?")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
