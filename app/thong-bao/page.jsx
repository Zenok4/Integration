"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Trash2,
  PinIcon,
  CheckSquare,
  ChevronDown,
  Gift,
} from "lucide-react";
import SalaryNotificationList from "./thu-gui-di";
import SentNotificationList from "./component/sent-notification-list";
import NotificationItemDetail from "./noi-dung-thu-gui-di";
import ConvertEmailData from "./component/convert-email-data";
import AnniversaryNotifications from "./component/anniversary-notifications";
import API from "@/app/services/api";
import { data } from "autoprefixer";
import { useDepartments } from "@/app/hooks/get-departments-hook";

export default function EmailApp() {
  const [showCompose, setShowCompose] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Tất cả");
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [anniversaryNotifications, setAnniversaryNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("notifications"); // "notifications" or "anniversaries"

  // Compose form state
  const [composeTo, setComposeTo] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeTargetType, setComposeTargetType] = useState("individual");
  const [composeAlertType, setComposeAlertType] = useState("payroll");
  const [AviverDate, setAviverDate] = useState(Date.now());

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/payroll-alerts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Chuyển đổi dữ liệu để phù hợp với cấu trúc mới nếu cần
      const processedData = Array.isArray(data)
        ? data.map((item) => {
            // Đảm bảo các trường cần thiết tồn tại
            return {
              NotificationID: item.NotificationID || item.id,
              FullName:
                item.FullName ||
                (item.sqlserver_info ? item.sqlserver_info.FullName : ""),
              Email:
                item.Email ||
                (item.sqlserver_info ? item.sqlserver_info.Email : ""),
              CreatedAt: item.CreatedAt || item.created_at,
              ...item,
            };
          })
        : [];

      setNotifications(processedData);
      console.log(processedData);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch anniversary notifications
  const fetchAnniversaryNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/human-notifications");

      const AniverData = response.data.map((notification) => {
        const AniData = {
          NotificationID: notification.NotificationID,
          EmployeeID: notification.EmployeeID,
          Message: notification.Message,
          CreatedAt: notification.CreatedAt,
          TargetType: notification.TargetType,
          AnniversaryDate: notification.AnniversaryDate,
          Title: notification.Title,
          alert_type: "anniversary",
          // Thêm thông tin nhân viên từ sqlserver_info
          FullName: "Nhân viên",
          Email: "",
          // Tính số năm công tác
          yearsOfService: calculateYearsOfService(notification.AnniversaryDate),
        };
        console.log("AniData:", AniData);
        return AniData;
      });

      setAnniversaryNotifications(AniverData);

      // Cập nhật danh sách thư đã gửi để bao gồm cả thông báo kỷ niệm
      updateSentNotifications(AniverData);
    } catch (err) {
      console.error("Error fetching anniversary notifications:", err);
      setError("Không thể tải thông báo kỷ niệm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh sách thư đã gửi
  const updateSentNotifications = (anniversaryData) => {
    // Kết hợp thông báo thông thường và thông báo kỷ niệm
    const allNotifications = [
      ...ConvertEmailData(notifications),
      ...ConvertEmailData(anniversaryData),
    ];

    // Sắp xếp theo thời gian tạo (mới nhất lên đầu)
    const sortedNotifications = allNotifications.sort((a, b) => {
      const dateA = a.CreatedAt ? new Date(a.CreatedAt) : new Date();
      const dateB = b.CreatedAt ? new Date(b.CreatedAt) : new Date();
      return dateB - dateA;
    });

    setSentNotifications(sortedNotifications);
  };

  // Calculate years of service based on anniversary date
  const calculateYearsOfService = (anniversaryDate) => {
    if (!anniversaryDate) return 0;

    const hireDate = new Date(anniversaryDate);
    const today = new Date();
    let years = today.getFullYear() - hireDate.getFullYear();

    // Adjust if anniversary hasn't occurred yet this year
    if (
      today.getMonth() < hireDate.getMonth() ||
      (today.getMonth() === hireDate.getMonth() &&
        today.getDate() < hireDate.getDate())
    ) {
      years--;
    }

    return Math.abs(years);
  };

  useEffect(() => {
    if (activeFolder === "inbox") {
      if (activeTab === "notifications") {
        fetchNotifications();
      } else if (activeTab === "anniversaries") {
        fetchAnniversaryNotifications();
      }
    } else if (activeFolder === "sent" && sentNotifications.length === 0) {
      // Nếu đang ở thư mục "Đã gửi" và chưa có dữ liệu, tải cả hai loại thông báo
      fetchNotifications().then(() => fetchAnniversaryNotifications());
    }
  }, [activeFolder, activeTab]);

  // Cập nhật danh sách thư đã gửi khi notifications hoặc anniversaryNotifications thay đổi
  useEffect(() => {
    if (notifications.length > 0 || anniversaryNotifications.length > 0) {
      updateSentNotifications(anniversaryNotifications);
    }
  }, [notifications, anniversaryNotifications]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const handleFolderClick = (folder) => {
    setActiveFolder(folder);
    setShowEmailDetail(false);
    if (folder === "inbox") {
      if (activeTab === "notifications" && notifications.length === 0) {
        fetchNotifications();
      } else if (
        activeTab === "anniversaries" &&
        anniversaryNotifications.length === 0
      ) {
        fetchAnniversaryNotifications();
      }
    } else if (folder === "sent" && sentNotifications.length === 0) {
      // Nếu đang ở thư mục "Đã gửi" và chưa có dữ liệu, tải cả hai loại thông báo
      fetchNotifications().then(() => fetchAnniversaryNotifications());
    }
  };

  const handleEmailClick = (index) => {
    setSelectedEmailIndex(index);
    setShowEmailDetail(true);
  };

  const handleBackClick = () => {
    setShowEmailDetail(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowEmailDetail(false);
  };

  const handleActualSend = () => {
    if (!composeContent) {
      alert("Vui lòng nhập đầy đủ thông tin tiêu đề và nội dung.");
      return;
    }
    let employeeId = null;
    if (composeTargetType === "individual") {
      if (!composeTo) {
        alert("Vui lòng nhập EmployeeID cho gửi cá nhân.");
        return;
      }
      employeeId = Number.parseInt(composeTo);
      if (isNaN(employeeId)) {
        alert("EmployeeID không hợp lệ.");
        return;
      }
    }

    let newNotification = {
      message: composeContent,
      AnniversaryDate: AviverDate,
      TargetType: composeTargetType,
      alert_type: composeAlertType,
      EmployeeID: employeeId,
      employee_id: employeeId,
      details: composeContent,
    };

    // Phân biệt trường cho từng loại thông báo
    if (composeAlertType === "anniversary") {
      newNotification = {
        ...newNotification,
        EmployeeID: employeeId, // SQL Server
      };
      delete newNotification.employee_id;
    } else {
      newNotification = {
        ...newNotification,
        employee_id: employeeId, // MySQL
        details: composeContent,
      };
    }
    delete newNotification.EmployeeID;
    newNotification.created_at = new Date().toISOString();
    handleSend(newNotification);
  };

  function handleSend(newNotification) {
    let url = "";
    console.log(newNotification);
    // Gửi kỷ niệm thì add_notification, các loại còn lại thì add_payroll_alerts
    if (newNotification.alert_type === "anniversary") {
      url = "http://127.0.0.1:5000/human-notifications/add-human-notifications";
    } else if (
      ["leave_exceed", "salary_discrepancy"].includes(
        newNotification.alert_type
      )
    ) {
      url = "http://127.0.0.1:5000/payroll-alerts/add-payroll-arlert";
    } else {
      alert("Loại thông báo không hợp lệ!");
      return;
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNotification),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Gửi thông báo thành công:", data);
        setNotifications((prev) => [data, ...prev]); // Thêm vào Hộp thư đến
        setSentNotifications((prev) => [data, ...prev]); // Thêm vào Thư đã gửi
        fetchNotifications();
        setShowCompose(false);
        // Reset form fields
        setComposeTo("");
        setComposeTitle("");
        setComposeContent("");
        setComposeTargetType("individual");
        setComposeAlertType("payroll");
      })
      .catch((error) => {
        console.error("Gửi thông báo thất bại:", error);
        alert("Gửi thông báo thất bại!");
      });
  }

  function handleUpdate(notificationId, updateData) {
    fetch(`http://127.0.0.1:5000/notification/update-human-notification`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ NotificationID: notificationId, ...updateData }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((updatedNotification) => {
        if (activeFolder === "inbox") {
          if (activeTab === "notifications") {
            setNotifications((prev) =>
              prev.map((n) =>
                n.NotificationID === notificationId
                  ? { ...n, ...updatedNotification }
                  : n
              )
            );
          } else if (activeTab === "anniversaries") {
            setAnniversaryNotifications((prev) =>
              prev.map((n) =>
                n.NotificationID === notificationId
                  ? { ...n, ...updatedNotification }
                  : n
              )
            );
          }
        } else if (activeFolder === "sent") {
          setSentNotifications((prev) =>
            prev.map((n) =>
              n.NotificationID === notificationId
                ? { ...n, ...updatedNotification }
                : n
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
        alert("Cập nhật thông báo thất bại!");
      });
  }

  // Static data for other folders
  const trashEmails = [];
  const pinnedEmails = [];

  const getCurrentDisplayItems = () => {
    switch (activeFolder) {
      case "inbox":
        return activeTab === "notifications"
          ? notifications
          : anniversaryNotifications;
      case "sent":
        return sentNotifications;
      case "trash":
        return trashEmails;
      case "pinned":
        return pinnedEmails;
      default:
        return notifications;
    }
  };

  const currentItems = getCurrentDisplayItems();
  const selectedItemData = currentItems[selectedEmailIndex];

  const getFolderName = () => {
    switch (activeFolder) {
      case "inbox":
        return activeTab === "notifications" ? "hộp thư" : "thông báo kỷ niệm";
      case "sent":
        return "thư đã gửi";
      case "trash":
        return "thư rác";
      case "pinned":
        return "thư đã ghim";
      default:
        return "hộp thư";
    }
  };

  // Hàm chuyển đổi DepartmentID thành tên phòng ban
  const getDepartmentName = (departmentId) => {
    const departments = useDepartments();

    return departments[departmentId] || `Phòng ${departmentId}`;
  };

  return (
    <div className="p-5 flex flex-col h-screen">
      {showEmailDetail && selectedItemData ? (
        <div className="w-full h-full">
          <div className="mb-4">
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronDown className="w-4 h-4 rotate-90 mr-1" />
              Quay lại {getFolderName()}
            </button>
          </div>
          {activeFolder === "sent" ? (
            <NotificationItemDetail
              item={selectedItemData}
              onBack={handleBackClick}
            />
          ) : (
            <NotificationItemDetail
              item={selectedItemData}
              onBack={handleBackClick}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-row h-full">
          {/* Sidebar */}
          <div className="w-[14%] h-full pt-5 flex flex-col gap-7 items-start flex-shrink-0">
            <div
              className={`w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200 ${
                activeFolder === "inbox" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleFolderClick("inbox")}
            >
              <Mail className="w-[10%] h-1/2 ml-2" />{" "}
              <span className="text-base">Hộp thư đến</span>
            </div>
            <div
              className={`w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200 ${
                activeFolder === "sent" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleFolderClick("sent")}
            >
              <Send className="w-[10%] h-1/2 ml-2" />{" "}
              <span className="text-base">Thư đã gửi</span>
            </div>
            <div
              className={`w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200 ${
                activeFolder === "trash" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleFolderClick("trash")}
            >
              <Trash2 className="w-[10%] h-1/2 ml-2" />{" "}
              <span className="text-base">Thư rác</span>
            </div>
            <div
              className={`w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200 ${
                activeFolder === "pinned" ? "bg-gray-100" : ""
              }`}
              onClick={() => handleFolderClick("pinned")}
            >
              <PinIcon className="w-[10%] h-1/2 ml-2" />{" "}
              <span className="text-base">Đã ghim</span>
            </div>
            <div
              className={`w-full h-10 flex items-center gap-2.5 rounded-lg cursor-pointer hover:bg-gray-200 ${
                activeTab === "anniversaries" && activeFolder === "inbox"
                  ? "bg-gray-100"
                  : ""
              }`}
              onClick={() => {
                handleFolderClick("inbox");
                handleTabChange("anniversaries");
              }}
            >
              <Gift className="w-[10%] h-1/2 ml-2" />{" "}
              <span className="text-base">Kỷ niệm</span>
            </div>
          </div>

          {/* Main content area */}
          <div className="w-full h-full rounded-lg border border-gray-200 ml-5">
            <div className="w-full h-10 bg-gray-50 rounded-t-lg flex items-center gap-5">
              {activeFolder === "inbox" && (
                <div className="flex ml-4 gap-4">
                  <button
                    onClick={() => handleTabChange("notifications")}
                    className={`px-3 py-1 rounded ${
                      activeTab === "notifications"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    Thông báo
                  </button>
                  <button
                    onClick={() => handleTabChange("anniversaries")}
                    className={`px-3 py-1 rounded ${
                      activeTab === "anniversaries"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    Kỷ niệm
                  </button>
                </div>
              )}
              <div className="w-[30px] h-[60%] pl-4 relative inline-block cursor-pointer">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full h-full flex items-center justify-center focus:outline-none"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                >
                  <ChevronDown className="w-full h-full" />
                </button>
                <div
                  className={`absolute ${
                    showDropdown ? "block" : "hidden"
                  } bg-white shadow-lg min-w-[160px] rounded-md overflow-hidden z-10 mt-2`}
                >
                  <button
                    onClick={() => handleOptionClick("Tất cả")}
                    className="block w-full text-left p-2.5 text-black hover:bg-gray-100"
                  >
                    Tất cả
                  </button>
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

            {/* Email/notification list */}
            <div className="w-full bg-white">
              {loading && (
                <div className="p-4 text-center">Đang tải thông báo...</div>
              )}
              {error && (
                <div className="p-4 text-center text-red-500">{error}</div>
              )}

              {!loading &&
                !error &&
                activeFolder === "inbox" &&
                activeTab === "notifications" && (
                  <SalaryNotificationList
                    notifications={currentItems}
                    onSelect={(item) => {
                      const index = currentItems.findIndex(
                        (i) => i.NotificationID === item.NotificationID
                      );
                      if (index !== -1) {
                        setSelectedEmailIndex(index);
                        setShowEmailDetail(true);
                      }
                    }}
                  />
                )}

              {!loading &&
                !error &&
                activeFolder === "inbox" &&
                activeTab === "anniversaries" && (
                  <AnniversaryNotifications
                    notifications={currentItems}
                    error={error}
                    onSelect={(item) => {
                      const index = currentItems.findIndex(
                        (i) => i.NotificationID === item.NotificationID
                      );
                      if (index !== -1) {
                        setSelectedEmailIndex(index);
                        setShowEmailDetail(true);
                      }
                    }}
                  />
                )}

              {!loading && !error && activeFolder === "sent" && (
                <SentNotificationList
                  notifications={currentItems}
                  onSelect={(item) => {
                    const index = currentItems.findIndex(
                      (i) => i.NotificationID === item.NotificationID
                    );
                    if (index !== -1) {
                      setSelectedEmailIndex(index);
                      setShowEmailDetail(true);
                    }
                  }}
                />
              )}

              {!loading &&
                !error &&
                (activeFolder === "trash" || activeFolder === "pinned") &&
                currentItems.map((item, idx) => (
                  <div
                    key={item?.NotificationID || item?.title || idx}
                    onClick={() => handleEmailClick(idx)}
                    className="w-full py-3 border-b border-gray-200 pl-4 flex gap-[35px] hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-[20%] flex gap-2.5 items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium truncate">
                          Phòng Nhân sự
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          hr@company.com
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col pr-4 overflow-hidden">
                      <div className="flex justify-between">
                        <span className="font-medium truncate">
                          {item?.Message || item?.Title || "Không có tiêu đề"}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {item?.CreatedAt
                            ? new Date(item?.CreatedAt).toLocaleString("vi-VN")
                            : item?.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {item?.Message ||
                          item?.preview ||
                          "Không có nội dung xem trước."}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Compose Window */}
      {showCompose && (
        <div className="fixed bottom-5 right-5 w-[400px] bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <strong>Thư mới</strong>
            <button
              className="bg-transparent border-none text-lg cursor-pointer"
              onClick={() => setShowCompose(false)}
            >
              &times;
            </button>
          </div>
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Loại thông báo:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={composeAlertType}
                onChange={(e) => setComposeAlertType(e.target.value)}
              >
                <option value="payroll">Thông báo lương</option>
                <option value="leave_exceed">Vượt quá ngày nghỉ phép</option>
                <option value="salary_discrepancy">Sai lệch lương</option>
                <option value="anniversary">Kỷ niệm</option>
              </select>
            </div>
            {composeAlertType === "anniversary" && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Đối tượng nhận:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={composeTargetType}
                  onChange={(e) => setComposeTargetType(e.target.value)}
                >
                  <option value="individual">Cá nhân</option>
                  <option value="all">Tất cả nhân viên</option>
                </select>
              </div>
            )}
            {composeTargetType === "individual" && (
              <input
                type="text"
                placeholder="Đến (EmployeeID)"
                className="w-full mt-2.5 p-2 border border-gray-300 rounded"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
              />
            )}
            {(composeTargetType === "individual" || composeTargetType === "all") && (<input
              type="datetime-local"
              placeholder="Ngày kỷ niệm"
              className="w-full mt-2.5 p-2 border border-gray-300 rounded"
              value={AviverDate}
              onChange={(e) => setAviverDate(e.target.value)}
            />)}
            <textarea
              rows={5}
              placeholder="Nội dung"
              className="w-full mt-2.5 p-2 border border-gray-300 rounded"
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
            ></textarea>
            <button
              onClick={handleActualSend}
              className="mt-2.5 bg-green-600 text-white p-2 border-none cursor-pointer rounded w-full hover:bg-green-700"
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* Compose button */}
      {!showCompose && (
        <div
          className="fixed bottom-5 right-5 w-auto h-auto"
          onClick={() => setShowCompose(true)}
        >
          <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
