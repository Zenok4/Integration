"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import {
  formatDateForInput,
  sampleAccounts,
  getEmptyAccount,
} from "./utils/account-utils";

// Import components
import AccountFilters from "./components/account-filters";
import AccountTable from "./components/account-table";
import AddAccountModal from "./components/add-account-modal";
import EditAccountModal from "./components/edit-account-modal";
import DeleteAccountModal from "./components/delete-account-modal";
import RoleModal from "./components/role-modal";
import API from "../services/api";
import { formatDateForAPI } from "../utils/dateUtils";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(sampleAccounts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [newAccount, setNewAccount] = useState(getEmptyAccount());
  const [isLoading, setIsLoading] = useState(false);

  // fetch data accounts
  const fetchDataAcounts = async () => {
    try {
      const response = await API.get("/auth/users");
      setAccounts(response?.data.users);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchDataAcounts();
  }, []);

  useEffect(() => {
    fetchDataAcounts();
  }, [isLoading]);

  // Xử lý thêm tài khoản mới
  const handleAddAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newAccount.password !== newAccount.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const res = await API.post("auth/create-user", {
        ...newAccount,
        date_of_birth: formatDateForAPI(newAccount.date_of_birth),
        hire_date: formatDateForAPI(newAccount.hire_date),
      });
      setAccounts([...accounts, res?.data?.users]);
      setNewAccount(getEmptyAccount());
      setShowAddModal(false);
      alert("Thêm tài khoản thành công!");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Xử lý cập nhật tài khoản
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Update Account before: ", { currentAccount });
      // Cập nhật thông tin employee_details
      const updatedAccount = {
        ...currentAccount,
      };

      console.log("Update Account before: ", { updatedAccount });

      // setAccounts(accounts.map((acc) => (acc.id === currentAccount.id ? updatedAccount : acc)))

      console.log("Update Account: ", { updatedAccount });
      const res = await API.put(`/auth/users/update/${currentAccount.id}`, {
        username: updatedAccount?.username,
        email: updatedAccount?.email,
        role: updatedAccount?.role,
        full_name: updatedAccount?.FullName,
        gender: updatedAccount?.Gender,
        phone_number: updatedAccount?.PhoneNumber,
        status: updatedAccount?.Status,
        date_of_birth: updatedAccount.DateOfBirth,
        hire_date: updatedAccount.HireDate,
        password: updatedAccount?.password,
      });
      console.log("Response: ", { res });
      alert("Cập nhật tài khoản thành công!");
      setShowEditModal(false);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  // Xử lý xóa tài khoản
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await API.delete(`/auth/users/delete/${currentAccount.id}`);
      setShowDeleteModal(false);
      alert("Xóa tài khoản thành công!");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  // Xử lý phân quyền
  const handleUpdateRole = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await API.put(`/auth/users/update-role/${currentAccount.id}`, {
        role: currentAccount.role,
      });
      alert("Cập nhật quyền thành công!");
      setShowRoleModal(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEditClick = (account) => {
    // Chuẩn bị dữ liệu cho form chỉnh sửa
    const accountForEdit = {
      ...account,
      password: "",
      confirmPassword: "",
      DateOfBirth: formatDateForInput(account.employee_details?.DateOfBirth),
      HireDate: formatDateForInput(account.employee_details?.HireDate),
      PhoneNumber: account.employee_details?.PhoneNumber || "",
      Gender: account.employee_details?.Gender || "Nam",
    };
    delete accountForEdit?.employee_details;

    setCurrentAccount(accountForEdit);
    setShowEditModal(true);
  };

  // Lọc tài khoản theo điều kiện tìm kiếm và bộ lọc
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole ? account.role === filterRole : true;
    const matchesStatus = filterStatus ? account.Status === filterStatus : true;
    // Tạm thời bỏ qua lọc theo phòng ban vì DepartmentID là null
    const matchesDepartment = true;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  return (
    <div className="p-5">
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            QUẢN LÝ TÀI KHOẢN
          </h3>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={16} />
            Thêm tài khoản
          </button>
        </div>

        {/* Phần tìm kiếm và lọc */}
        <AccountFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
        />

        {/* Bảng danh sách tài khoản */}
        <AccountTable
          accounts={filteredAccounts}
          onEdit={handleEditClick}
          onDelete={(account) => {
            setCurrentAccount(account);
            setShowDeleteModal(true);
          }}
          onRole={(account) => {
            setCurrentAccount(account);
            setShowRoleModal(true);
          }}
        />
      </div>

      {/* Modals */}
      <AddAccountModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAccount}
        newAccount={newAccount}
        setNewAccount={setNewAccount}
      />

      <EditAccountModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateAccount}
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteAccount}
        account={currentAccount}
      />

      <RoleModal
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onUpdate={handleUpdateRole}
        account={currentAccount}
        setAccount={setCurrentAccount}
      />
    </div>
  );
}
