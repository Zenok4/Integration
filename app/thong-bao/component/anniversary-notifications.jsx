"use client"
import { Gift } from "lucide-react"

export default function AnniversaryNotifications({ notifications = [], error = null, onSelect }) {
  // Calculate years of service based on anniversary date
  const calculateYearsOfService = (anniversaryDate) => {
    if (!anniversaryDate) return 0

    const hireDate = new Date(anniversaryDate)
    const today = new Date()
    let years = today.getFullYear() - hireDate.getFullYear()

    // Adjust if anniversary hasn't occurred yet this year
    if (
      today.getMonth() < hireDate.getMonth() ||
      (today.getMonth() === hireDate.getMonth() && today.getDate() < hireDate.getDate())
    ) {
      years--
    }

    return years
  }

  // Get badge color based on years of service
  const getBadgeColor = (years) => {
    if (years >= 10) return "bg-purple-100 text-purple-800"
    if (years >= 5) return "bg-blue-100 text-blue-800"
    if (years >= 3) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  // Format anniversary date
  const formatAnniversaryDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format notification date
  const formatNotificationDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Hàm để tạo email từ tên nhân viên nếu không có email
  const getEmailFromName = (fullName) => {
    if (!fullName) return "employee@example.com"
    return `${fullName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w\s]/gi, "")}@example.com`
  }

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {error && <li className="px-4 py-4 text-center text-red-500">{error}</li>}

        {!error && notifications && notifications.length > 0
          ? notifications.map((item) => {
              const yearsOfService = item?.yearsOfService || calculateYearsOfService(item?.AnniversaryDate)
              const email =
                item?.Email || (item?.sqlserver_info ? item?.sqlserver_info?.Email : getEmailFromName(item?.FullName))

              // Tạo key duy nhất cho mỗi item
              const key = item?.NotificationID ? `${item.NotificationID}` : `${item?.FullName || ''}-${item?.CreatedAt || Math.random()}`

              return (
                <li
                  key={key}
                  className="flex items-center px-4 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelect(item)}
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Gift icon */}
                  <div className="mr-4">
                    <Gift className="h-5 w-5 text-blue-500" />
                  </div>

                  {/* Employee info */}
                  <div className="text-sm text-gray-700 min-w-[220px] mr-6">
                    <div className="font-medium">{item?.FullName || "Nhân viên"}</div>
                    <div className="text-gray-500">{email}</div>
                  </div>

                  {/* Anniversary content */}
                  <div className="flex-1 flex flex-col justify-center mr-6">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        {item?.Title || `Kỷ niệm ${yearsOfService} năm làm việc`}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(yearsOfService)}`}>
                        {yearsOfService} năm
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Ngày vào công ty: {formatAnniversaryDate(item?.AnniversaryDate)}
                    </div>
                    <div className="text-sm text-gray-500">{item?.Message || "Chúc mừng ngày vào công ty!"}</div>
                  </div>

                  {/* Notification date */}
                  <div className="text-xs text-gray-400 whitespace-nowrap min-w-[100px] text-right">
                    {formatNotificationDate(item?.CreatedAt)}
                  </div>
                </li>
              )
            })
          : !error && <li className="px-4 py-4 text-center text-gray-500">Không có thông báo kỷ niệm nào</li>}
      </ul>
    </div>
  )
}
