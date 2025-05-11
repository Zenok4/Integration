"use client"

import Link from "next/link"

export default function AddEmployee() {
  return (
    <div className="p-5">
      <div>
        <div className="w-full h-10 flex items-center justify-center rounded-lg shadow-md bg-amber-300">
          <div className="w-full h-full flex items-center justify-center font-bold">
            <Link href="/nhan-vien" className="text-purple-900 hover:text-blue-600 transition-colors">
              Danh sách nhân viên
            </Link>
          </div>
        </div>

        <div className="shadow-md flex flex-col w-full bg-white mt-5 rounded-lg border border-gray-300">
          <div className="flex items-center justify-around">
            <div className="mt-5 ml-5 w-[30%]">
              <div className="form-group">
                <div className="form-label">
                  <label>ID nhân viên</label>
                </div>
                <div className="w-full">
                  <input type="text" placeholder="Nhập ID" className="form-input" />
                </div>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Giới tính</label>
                </div>
                <select id="gender" name="gender" defaultValue="" className="form-input text-gray-500 italic">
                  <option value="" disabled>
                    --Chọn giới tính--
                  </option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Số điện thoại</label>
                </div>
                <div className="w-full">
                  <input type="tel" placeholder="Nhập số điện thoại" className="form-input" />
                </div>
              </div>
            </div>

            <div className="mt-5 ml-5 w-[30%]">
              <div className="form-group">
                <div className="form-label">
                  <label>Họ tên</label>
                </div>
                <div className="w-full">
                  <input type="text" placeholder="Nhập họ tên" className="form-input" />
                </div>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Phòng ban</label>
                </div>
                <div className="w-full">
                  <input type="text" placeholder="Nhập phòng ban" className="form-input" />
                </div>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Lương</label>
                </div>
                <div className="w-full">
                  <input type="number" placeholder="Nhập lương" className="form-input" />
                </div>
              </div>
            </div>

            <div className="mt-5 ml-5 w-[30%]">
              <div className="form-group">
                <div className="form-label">
                  <label>Ngày sinh</label>
                </div>
                <div className="w-full">
                  <input type="date" placeholder="mm/dd/yy" className="form-input text-gray-500 italic" />
                </div>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Chức vụ</label>
                </div>
                <div className="w-full">
                  <input type="text" placeholder="Nhập chức vụ" className="form-input" />
                </div>
              </div>

              <div className="form-group mt-7">
                <div className="form-label">
                  <label>Ngày thuê</label>
                </div>
                <div className="w-full">
                  <input type="date" placeholder="Nhập ngày thuê" className="form-input text-gray-500 italic" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[96%] h-[50px] mt-[100px] mx-5 flex items-center justify-between">
            <div className="w-10 h-full"></div>
            <div className="w-[200px] h-full flex items-center justify-between">
              <button onClick={() => alert("Lưu thành công!")} className="btn-save">
                Lưu lại
              </button>
              <button onClick={() => alert("Bạn có chắc muốn hủy bỏ thay đổi này?")} className="btn-cancel">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
