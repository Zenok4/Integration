export default function Attendance() {
    return (
      <div className="p-5">
        <div className="title">
          <h3 className="text-xl font-bold">BẢNG CÔNG</h3>
        </div>
  
        <div className="mt-4">
          <input
            type="text"
            placeholder="Nhập tên nhân viên hoặc mã id"
            className="w-full rounded-md h-10 bg-gray-100 text-gray-700 border-none text-base px-3"
          />
        </div>
  
        <div className="h-10 w-full mt-5 flex items-center justify-between flex-1">
          <div className="h-full w-[40%]">
            <select
              id="monthYearSelect"
              defaultValue=""
              className="w-full h-full bg-gray-100 border-none rounded text-gray-700"
            >
              <option value="2023-05">Tháng 5 / 2023</option>
              <option value="2023-06">Tháng 6 / 2023</option>
              <option value="2023-07">Tháng 7 / 2023</option>
              <option value="2023-08">Tháng 8 / 2023</option>
              <option value="2023-09">Tháng 9 / 2023</option>
            </select>
          </div>
  
          <div className="w-[40%] h-full">
            <select defaultValue="" className="h-full w-full text-base bg-gray-100 border-none rounded text-gray-700">
              <option value="" disabled>
                --Chọn phòng ban--
              </option>
              <option value="ketoan">Phòng kế toán</option>
              <option value="nhansu">Phòng nhân sự</option>
              <option value="kithuat">Phòng kĩ thuật</option>
              <option value="hanhchinh">Phòng hành chính</option>
              <option value="marketing">Phòng marketing</option>
              <option value="sanxuat">Phòng sản xuất</option>
              <option value="cskh">Phòng chăm sóc khách hàng</option>
            </select>
          </div>
        </div>
  
        <div className="w-full h-[30px] mt-2.5 flex items-center gap-[45px]">
          <div className="w-[7%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-green-500"></div>
            <div>
              <span className="text-sm">Đúng giờ</span>
            </div>
          </div>
  
          <div className="w-[21%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-amber-500"></div>
            <div>
              <span className="text-sm">Đi muộn / Về sớm / Quên checkout</span>
            </div>
          </div>
  
          <div className="w-[4%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-gray-400"></div>
            <div>
              <span className="text-sm">OT</span>
            </div>
          </div>
  
          <div className="w-[8%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-blue-700"></div>
            <div>
              <span className="text-sm">Có đơn từ</span>
            </div>
          </div>
  
          <div className="w-[7%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-cyan-500"></div>
            <div>
              <span className="text-sm">Nghỉ lễ</span>
            </div>
          </div>
  
          <div className="w-[8%] h-full flex items-center gap-2.5">
            <div className="status-dot bg-red-600"></div>
            <div>
              <span className="text-sm">Phạm lỗi</span>
            </div>
          </div>
        </div>
  
        <div className="h-[30px] flex items-center mt-1.5 font-bold text-gray-700">
          <span>Có 20 thành viên trong danh sách</span>
        </div>
  
        <div className="flex overflow-x-auto overflow-y-auto w-full h-[500px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th rowSpan={2} className="table-cell min-w-[170px] max-w-[200px]">
                  Tên nhân viên
                </th>
                <th colSpan={31} className="table-cell">
                  Ngày làm việc
                </th>
                <th colSpan={6} className="table-cell">
                  Tổng
                </th>
              </tr>
              <tr>
                {Array(31)
                  .fill(0)
                  .map((_, index) => (
                    <th key={index} className="table-cell min-w-[100px]">
                      {index < 7 ? `Thứ ${index + 2}` : index === 6 ? "CN" : `Thứ ${(index % 7) + 2}`} - {index + 1}/07
                    </th>
                  ))}
                <th className="table-cell min-w-[100px]">Số ngày làm đúng giờ</th>
                <th className="table-cell min-w-[100px]">Số ngày đi muộn</th>
                <th className="table-cell min-w-[100px]">Số ngày OT</th>
                <th className="table-cell min-w-[100px]">Số ngày nghỉ có đơn</th>
                <th className="table-cell min-w-[100px]">Số ngày nghỉ lễ</th>
                <th className="table-cell min-w-[100px]">Số ngày phạm lỗi</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <div className="font-bold">Nguyễn Thị A</div>
                      <div className="w-10 h-5 bg-amber-300 rounded-[10px] text-center">001</div>
                      <div>Kế toán</div>
                      <div className="text-blue-800">Trưởng phòng</div>
                    </td>
                    {Array(31)
                      .fill(0)
                      .map((_, dayIndex) => (
                        <td key={dayIndex} className="table-cell">
                          <div className="flex items-center justify-center">
                            <div
                              className={`status-dot ${
                                dayIndex % 7 === 0
                                  ? "bg-green-500"
                                  : dayIndex % 7 === 1
                                    ? "bg-green-500"
                                    : dayIndex % 7 === 2
                                      ? "bg-amber-500"
                                      : dayIndex % 7 === 3
                                        ? "bg-green-500"
                                        : dayIndex % 7 === 4
                                          ? "bg-gray-400"
                                          : dayIndex % 7 === 5
                                            ? "bg-green-500"
                                            : ""
                              }`}
                            ></div>
                          </div>
                        </td>
                      ))}
                    <td className="table-cell">22</td>
                    <td className="table-cell">2</td>
                    <td className="table-cell">5</td>
                    <td className="table-cell">1</td>
                    <td className="table-cell">0</td>
                    <td className="table-cell">1</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  