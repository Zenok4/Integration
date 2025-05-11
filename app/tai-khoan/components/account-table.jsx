"use client"

import { Pencil, Trash2, Shield } from "lucide-react"
import { formatDate, getRoleName, getStatusName } from "../utils/account-utils"

export default function AccountTable({ accounts, onEdit, onDelete, onRole }) {
  return (
    <div className="overflow-y-auto max-h-[590px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="table-header">
            <th className="table-cell">ID</th>
            <th className="table-cell">Tên đăng nhập</th>
            <th className="table-cell">Họ tên</th>
            <th className="table-cell">Email</th>
            <th className="table-cell">Vai trò</th>
            <th className="table-cell">Giới tính</th>
            <th className="table-cell">Số điện thoại</th>
            <th className="table-cell">Ngày tạo</th>
            <th className="table-cell">Trạng thái</th>
            <th className="table-cell">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b hover:bg-slate-50 transition-colors">
              <td className="table-cell">{account?.id}</td>
              <td className="table-cell">{account?.username}</td>
              <td className="table-cell">{account?.FullName}</td>
              <td className="table-cell">{account?.email}</td>
              <td className="table-cell">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : account.role === "hr_manager"
                        ? "bg-blue-100 text-blue-800"
                        : account.role === "payroll_manager"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {getRoleName(account.role)}
                </span>
              </td>
              <td className="table-cell">{account.employee_details?.Gender || "N/A"}</td>
              <td className="table-cell">{account.employee_details?.PhoneNumber || "N/A"}</td>
              <td className="table-cell">{formatDate(account.created_at)}</td>
              <td className="table-cell">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.Status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {getStatusName(account.Status)}
                </span>
              </td>
              <td className="flex items-center justify-around p-5">
                <button className="btn btn-edit p-2 rounded-full" onClick={() => onEdit(account)}>
                  <Pencil size={16} />
                </button>
                <button className="btn bg-blue-600 p-2 rounded-full" onClick={() => onRole(account)}>
                  <Shield size={16} />
                </button>
                <button className="btn btn-delete p-2 rounded-full" onClick={() => onDelete(account)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center py-4 text-slate-500">
                Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
