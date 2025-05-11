"use client"

export default function DeleteAccountModal({ show, onClose, onDelete, account }) {
  if (!show || !account) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Xác nhận xóa tài khoản</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="p-5">
          <p className="text-slate-600">
            Bạn có chắc chắn muốn xóa tài khoản <span className="font-semibold">{account?.username}</span> (
            {account.FullName}) không? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={onDelete}
          >
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  )
}
