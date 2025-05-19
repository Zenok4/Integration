"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/AuthContext"
import API from "../../services/api"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await API.post(
        "/auth/login",
        {
          username: formData.username,
          password: formData.password,
        },
      )

      console.log("User Data:", res.data.user)
      setUser(res.data.user)

      // Kiểm tra trạng thái đăng nhập
      const userRes = await API.get("/auth/me")

      console.log("Current User:", userRes.data)
      router.push("/")
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  const checkLogin = async () => {
    try {
      const res = await API.get("/auth/me")
      if(res.data.user) {
        router.push("/")
      }
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <div className="h-full flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-500 p-6 text-white text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 p-3 rounded-full">
                <User size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-blue-100 mt-1">Đăng nhập vào Dashboard HR & Payroll</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    onChange={handleChange}
                    className="form-input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>© 2023 HR & Payroll System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
