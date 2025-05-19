"use client";

import { DollarSign, Bell, Clock, ScrollText } from "lucide-react";
import CardMenu from "./components/card-menu";
import Card from "./components/card";
import Dropdown from "./components/drop-down";
import formatCurrent from "../utils/formatCurrent";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [payrollData, setPayrollData] = useState();
  const [payrollDataMonth, setPayrollDataMonth] = useState();
  const [payrollCurrentMonth, setPayrollCurrentMonth] = useState();
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
  const currentMonthYear = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}`;

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await API.get("/salaries/employee/" + user?.employee_id);
      setPayrollData(res?.data?.data?.[res?.data?.data?.length - 1]);
    } catch {
      console.log("Fetch payroll failed");
    }
    setLoading(false);
  };

  const fetchPayrollMonth = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/attendance/employee/${user?.employee_id}/month/${currentMonthYear}`
      );
      setPayrollDataMonth(res?.data?.data?.[0]);
    } catch {
      console.log("Fetch payroll failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchPayroll();
    fetchPayrollMonth();
    fetchPayrollByMonth();
  }, [user]);

  const convertToMonthYear = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    let formattedDate = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
    });

    // Viết hoa chữ cái đầu
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const convertToYear = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    let formattedDate = date.toLocaleDateString("vi-VN", {
      year: "numeric",
    });

    // Viết hoa chữ cái đầu
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const data = [
    {
      title: "Lương cơ bản",
      payroll: formatCurrent(payrollData?.BaseSalary || 0) + " đ",
      date: convertToMonthYear(payrollData?.SalaryMonth || ""),
      icon: DollarSign,
    },
    {
      title: "Lương thực lãnh",
      payroll: formatCurrent(payrollData?.NetSalary || 0) + " đ",
      date: convertToMonthYear(payrollData?.SalaryMonth || ""),
      icon: DollarSign,
    },
    {
      title: "Ngày công",
      payroll: (payrollDataMonth?.WorkDays || 0 + " ngày"),
      date: convertToMonthYear(payrollDataMonth?.AttendanceMonth || currentMonthYear || ""),
      icon: ScrollText,
    },
    {
      title: "Ngày phép còn lại",
      payroll: 20 - (payrollDataMonth?.LeaveDays || 0) + " ngày",
      date: "Năm " + convertToYear(payrollDataMonth?.AttendanceMonth || currentMonthYear || ""),
      icon: Clock,
    },
  ];

  const fetchPayrollByMonth = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/salaries/employee/${user?.employee_id}/month/${
          selectedOption || currentMonthYear
        }`
      );
      setPayrollCurrentMonth(res?.data?.data?.[0]);
    } catch {
      console.log("Fetch payroll failed");
    }
    setLoading(false);
  };

  //dropdown
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const monthOptions = [];

    for (let month = 1; month <= 12; month++) {
      monthOptions.push(`${currentYear}-${month.toString().padStart(2, "0")}`);
    }

    setOptions(monthOptions);
    fetchPayrollByMonth();
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
  };

  return (
    <div className="right flex-1 bg-gray-100 p-6 overflow-y-scroll">
      {/* Card Menu */}
      <div className="card-menu flex justify-between mt-10">
        {data.map((item, index) => (
          <CardMenu key={index} data={item} />
        ))}
      </div>

      {/* chi tiết lương */}
      <div className="content-salary w-full py-6">
        <h1 className="text-lg font-bold mb-4">Thông tin chi tiết lương</h1>
        <select
          onChange={handleOptionChange}
          className="dropdown w-1/2 p-2 bg-gray-200/60 rounded-lg cursor-pointer"
          value={selectedOption}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="card-salary flex flex-1/2 gap-4 mt-8">
          <Card
            title="Lương cơ bản"
            amount={formatCurrent(payrollCurrentMonth?.BaseSalary || 0)}
          />
          <Card
            title="Phụ Cấp & Thưởng"
            amount={formatCurrent(payrollCurrentMonth?.Bonus || 0)}
            className="text-green-500"
          />
          <Card
            title="Các khoản khấu trừ"
            amount={formatCurrent(payrollCurrentMonth?.Deductions || 0)}
            className="text-red-500"
          />
          <Card
            title="Lương thực lãnh"
            amount={formatCurrent(payrollCurrentMonth?.NetSalary || 0)}
          />
        </div>
      </div>
    </div>
  );
}
