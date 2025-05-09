"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Edit, Camera, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import API from "../services/api";

export default function SettingsPage() {
  const router = useRouter();
  // State cho profile
  const [profile, setProfile] = useState();

  // State cho chỉnh sửa profile
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  // State cho thay đổi mật khẩu
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/me");
      if (response) {
        setProfile(response.data);
        // console.log("User Data:", response.data.user)
        const employeeID = response.data.user.employee_id;
        const userData = await API.get("/employees/get-employee/" + employeeID);
        console.log("User Data:", userData.data);
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...userData.data.sqlserver,
        }));
        setEditedProfile(userData.data.sqlserver);
        console.log("Profile Data:", profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  console.log("Profile Data:", profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Lấy thông tin profile từ localStorage khi component mount
  useEffect(() => {
    try {
      // Lấy thông tin profile từ localStorage nếu có
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setEditedProfile(parsedProfile);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  // Xử lý khi thay đổi thông tin profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi lưu thông tin profile
  const saveProfile = () => {
    try {
      setProfile(editedProfile);
      setIsEditing(false);
      localStorage.setItem("userProfile", JSON.stringify(editedProfile));
      alert("Thông tin cá nhân đã được cập nhật!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Có lỗi xảy ra khi lưu thông tin cá nhân!");
    }
  };

  // Xử lý khi thay đổi mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi lưu mật khẩu mới
  const savePassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // Trong thực tế, bạn sẽ gửi request API để thay đổi mật khẩu
    alert("Mật khẩu đã được thay đổi thành công!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordSection(false);
  };

  const logout = async () => {
    const res = await API.post("/auth/logout");
    if (res) router.push("/login");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Cài đặt hệ thống
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Phần Profile */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <User className="text-blue-500" />
              Thông tin cá nhân
            </h2>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <Edit size={16} />
                Chỉnh sửa
              </button>
            ) : (
              <button
                onClick={saveProfile}
                className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-500"
              >
                <Save size={16} />
                Lưu
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Thay thế hình ảnh bằng một div với icon */}
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                  <User size={40} className="text-blue-500" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h3 className="font-medium mt-2 text-slate-800">
                {profile?.FullName}
              </h3>
              <p className="text-sm text-blue-600">{profile?.position || profile?.user?.role}</p>
            </div>

            {/* Thông tin */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editedProfile?.FullName}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.FullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedProfile?.Email}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.Email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile?.PhoneNumber}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.PhoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phòng ban
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={editedProfile?.department}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Chức vụ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={editedProfile?.position}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.position || profile?.user?.role}</p>
                  )}
                </div>
              </div>

              {/* Phần đổi mật khẩu */}
              <div className="mt-6">
                <button
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <Lock size={16} />
                  {showPasswordSection ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
                </button>

                {showPasswordSection && (
                  <form onSubmit={savePassword} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData?.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thêm phần đăng xuất */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <LogOut className="text-red-500" />
            Đăng xuất
          </h2>
          <p className="text-slate-600 mb-4">
            Đăng xuất khỏi hệ thống HR & Payroll. Bạn sẽ cần đăng nhập lại để
            tiếp tục sử dụng hệ thống.
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
