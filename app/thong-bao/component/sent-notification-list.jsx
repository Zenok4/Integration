"use client"

export default function SentNotificationList({ notifications = [], onSelect }) {
  // Hàm để tạo tiêu đề thông báo dựa trên loại cảnh báo
  const getNotificationTitle = (item) => {
    return item.message || item.details || item.title || "Thông báo mới"
  }

  // Hàm để xác định màu sắc cho từng loại thông báo
  const getNotificationColor = (alertType) => {
    switch (alertType) {
      case "leave_exceed":
        return "bg-yellow-500"
      case "salary_discrepancy":
        return "bg-red-500"
      case "payroll":
        return "bg-green-500"
      case "anniversary":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Hàm để tạo email từ tên nhân viên nếu không có email
  const getEmailFromName = (fullName) => {
    if (!fullName) return "employee@example.com"
    return `${fullName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w\s]/gi, "")}@example.com`
  }

  // Hàm để lấy nội dung xem trước dựa trên loại thông báo
  const getPreviewContent = (item) => {
    if (item.alert_type === "anniversary") {
      return item.Message || "Chúc mừng kỷ niệm ngày vào công ty!"
    } else if (item.alert_type === "leave_exceed") {
      return "Nhân viên vượt quá số ngày nghỉ phép năm"
    } else if (item.alert_type === "salary_discrepancy") {
      return "Chênh lệch giữa lương dự kiến và lương đã trả"
    } else if (item.alert_type === "payroll") {
      return `Thiếu dữ liệu bảng lương tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`
    }
    return item.details || "Xem chi tiết thông báo"
  }

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {notifications && notifications.length > 0 ? (
          notifications.map((item) => {
            // Lấy email từ thông tin nhân viên
            const email =
              item.Email || (item.sqlserver_info ? item.sqlserver_info.Email : getEmailFromName(item.FullName))

            return (
              <li
                key={item.NotificationID ? `${item.NotificationID}` : `${item.FullName || ''}-${item.CreatedAt || Math.random()}`}
                className="flex items-center px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0 mr-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()} // Prevent onSelect when clicking checkbox
                  />
                </div>

                {/* Notification indicator */}
                <div className="mr-4">
                  <span className={`flex h-3 w-3 rounded-full ${getNotificationColor(item.alert_type)}`}></span>
                </div>

                {/* Recipient info */}
                <div className="text-sm text-gray-700 min-w-[220px] mr-6">
                  <div className="font-medium">Đến: {email}</div>
                  <div className="text-xs text-gray-500">
                    {item.TargetType === "all" ? "Tất cả nhân viên" : "Cá nhân"}
                  </div>
                </div>

                {/* Notification content (title + preview) */}
                <div className="flex-1 flex flex-col justify-center mr-6">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {getNotificationTitle(item)} - {item.FullName || item.sqlserver_info?.FullName || "Người nhận"}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{getPreviewContent(item)}</div>
                </div>

                {/* Sent date */}
                <div className="text-xs text-gray-400 whitespace-nowrap min-w-[100px] text-right">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("vi-VN")
                    : item.CreatedAt
                      ? new Date(item.CreatedAt).toLocaleDateString("vi-VN")
                      : ""}
                </div>
              </li>
            )
          })
        ) : (
          <li className="px-4 py-4 text-center text-gray-500">Không có thông báo nào</li>
        )}
      </ul>
    </div>
  )
}
