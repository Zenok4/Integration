"use client"

import { useEffect, useState } from "react"
import API from "../../services/api"
import { formatDate } from "@/app/tai-khoan/utils/account-utils";

export default function SalaryHistory() {
  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [month]);

  const fetchHistory = async () => {
  try {
    const res = await API.get("/salaries/payroll-report");
    if (res.data && Array.isArray(res.data.payroll)) {
      let data = res.data.payroll;
      if (month) {
        data = data.filter(item => item.SalaryMonth && item.SalaryMonth.startsWith(month));
      }
      setHistory(data);
    } else {
      setHistory([]);
    }
  } catch (err) {
    console.error("Error fetching payroll data:", err);
    setHistory([]);
  }
}

    return (
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-[40%]">
          <select id="monthYearSelect" className="w-full h-full bg-gray-100 border-none rounded text-gray-700" value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Tất cả</option>
              <option value="2023-05">Tháng 5 / 2023</option>
              <option value="2023-06">Tháng 6 / 2023</option>
              <option value="2023-07">Tháng 7 / 2023</option>
              <option value="2023-08">Tháng 8 / 2023</option>
              <option value="2023-09">Tháng 9 / 2023</option>
            </select>
          </div>
        </div>
  
        <div className="mt-7">
          <div className="pl-5 pt-0.5">
            <h4 className="text-lg font-medium">LỊCH SỬ LƯƠNG</h4>
          </div>
  
          <div className="flex overflow-y-auto max-h-[530px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="table-cell">ID nhân viên</th>
                  <th className="table-cell">Lương cơ bản</th>
                  <th className="table-cell">Thưởng</th>
                  <th className="table-cell">Khấu trừ</th>
                  <th className="table-cell">Ngày trả</th>
                </tr>
              </thead>
              <tbody className="text-center">
              {history.map((item, index) => (
                    <tr key={index}>
                  <td className="table-cell">{item.EmployeeID}</td>
                  <td className="table-cell">{item.BaseSalary}</td>
                  <td className="table-cell">{item.Bonus}</td>
                  <td className="table-cell">{item.Deductions}</td>
                  <td className="table-cell">{formatDate(item.SalaryMonth)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  