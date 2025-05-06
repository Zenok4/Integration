"use client"

import { Home, Users, DollarSign, Calendar, BarChart2, Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, text: "Bảng tổng quát", href: "/" },
    { icon: Users, text: "Quản lý nhân viên", href: "/nhan-vien" },
    { icon: DollarSign, text: "Quản lý lương", href: "/luong" },
    { icon: Calendar, text: "Chấm công & vắng mặt", href: "/cham-cong" },
    { icon: BarChart2, text: "Báo cáo & phân tích", href: "/bao-cao" },
    { icon: Bell, text: "Cảnh báo & thông báo", href: "/thong-bao" },
    { icon: Settings, text: "Cài đặt & phân quyền", href: "/cai-dat" },
  ]

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 h-full bg-slate-800 flex flex-col items-start pt-2.5 flex-shrink-0 overflow-y-auto">
      <div className="flex justify-center items-center mt-5 mb-8 w-full">
        <div className="bg-blue-500 rounded-full p-2">
          <User className="stroke-white" size={40} />
        </div>
      </div>

      {menuItems.map((item) => (
        <Link href={item.href} key={item.href} className="w-full px-4 mb-2">
          <div
            className={`
              flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 gap-3 text-gray-200 cursor-pointer
              ${
                isActive(item.href)
                  ? "bg-blue-600/20 text-white shadow-md border-l-4 border-blue-500"
                  : "hover:bg-slate-700/50 hover:shadow border-l-4 border-transparent"
              }
            `}
          >
            <item.icon size={20} className={isActive(item.href) ? "text-blue-400" : "text-slate-400"} />
            <p className={`text-sm ${isActive(item.href) ? "font-medium text-white" : "text-slate-300"}`}>
              {item.text}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
