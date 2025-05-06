"use client"

import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

export default function Reports() {
  const salaryChartRef = useRef(null)
  const departmentChartRef = useRef(null)

  useEffect(() => {
    if (salaryChartRef.current && departmentChartRef.current) {
      // Salary Chart
      const salaryChart = new Chart(salaryChartRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Lương",
              data: [5000, 5200, 4800, 5100, 5300],
              borderColor: "#8884d8",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
        },
      })

      // Department Chart
      const departmentChart = new Chart(departmentChartRef.current, {
        type: "bar",
        data: {
          labels: ["HR", "IT", "Finance", "Marketing"],
          datasets: [
            {
              label: "Số lượng",
              data: [10, 30, 20, 15],
              backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      })

      return () => {
        salaryChart.destroy()
        departmentChart.destroy()
      }
    }
  }, [])

  const exportReport = (type) => {
    alert(`Xuất báo cáo ${type}`)
  }

  return (
    <div className="p-5">
      <div className="max-w-[900px] mx-auto bg-white p-5 rounded-lg shadow">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Thống kê nhân sự</h1>

        <h2 className="text-xl font-semibold mb-2">Biểu đồ lương theo thời gian</h2>
        <div className="w-full h-[300px] mb-7">
          <canvas ref={salaryChartRef}></canvas>
        </div>

        <h2 className="text-xl font-semibold mb-2">Phân bố nhân viên theo phòng ban</h2>
        <div className="w-full h-[300px] mb-7">
          <canvas ref={departmentChartRef}></canvas>
        </div>

        <div className="text-right mt-5">
          <button
            className="px-4 py-2.5 m-1 border-none rounded bg-green-600 text-white cursor-pointer text-sm"
            onClick={() => exportReport("Excel")}
          >
            Xuất Excel
          </button>
          <button
            className="px-4 py-2.5 m-1 border-none rounded bg-red-600 text-white cursor-pointer text-sm"
            onClick={() => exportReport("PDF")}
          >
            Xuất PDF
          </button>
        </div>
      </div>
    </div>
  )
}
