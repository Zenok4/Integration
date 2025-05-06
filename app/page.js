import Link from "next/link"

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-slate-800">Hệ thống Quản lý Nhân sự & Lương</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/nhan-vien" className="card p-5 border-l-4 border-blue-500 hover:border-blue-600">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Quản lý Nhân viên</h2>
          <p className="text-slate-600">Xem và quản lý danh sách nhân viên</p>
        </Link>

        <Link href="/luong" className="card p-5 border-l-4 border-green-500 hover:border-green-600">
          <h2 className="text-xl font-semibold mb-2 text-green-600">Quản lý Lương</h2>
          <p className="text-slate-600">Xem và cập nhật lương nhân viên</p>
        </Link>

        <Link href="/cham-cong" className="card p-5 border-l-4 border-amber-500 hover:border-amber-600">
          <h2 className="text-xl font-semibold mb-2 text-amber-600">Chấm công</h2>
          <p className="text-slate-600">Quản lý chấm công và vắng mặt</p>
        </Link>

        <Link href="/bao-cao" className="card p-5 border-l-4 border-purple-500 hover:border-purple-600">
          <h2 className="text-xl font-semibold mb-2 text-purple-600">Báo cáo & Phân tích</h2>
          <p className="text-slate-600">Xem báo cáo và phân tích dữ liệu</p>
        </Link>

        <Link href="/thong-bao" className="card p-5 border-l-4 border-red-500 hover:border-red-600">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Thông báo</h2>
          <p className="text-slate-600">Quản lý thông báo và tin nhắn</p>
        </Link>

        <Link href="/cai-dat" className="card p-5 border-l-4 border-slate-500 hover:border-slate-600">
          <h2 className="text-xl font-semibold mb-2 text-slate-600">Cài đặt</h2>
          <p className="text-slate-600">Cài đặt hệ thống và phân quyền</p>
        </Link>
      </div>
    </div>
  )
}
