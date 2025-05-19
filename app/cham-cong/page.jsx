"use client";
import { useEffect, useState } from "react";
import { useDepartments } from "../hooks/get-departments-hook";
import API from "../services/api";
import { usePositions } from "../hooks/get-position-hook";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentsFilter, setDepartmentsFilter] = useState(0);

  const departments = useDepartments();
  const positions = usePositions();

  // Lấy tháng năm chấm công hiện tại
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
  const defaultMonthYear = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}`;

  // Lấy tháng năm chấm công của năm hiện tại
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: `${currentYear}-${String(month).padStart(2, "0")}`,
      label: `Tháng ${month} / ${currentYear}`,
    };
  });

  const handleFitterByMonth = async (e) => {
    const monthValue = e.target.value;
    setSelectedMonth(monthValue);
    try {
      const response = await API.get(`/attendance/month/${monthValue}`);
      console.log("Attendance Data:", response.data.data);
      setAttendanceData(response.data.data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  const fetchAttendanceData = async (month) => {
    try {
      const response = await API.get(`/attendance/month/${month}`);
      const data = response.data.data;
      setAttendanceData(data);
      setFilteredData(data); // Ban đầu, dữ liệu hiển thị sẽ là toàn bộ dữ liệu
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceData(defaultMonthYear);
    setSelectedMonth(defaultMonthYear);
  }, []);

  const getDepartmentName = (departmentId) => {
    if (departments[departmentId]) {
      return departments[departmentId].DepartmentName;
    }
    return "";
  };

  const getPositionName = (positionId) => {
    if (positions[positionId]) {
      return positions[positionId].PositionName;
    }
    return "";
  };

  const filteredAttandance = attendanceData.filter((attendance) => {
    // Kiểm tra điều kiện tìm kiếm theo EmployeeID hoặc FullName
    const matchesSearch = attendance.EmployeeID == searchTerm || 
                         attendance?.FullName.toLowerCase().includes(searchTerm.toLowerCase());

    // Nếu departmentsFilter bằng 0 hoặc chưa chọn, chỉ áp dụng matchesSearch
    if (parseInt(departmentsFilter) === 0) {
        return matchesSearch;
    }

    // Nếu departmentsFilter khác 0, áp dụng cả matchesSearch và matchesDepartment
    const matchesDepartment = parseInt(attendance.DepartmentID) === parseInt(departmentsFilter);
    console.log("attendance:", matchesDepartment);
    return matchesSearch && matchesDepartment;
});

  return (
    <div className="p-5">
      <div className="title">
        <h3 className="text-xl font-bold">BẢNG CÔNG</h3>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Nhập tên nhân viên hoặc mã id"
          value={searchTerm}
          className="w-full rounded-md h-10 bg-gray-100 text-gray-700 border-none text-base px-3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="h-10 w-full mt-5 flex items-center justify-between flex-1">
        <div className="h-full w-[40%]">
          <select
            id="monthYearSelect"
            defaultValue={defaultMonthYear}
            name="AttendanceMonth"
            className="w-full h-full bg-gray-100 border-none rounded text-gray-700 cursor-pointer"
            onChange={handleFitterByMonth}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[40%] h-full">
          <select
            defaultValue=""
            name="department"
            className="h-full w-full text-base bg-gray-100 border-none rounded text-gray-700 cursor-pointer"
            onChange={(e) => setDepartmentsFilter(e.target.value)}
          >
            <option value="" disabled>
              -- Chọn Phòng Ban --
            </option>
            {Object.values(departments).map((dept) => (
              <option key={dept.DepartmentID} value={dept.DepartmentID}>
                {dept.DepartmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex overflow-x-auto overflow-y-auto w-full max-h-[500px] mt-5 border-2 border-gray-300 rounded-md">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="table-cell min-w-[170px] max-w-[200px]">
                Tên nhân viên
              </th>
              <th className="table-cell min-w-[100px]">Số ngày làm đúng giờ</th>
              <th className="table-cell min-w-[100px]">Số ngày đi muộn</th>
              <th className="table-cell min-w-[100px]">Số ngày nghỉ có đơn</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttandance.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Không có dữ liệu chấm công
                </td>
              </tr>
            ) : (
              filteredAttandance.map((item) => (
                <tr key={item.AttendanceID}>
                  <td className="p-2">
                    <div className="flex gap-2 items-center">
                      <div className="font-bold">{item.FullName}</div>
                      <p className="w-10 h-5 bg-amber-300 rounded-[10px] flex justify-center items-center">
                        {item.EmployeeID}
                      </p>
                    </div>
                    <div>{getDepartmentName(item.DepartmentID)}</div>
                    <div className="text-blue-800">
                      {getPositionName(item.PositionID)}
                    </div>
                  </td>
                  <td className="table-cell text-center">{item.WorkDays}</td>
                  <td className="table-cell text-center">{item.AbsentDays}</td>
                  <td className="table-cell text-center">{item.LeaveDays}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
