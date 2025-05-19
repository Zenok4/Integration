// Danh sách phòng ban
export const departments = [
  { id: 1, name: "Ban Giám đốc" },
  { id: 2, name: "Nhân sự" },
  { id: 3, name: "Kế toán" },
  { id: 4, name: "Kỹ thuật" },
  { id: 5, name: "Marketing" },
  { id: 6, name: "Kinh doanh" },
  { id: 7, name: "Hành chính" },
];

// Danh sách chức vụ (dạng object có id)
export const positions = [
  { id: 1, name: "Trưởng phòng" },
  { id: 2, name: "Phó phòng" },
  { id: 4, name: "Nhân viên" },
];

// Các hằng số và hàm helper khác giữ nguyên
export const roles = ["admin", "hr_manager", "payroll_manager", "employee"];
export const statuses = ["active", "inactive"];
export const genders = ["Nam", "Nữ", "Khác"];

export const getRoleName = (role) => {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "hr_manager":
      return "Quản lý nhân sự";
    case "payroll_manager":
      return "Quản lý lương";
    case "employee":
      return "Nhân viên";
    default:
      return role;
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return status;
  }
};

// Hàm định dạng ngày từ chuỗi GMT thành định dạng ngày tháng năm
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// Hàm định dạng ngày từ chuỗi GMT thành định dạng yyyy-MM-dd cho input type="date"
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Dữ liệu mẫu - cập nhật vai trò finance_manager thành payroll_manager
export const sampleAccounts = [
  {
    id: 1,
    username: "Employee1",
    FullName: "Lê Trung Dũng",
    email: "test120@gmail.com",
    role: "employee",
    Status: "active",
    created_at: "Tue, 06 May 2025 22:12:55 GMT",
    employee_id: 12,
    DepartmentID: null,
    PositionID: null,
    employee_details: {
      EmployeeID: 12,
      FullName: "Lê Trung Dũng",
      Email: "test120@gmail.com",
      PhoneNumber: "0396892906",
      Gender: "Nam",
      DateOfBirth: "Sat, 05 Apr 2025 00:00:00 GMT",
      HireDate: "Sat, 05 Jul 2025 00:00:00 GMT",
      Status: "active",
      DepartmentID: null,
      PositionID: null,
    },
  },
  {
    id: 2,
    username: "admin",
    FullName: "admin",
    email: "admin@gmail.com",
    role: "admin",
    Status: "active",
    created_at: "Tue, 06 May 2025 22:22:39 GMT",
    employee_id: 13,
    DepartmentID: null,
    PositionID: null,
    employee_details: {
      EmployeeID: 13,
      FullName: "admin",
      Email: "admin@gmail.com",
      PhoneNumber: "0396892906",
      Gender: "Nam",
      DateOfBirth: "Sat, 05 Apr 2025 00:00:00 GMT",
      HireDate: "Fri, 05 Sep 2025 00:00:00 GMT",
      Status: "active",
      DepartmentID: null,
      PositionID: null,
    },
  },
  {
    id: 3,
    username: "hrmanager",
    FullName: "Nguyễn Thị Hương",
    email: "hr@example.com",
    role: "hr_manager",
    Status: "active",
    created_at: "Wed, 07 May 2025 10:15:22 GMT",
    employee_id: 14,
    DepartmentID: null,
    PositionID: null,
    employee_details: {
      EmployeeID: 14,
      FullName: "Nguyễn Thị Hương",
      Email: "hr@example.com",
      PhoneNumber: "0987654321",
      Gender: "Nữ",
      DateOfBirth: "Mon, 15 Jun 1990 00:00:00 GMT",
      HireDate: "Mon, 10 Jan 2022 00:00:00 GMT",
      Status: "active",
      DepartmentID: null,
      PositionID: null,
    },
  },
  {
    id: 4,
    username: "payroll",
    FullName: "Trần Văn Tài",
    email: "payroll@example.com",
    role: "payroll_manager",
    Status: "active",
    created_at: "Thu, 08 May 2025 09:30:45 GMT",
    employee_id: 15,
    DepartmentID: null,
    PositionID: null,
    employee_details: {
      EmployeeID: 15,
      FullName: "Trần Văn Tài",
      Email: "payroll@example.com",
      PhoneNumber: "0912345678",
      Gender: "Nam",
      DateOfBirth: "Fri, 20 Aug 1988 00:00:00 GMT",
      HireDate: "Tue, 05 Mar 2023 00:00:00 GMT",
      Status: "active",
      DepartmentID: null,
      PositionID: null,
    },
  },
];

// Tạo tài khoản mới trống
export const getEmptyAccount = () => ({
  username: "",
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "employee",
  Status: "active",
  gender: "Nam",
  phone_number: "",
  date_of_birth: "",
  hire_date: "",
  DepartmentID: null,
  PositionID: null,
});
