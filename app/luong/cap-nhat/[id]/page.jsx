"use client"

import Link from "next/link"

export default function UpdateSalary({ params }) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="w-full h-10 flex items-center justify-between rounded-lg shadow-md bg-amber-300 mb-4">
        <div className="px-4 h-full flex items-center font-bold">
          <Link href="/luong" className="text-purple-900 hover:text-blue-600 transition-colors">
            Bảng lương
          </Link>
        </div>
      </div>

      <div className="shadow-md w-full bg-white rounded-lg border border-gray-300 p-6">
        <div className="mb-6">
          <div className="form-group">
            <label className="form-label">ID nhân viên</label>
            <input type="text" placeholder="Nhập ID" className="form-input max-w-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Lương cơ bản</label>
            <input type="text" placeholder="..." className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Thưởng khấu trừ</label>
            <input type="text" placeholder="..." className="form-input text-gray-500 italic" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="form-group">
            <label className="form-label">Khấu trừ</label>
            <input type="text" placeholder="Khấu trừ" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Ngày trả</label>
            <input type="date" placeholder="mm/dd/yy" className="form-input text-gray-500 italic" />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button onClick={() => alert("Cập nhật thành công!")} className="btn-update">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  )
}
