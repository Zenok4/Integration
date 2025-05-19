"use client";

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useDepartments } from "../hooks/get-departments-hook";
import API from "../services/api";

export default function Reports() {
  const salaryChartRef = useRef(null);
  const departmentChartRef = useRef(null);
  const [listDepartments, setListDepartments] = useState();
  const [numberEmployees, setNumberEmployees] = useState({});
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [salaries, setSalaries] = useState([]);
  const [averageSalary, setAverageSalary] = useState([]);

  const departments = useDepartments();
  const fetchEmployeesByDepartment = async () => {
    try {
      const data = await API.get("/employees");
      if (data) {
        setNumberEmployees(countEmployeesByDepartment(data.data.employees));
        setTotalEmployees(data.data.employees.length);
      }
    } catch {
      console.log("Fetch employees failed");
    }
  };

  const fetchPayroll = async () => {
    try {
      const data = await API.get("/salaries");
      if (data) {
        setSalaries(data.data.payroll);
      }
    } catch {
      console.log("Fetch payroll failed");
    }
  };

  const fetchAverageSalary = async () => {
    try {
      const data = await API.get("/salaries/average");
      if (data) {
        setAverageSalary(data.data.data);
      }
    } catch {
      console.log("Fetch payroll failed");
    }
  };

  console.log(averageSalary);

  function countEmployeesByDepartment(employees) {
    if (!Array.isArray(employees) || employees.length === 0) {
      return {}; // Trả về object rỗng nếu đầu vào không hợp lệ hoặc rỗng
    }

    const departmentCounts = {};

    for (const employee of employees) {
      let departmentId = null;
      if (
        employee &&
        employee.mysql &&
        typeof employee.mysql.DepartmentID !== "undefined"
      ) {
        departmentId = employee.mysql.DepartmentID;
      } else if (
        employee &&
        employee.sqlserver &&
        typeof employee.sqlserver.DepartmentID !== "undefined"
      ) {
        departmentId = employee.sqlserver.DepartmentID;
      } else {
        console.warn(
          "Đối tượng nhân viên không có DepartmentID hoặc cấu trúc không đúng:",
          employee
        );
        continue;
      }

      if (departmentId !== null) {
        if (departmentCounts[departmentId]) {
          departmentCounts[departmentId]++;
        } else {
          departmentCounts[departmentId] = 1;
        }
      }
    }

    return departmentCounts;
  }

  const nameToIdMap = {};
  Object.values(departments).forEach((deptDef) => {
    nameToIdMap[deptDef.DepartmentName] = deptDef.DepartmentID;
  });
  const departmentCountsData = listDepartments?.map((deptName) => {
    const deptId = nameToIdMap[deptName]; // Lấy DepartmentID tương ứng với tên phòng ban
    return numberEmployees[deptId] || 0; // Lấy số lượng từ object numberEmployees bằng ID,
    // nếu không có thì mặc định là 0
  });

  //tính lương trung bình
  function calculateAverageSalary(salaries) {
    if (!salaries || salaries.length === 0) return 0;

    const totalNetSalary = salaries.reduce((sum, salary) => {
      return sum + parseFloat(salary.NetSalary);
    }, 0);

    return totalNetSalary / salaries.length;
  }

  useEffect(() => {
    const departmentNames = Object.values(departments).map(
      (dept) => dept.DepartmentName
    );
    setListDepartments(departmentNames);
    fetchEmployeesByDepartment();
    fetchPayroll();
    fetchAverageSalary();
  }, [departments]);

  useEffect(() => {
    const salaryData = [0, 0, 0, 0, 0];

    // Gán giá trị AvgSalary từ JSON vào mảng theo DepartmentID
    averageSalary.forEach((item) => {
      const id = item.DepartmentID - 1; // DepartmentID bắt đầu từ 1, mảng bắt đầu từ 0
      salaryData[id] = parseFloat(item.AvgSalary);
    });

    salaryData.push(calculateAverageSalary(salaries));
    
    if (salaryChartRef.current && departmentChartRef.current) {
      // Salary Chart
      const salaryChart = new Chart(salaryChartRef.current, {
        type: "bar",
        data: {
          labels: [
            "Ban Giám Đốc",
            "Nhân sự",
            "Kế toán",
            "Kỹ thuật",
            "Marketing",
            "Lương trung bình",
          ],
          datasets: [
            {
              label: "Lương (đ)",
              data: salaryData,
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#27ff1f",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      // Department Chart
      const departmentChart = new Chart(departmentChartRef.current, {
        type: "bar",
        data: {
          labels: listDepartments,
          datasets: [
            {
              label: "Số lượng",
              data: departmentCountsData,
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#9966ff",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      return () => {
        salaryChart.destroy();
        departmentChart.destroy();
      };
    }
  }, [departments, salaries]);

  const exportReport = (type) => {
    alert(`Xuất báo cáo ${type}`);
  };

  return (
    <div className="p-5">
      <div className="max-w-[900px] mx-auto bg-white p-5 rounded-lg shadow">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Thống kê
        </h1>

        <h2 className="text-xl font-semibold mb-2">
          Lương trung bình ở các phòng ban
        </h2>
        <div className="w-full h-[300px] mb-7">
          <canvas ref={salaryChartRef}></canvas>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Phân bố nhân viên theo phòng ban
        </h2>
        <div className="w-full h-[300px] mb-7">
          <canvas ref={departmentChartRef}></canvas>
        </div>
        <div className="flex gap-4 items-center mb-5">
          Tổng số nhân viên: <p>{totalEmployees}</p>
        </div>
      </div>
    </div>
  );
}
