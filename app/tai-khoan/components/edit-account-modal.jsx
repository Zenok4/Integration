"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { roles, statuses, genders, getRoleName, getStatusName } from "../utils/account-utils"

export default function EditAccountModal({ show, onClose, onUpdate, currentAccount, setCurrentAccount }) {
  const [showPassword, setShowPassword] = useState(false)

  if (!show || !currentAccount) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(e)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Chỉnh sửa tài khoản</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
                <input type="text" className="form-input bg-slate-100" value={currentAccount.username} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentAccount.FullName}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, FullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={currentAccount.email}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-input"
                  value={currentAccount.PhoneNumber}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, PhoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                <select
                  className="form-input"
                  value={currentAccount.Gender}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, Gender: e.target.value })}
                  required
                >
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  className="form-input"
                  value={currentAccount.DateOfBirth}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, DateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày vào làm</label>
                <input
                  type="date"
                  className="form-input"
                  value={currentAccount.HireDate}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, HireDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
                <select
                  className="form-input"
                  value={currentAccount.role}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, role: e.target.value })}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {getRoleName(role)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select
                  className="form-input"
                  value={currentAccount.Status}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, Status: e.target.value })}
                  required
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusName(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu mới (để trống nếu không đổi)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input pr-10"
                    value={currentAccount.password}
                    onChange={(e) => setCurrentAccount({ ...currentAccount, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
