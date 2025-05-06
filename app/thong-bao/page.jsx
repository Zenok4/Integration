"use client"

import { useState } from "react"
import { Mail, Send, Trash2, PinIcon, CheckSquare, ChevronDown } from "lucide-react"

export default function Notifications() {
  const [showCompose, setShowCompose] = useState(false)

  return (
    <div className="p-5 flex flex-row h-full">
      <div className="w-[14%] h-full pt-5 flex flex-col gap-7 items-start flex-shrink-0">
        <div className="w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200">
          <Mail className="w-[10%] h-1/2" />
          <a className="text-base">Hộp thư đến</a>
        </div>

        <div className="w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200">
          <Send className="w-[10%] h-1/2" />
          <a className="text-base">Thư đã gửi</a>
        </div>

        <div className="w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200">
          <Trash2 className="w-[10%] h-1/2" />
          <a className="text-base">Thư rác</a>
        </div>

        <div className="w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200">
          <PinIcon className="w-[10%] h-1/2" />
          <a className="text-base">Đã ghim</a>
        </div>
      </div>

      <div className="w-full h-full rounded-lg">
        <div className="w-full h-10 bg-gray-50 rounded-t-lg flex items-center gap-5">
          <div className="w-[30px] h-[60%] pl-4 relative inline-block cursor-pointer group">
            <ChevronDown className="w-full h-full" />
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 w-40 bg-gray-800 text-white text-center p-1 rounded absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 transition-opacity duration-300 text-xs whitespace-nowrap">
              Chọn
            </div>
            <div className="absolute hidden group-hover:block bg-white shadow-lg min-w-[160px] rounded-md overflow-hidden z-10 mt-2">
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Tất cả
              </a>
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Bỏ chọn tất cả
              </a>
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Thư đã đọc
              </a>
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Thư chưa đọc
              </a>
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Thư đã ghim
              </a>
              <a href="#" className="block p-2.5 text-black hover:bg-gray-100">
                Thư chưa gim
              </a>
            </div>
          </div>

          <div className="w-[30px] h-[60%] pl-4 relative inline-block cursor-pointer group">
            <CheckSquare className="w-full h-full" />
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 w-[90px] bg-gray-800 text-white text-center p-1 rounded absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 transition-opacity duration-300 text-xs whitespace-nowrap">
              Đánh dấu là đã đọc
            </div>
          </div>

          <div className="w-[30px] h-[60%] pl-4 relative inline-block cursor-pointer group">
            <PinIcon className="w-full h-full" />
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 w-10 bg-gray-800 text-white text-center p-1 rounded absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 transition-opacity duration-300 text-xs whitespace-nowrap">
              Ghim
            </div>
          </div>

          <div className="w-[30px] h-[60%] pl-4 relative inline-block cursor-pointer group">
            <Trash2 className="w-full h-full" />
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 w-10 bg-gray-800 text-white text-center p-1 rounded absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 transition-opacity duration-300 text-xs whitespace-nowrap">
              Xóa
            </div>
          </div>
        </div>

        <div className="w-full h-full bg-gray-100">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-10 border-b border-gray-300 flex gap-[35px] hover:shadow-md cursor-pointer"
              >
                <div className="w-[20%] h-full overflow-hidden whitespace-nowrap flex gap-2.5 items-center">
                  <input type="checkbox" id="check" className="w-5 h-5" />
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap block max-w-full">
                    Đến: nguyenthimen190504@gmail.com
                  </span>
                </div>
                <div className="flex-1"></div>
              </div>
            ))}
        </div>
      </div>

      {/* Compose Window */}
      {showCompose && (
        <div className="fixed bottom-5 right-5 w-[400px] bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="flex justify-between items-center text-black mb-2">
            <strong>Thư mới</strong>
            <button className="bg-transparent border-none text-lg cursor-pointer" onClick={() => setShowCompose(false)}>
              &times;
            </button>
          </div>
          <div>
            <input type="text" placeholder="Đến" className="w-full mt-2.5 p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Tiêu đề" className="w-full mt-2.5 p-2 border border-gray-300 rounded" />
            <textarea
              rows={5}
              placeholder="Nội dung"
              className="w-full mt-2.5 p-2 border border-gray-300 rounded"
            ></textarea>
            <button className="mt-2.5 bg-green-600 text-white p-2 border-none cursor-pointer rounded w-full">
              Gửi
            </button>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-5 right-5 w-[8%] h-10 rounded-lg cursor-pointer"
        onClick={() => setShowCompose(true)}
      >
        <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
