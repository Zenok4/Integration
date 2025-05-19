"use client";

import Link from "next/link";
import API from "../services/api";
import { useState, useEffect } from "react";
import { formatDate } from "../tai-khoan/utils/account-utils";
import formatCurrent from "../utils/formatCurrent";
import { useAuth } from "../context/AuthContext";

export default function SalaryList() {
  const [payrollData, setPayrollData] = useState([]);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await API.get("/salaries");
      console.log(res.data);
      if (res.data && res.data.payroll) {
        setPayrollData(res.data.payroll);
      }
    } catch (err) {
      setPayrollData([]);
    }
  };

  const { user } = useAuth();

  return (
    <div className="p-5">
      <div className="bg-white">
        <div className="flex items-center justify-between p-2">
          <h3 className="text-xl font-bold">BẢNG LƯƠNG</h3>
          {/* <Link href="/luong/lich-su" className="btn btn-primary">
            Lịch sử lương
          </Link> */}
          {(user?.role === "admin" || user?.role === "payroll_manager") && (
            <Link
              href="/luong/them"
              className="btn font-bold px-4 py-2 rounded shadow bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
            >
              Thêm bảng lương
            </Link>
          )}
        </div>

        <div className="overflow-y-auto max-h-[550px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header">
                <th className="table-cell">ID nhân viên</th>
                <th className="table-cell">Lương cơ bản</th>
                <th className="table-cell">Thưởng</th>
                <th className="table-cell">Khấu trừ</th>
                <th className="table-cell">Ngày trả</th>
                {(user?.role === "admin" ||
                  user?.role === "payroll_manager") && (
                  <th className="table-cell">Cập nhật</th>
                )}
              </tr>
            </thead>
            <tbody>
              {payrollData.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                payrollData.map((salaries, index) => (
                  <tr key={index} className="border-b">
                    <td className="table-cell">{salaries.EmployeeID}</td>
                    <td className="table-cell">
                      {formatCurrent(salaries.BaseSalary)}
                    </td>
                    <td className="table-cell">
                      {formatCurrent(salaries.Bonus)}
                    </td>
                    <td className="table-cell">
                      {formatCurrent(salaries.Deductions)}
                    </td>
                    <td className="table-cell">
                      {formatDate(salaries.SalaryMonth)}
                    </td>
                    {(user?.role === "admin" ||
                      user?.role === "payroll_manager") && (
                      <td className="table-cell">
                        <Link
                          href={`/luong/cap-nhat/${salaries.SalaryID}`}
                          className="btn btn-edit"
                        >
                          Sửa
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
