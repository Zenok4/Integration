import Link from "next/link"

export default function SalaryList() {
  return (
    <div className="p-5">
      <div className="bg-white">
        <div className="flex items-center justify-between p-2">
          <h3 className="text-xl font-bold">BẢNG LƯƠNG</h3>
          <Link href="/luong/lich-su" className="btn btn-primary">
            Lịch sử lương
          </Link>
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
                <th className="table-cell">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {Array(15)
                .fill(0)
                .map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="table-cell">001</td>
                    <td className="table-cell">20000000</td>
                    <td className="table-cell">2000000</td>
                    <td className="table-cell">500000</td>
                    <td className="table-cell">20/5/2022</td>
                    <td className="table-cell">
                      <Link href={`/luong/cap-nhat/${index + 1}`} className="btn btn-edit">
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
