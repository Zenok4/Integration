export default function SalaryHistory() {
    return (
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-[40%]">
            <select id="monthYearSelect" className="w-full h-full bg-gray-100 border-none rounded text-gray-700">
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
                {Array(15)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="table-cell">001</td>
                      <td className="table-cell">20000000</td>
                      <td className="table-cell">2000000</td>
                      <td className="table-cell">500000</td>
                      <td className="table-cell">20/5/2022</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  