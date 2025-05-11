"use client"

import { roles, getRoleName } from "../utils/account-utils"

export default function RoleModal({ show, onClose, onUpdate, account, setAccount }) {
  if (!show || !account) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(e)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Phân quyền tài khoản</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-slate-600 mb-2">
                Phân quyền cho tài khoản <span className="font-semibold">{account.username}</span> ({account.FullName})
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
              <select
                className="form-input"
                value={account.role}
                onChange={(e) => setAccount({ ...account, role: e.target.value })}
                required
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleName(role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500">
                <span className="font-medium">Quản trị viên (admin):</span> Toàn quyền quản lý hệ thống
                <br />
                <span className="font-medium">Quản lý (manager):</span> Quản lý nhân viên, lương, chấm công
                <br />
                <span className="font-medium">Nhân viên (employee):</span> Xem thông tin cá nhân, chấm công
              </p>
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
              Cập nhật quyền
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
