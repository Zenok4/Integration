"use client"

import { Search, Filter } from "lucide-react"
import { roles, statuses, getRoleName, getStatusName } from "../utils/account-utils"

export default function AccountFilters({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  filterDepartment,
  setFilterDepartment,
}) {
  const resetFilters = () => {
    setSearchTerm("")
    setFilterRole("")
    setFilterStatus("")
    setFilterDepartment("")
  }

  return (
    <div className="p-5 border-b border-slate-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-40">
            <select className="form-input" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {getRoleName(role)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusName(status)}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn bg-slate-200 text-slate-800 hover:bg-slate-300 flex items-center gap-1"
            onClick={resetFilters}
          >
            <Filter size={16} />
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  )
}
