"use client"

import Link from "next/link"

export default function UpdateEmployee({ params }) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="w-full h-10 flex items-center justify-between rounded-lg shadow-md bg-amber-300 mb-4">
        <div className="px-4 h-full flex items-center font-bold">
          <Link href="/nhan-vien" className="text-purple-900 hover:text-blue-600 transition-colors">
            Danh sách nhân viên
          </Link>
        </div>
      </div>

      <div className="shadow-md w-full bg-white rounded-lg border border-gray-300 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">ID nhân viên</label>
              <input type="text" defaultValue="001" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select id="gender" name="gender" className="form-input">
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="text" defaultValue="0123456789" className="form-input" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Họ tên</label>
              <input type="text" defaultValue="Nguyễn Văn A" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Phòng ban</label>
              <input type="text" defaultValue="Kế toán" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Lương</label>
              <input type="text" defaultValue="20000000" className="form-input" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input type="date" defaultValue="2004-01-20" className="form-input text-gray-500 italic" />
            </div>

            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <input type="text" defaultValue="Kế toán trưởng" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Ngày thuê</label>
              <input type="date" defaultValue="2022-05-19" className="form-input text-gray-500 italic" />
            </div>
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
