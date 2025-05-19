"use client"
import { ArrowLeft, Gift } from "lucide-react"

// Format currency in VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(Number.parseFloat(amount || 0))
}

export default function NotificationItemDetail({ item, onBack }) {
  // Add default values to prevent errors when item is undefined
  if (!item) {
    return (
      <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto p-6 text-center">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <p>Không có dữ liệu thông báo</p>
      </div>
    )
  }

  // Xác định tiêu đề thông báo dựa trên loại cảnh báo
  const getNotificationTitle = () => {
    switch (item.alert_type) {
      case "leave_exceed":
        return "Cảnh báo vượt quá ngày nghỉ phép"
      case "salary_discrepancy":
        return "Cảnh báo sai lệch lương"
      case "payroll":
        return `Thông báo lương tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`
      case "anniversary":
        return item.Title || `Chúc mừng kỷ niệm ngày vào công ty`
      default:
        return "Thông báo mới"
    }
  }

  // Render nội dung thông báo dựa trên loại cảnh báo
  const renderNotificationContent = () => {
    switch (item.alert_type) {
      case "leave_exceed":
        return renderLeaveExceedContent()
      case "salary_discrepancy":
        return renderSalaryDiscrepancyContent()
      case "payroll":
        return renderPayrollContent()
      case "anniversary":
        return renderAnniversaryContent()
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p>{item.details || "Không có chi tiết thông báo"}</p>
          </div>
        )
    }
  }

  // Nội dung thông báo vượt quá ngày nghỉ phép
  const renderLeaveExceedContent = () => {
    return (
      <div className="bg-yellow-50 p-5 rounded-lg mb-6 border border-yellow-200">
        <h3 className="text-lg font-medium mb-4 text-yellow-800">Cảnh báo vượt quá ngày nghỉ phép</h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-yellow-200">
            <span className="text-gray-700">Nhân viên:</span>
            <span className="font-medium">{item.FullName || item.sqlserver_info?.FullName || "N/A"}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-yellow-200">
            <span className="text-gray-700">Mã nhân viên:</span>
            <span className="font-medium">
              {item.employee_id || item.EmployeeID || item.sqlserver_info?.EmployeeID || "N/A"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-yellow-200">
            <span className="text-gray-700">Phòng ban:</span>
            <span className="font-medium">
              {item.DepartmentName ||
                (item.sqlserver_info?.DepartmentID
                  ? getDepartmentName(item.sqlserver_info.DepartmentID)
                  : "Chưa có phòng ban")}
            </span>
          </div>

          <div className="bg-yellow-100 p-4 rounded-md mt-4">
            <p className="text-yellow-800 font-medium">
              {item.details || "Nhân viên đã vượt quá số ngày nghỉ phép cho phép"}
            </p>
            <p className="mt-2 text-gray-700">Vui lòng liên hệ với phòng Nhân sự để biết thêm chi tiết.</p>
          </div>
        </div>
      </div>
    )
  }

  // Nội dung thông báo sai lệch lương
  const renderSalaryDiscrepancyContent = () => {
    return (
      <div className="bg-red-50 p-5 rounded-lg mb-6 border border-red-200">
        <h3 className="text-lg font-medium mb-4 text-red-800">Cảnh báo sai lệch lương</h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-red-200">
            <span className="text-gray-700">Nhân viên:</span>
            <span className="font-medium">{item.FullName || item.sqlserver_info?.FullName || "N/A"}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-red-200">
            <span className="text-gray-700">Mã nhân viên:</span>
            <span className="font-medium">
              {item.employee_id || item.EmployeeID || item.sqlserver_info?.EmployeeID || "N/A"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-red-200">
            <span className="text-gray-700">Lương cơ bản:</span>
            <span className="font-medium">{formatCurrency(item.BaseSalary || "0")}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-red-200">
            <span className="text-gray-700">Lương thực nhận:</span>
            <span className="font-medium">{formatCurrency(item.NetSalary || "0")}</span>
          </div>

          <div className="bg-red-100 p-4 rounded-md mt-4">
            <p className="text-red-800 font-medium">
              {item.details || "Chênh lệch giữa lương dự kiến và lương đã trả"}
            </p>
            <p className="mt-2 text-gray-700">Vui lòng liên hệ với phòng Kế toán để kiểm tra và điều chỉnh.</p>
          </div>
        </div>
      </div>
    )
  }

  // Nội dung thông báo lương
  const renderPayrollContent = () => {
    // Safely access nested properties
    const salaryMonth = new Date()
    const formattedSalaryMonth = salaryMonth.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    })

    return (
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4">Bảng lương tháng {formattedSalaryMonth}</h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Lương cơ bản:</span>
            <span className="font-medium">{formatCurrency(item.BaseSalary || "0")}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Thưởng:</span>
            <span className="font-medium text-green-600">{formatCurrency(item.Bonus || "0")}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Các khoản khấu trừ:</span>
            <span className="font-medium text-red-600">-{formatCurrency(item.Deductions || "0")}</span>
          </div>

          <div className="flex justify-between py-3 font-bold">
            <span>Lương thực nhận:</span>
            <span>{formatCurrency(item.NetSalary || "0")}</span>
          </div>
        </div>
      </div>
    )
  }

  // Cập nhật phần renderAnniversaryContent để hiển thị thông tin kỷ niệm chính xác hơn
  const renderAnniversaryContent = () => {
    // Calculate years of service
    const yearsOfService = item.yearsOfService || calculateYearsOfService(item.AnniversaryDate)

    // Format anniversary date
    const anniversaryDate = item.AnniversaryDate
      ? new Date(item.AnniversaryDate).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : item.sqlserver_info?.HireDate
        ? new Date(item.sqlserver_info.HireDate).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "N/A"

    // Format notification date
    const notificationDate = item.CreatedAt
      ? new Date(item.CreatedAt).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "N/A"

    return (
      <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <Gift className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-blue-800">Chúc mừng kỷ niệm {yearsOfService} năm làm việc!</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-blue-200">
            <span className="text-gray-700">Nhân viên:</span>
            <span className="font-medium">{item.FullName || item.sqlserver_info?.FullName || "N/A"}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-blue-200">
            <span className="text-gray-700">Mã nhân viên:</span>
            <span className="font-medium">{item.EmployeeID || item.sqlserver_info?.EmployeeID || "N/A"}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-blue-200">
            <span className="text-gray-700">Ngày vào công ty:</span>
            <span className="font-medium">{anniversaryDate}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-blue-200">
            <span className="text-gray-700">Số năm công tác:</span>
            <span className="font-medium">{yearsOfService} năm</span>
          </div>

          <div className="flex justify-between py-2 border-b border-blue-200">
            <span className="text-gray-700">Thời gian gửi thông báo:</span>
            <span className="font-medium">{notificationDate}</span>
          </div>

          <div className="bg-blue-100 p-4 rounded-md mt-4">
            <p className="text-blue-800 font-medium">
              {item.Message || `Chúc mừng ${yearsOfService} năm gắn bó với công ty!`}
            </p>
            {yearsOfService >= 5 && (
              <p className="mt-2 text-gray-700">
                Cảm ơn vì những đóng góp quý báu của bạn trong suốt thời gian qua. Chúc bạn tiếp tục thành công trong
                công việc!
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="border-b p-4 flex items-center">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Chi tiết thông báo</h1>
      </div>

      {/* Email header */}
      <div className="p-6 border-b">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">{getNotificationTitle()}</h2>
          <div className="text-sm text-gray-600">
            <div>
              Từ: <span className="font-medium">Phòng Nhân sự</span>{" "}
              <span className="text-gray-500">&lt;hr@company.com&gt;</span>
            </div>
            <div>
              Ngày gửi:{" "}
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString("vi-VN")
                : item.CreatedAt
                  ? new Date(item.CreatedAt).toLocaleDateString("vi-VN")
                  : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Email content */}
      <div className="p-6">
        <div className="mb-6">
          <p className="mb-4">Kính gửi {item.FullName || item.sqlserver_info?.FullName || "Quý nhân viên"},</p>
        </div>

        {/* Render content based on alert type */}
        {renderNotificationContent()}

        <div className="mt-8">
          <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với phòng Nhân sự.</p>
          <p className="mt-4">Trân trọng,</p>
          <p className="font-medium">Phòng Nhân sự</p>
          <p>Công ty ABC</p>
        </div>
      </div>
    </div>
  )
}
