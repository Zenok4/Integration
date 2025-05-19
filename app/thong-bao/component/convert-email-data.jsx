// Hàm chuyển đổi DepartmentID thành tên phòng ban
const getDepartmentName = (departmentId) => {
    const departments = {
      1: "Phòng Nhân sự",
      2: "Phòng Kế toán",
      3: "Phòng Kinh doanh",
      4: "Phòng Kỹ thuật",
      5: "Phòng Marketing",
      6: "Phòng Hành chính",
      7: "Phòng Chăm sóc khách hàng",
      8: "Ban Giám đốc",
    }
  
    return departments[departmentId] || `Phòng ${departmentId}`
  }
  
  // Hàm để tạo email từ tên nhân viên nếu không có email
  const getEmailFromName = (fullName) => {
    if (!fullName) return "employee@example.com"
    return `${fullName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w\s]/gi, "")}@example.com`
  }
  
  // Helper function to convert notification data to email format
  export default function ConvertEmailData(notifications) {
    if (!notifications || !Array.isArray(notifications)) {
      return []
    }
  
    return notifications.map((notification) => {
      // Xác định tiêu đề dựa trên loại cảnh báo
      let title = "Thông báo mới"
      switch (notification?.alert_type) {
        case "leave_exceed":
          title = "Cảnh báo vượt quá ngày nghỉ phép"
          break
        case "salary_discrepancy":
          title = "Cảnh báo sai lệch lương"
          break
        case "payroll":
          title = `Thông báo lương tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`
          break
        case "anniversary":
          title = notification?.Title || "Chúc mừng kỷ niệm ngày vào công ty"
          break
        default:
          title = notification?.Title || "Thông báo mới"
      }
  
      // Xác định nội dung xem trước dựa trên loại cảnh báo
      let preview = ""
      if (notification?.alert_type === "anniversary") {
        preview = notification?.Message || "Chúc mừng kỷ niệm ngày vào công ty!"
      } else if (notification?.alert_type === "leave_exceed") {
        preview = "Nhân viên vượt quá số ngày nghỉ phép năm"
      } else if (notification?.alert_type === "salary_discrepancy") {
        preview = "Chênh lệch giữa lương dự kiến và lương đã trả"
      } else if (notification?.alert_type === "payroll") {
        preview = `Thiếu dữ liệu bảng lương tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`
      } else {
        preview = notification.details || "Không có nội dung xem trước"
      }
  
      // Đảm bảo có email
      const email =
        notification.Email ||
        (notification.sqlserver_info ? notification.sqlserver_info.Email : null) ||
        getEmailFromName(
          notification.FullName || (notification.sqlserver_info ? notification.sqlserver_info.FullName : null),
        )
  
      return {
        NotificationID: notification.NotificationID || notification.id,
        sender: "Phòng Nhân sự",
        email: "hr@company.com",
        Email: email,
        title: title,
        preview: preview,
        time: notification.created_at
          ? new Date(notification.created_at).toLocaleString("vi-VN")
          : notification.CreatedAt
            ? new Date(notification.CreatedAt).toLocaleString("vi-VN")
            : new Date().toLocaleString("vi-VN"),
        // Copy all original properties
        ...notification,
      }
    })
  }
  