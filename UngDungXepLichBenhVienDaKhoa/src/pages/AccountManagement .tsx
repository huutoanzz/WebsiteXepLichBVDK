import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

interface Account {
  _id: string;
  userId: string;
  username: string;
  role: string;
  password: string;
  doctorId: string;
}
interface Doctor {
  _id: string;           // MongoDB ObjectId
  iD_bacSi: string;     // Mã bác sĩ
  hoTen: string;        // Họ tên
  iD_chuyenKhoa: string; // Mã chuyên khoa
  gioiTinh: string;     // Giới tính
  sdt: string;          // Số điện thoại
  email: string;        // Email
  diaChi: string;       // Địa chỉ
  ghiChu: string;       // Ghi chú
  chiTieu: number;      // Chỉ tiêu
  ngayDaLam: number;    // Ngày đã làm
}

const AccountManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get<Doctor[]>('https://localhost:7183/api/Doctor');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountForm, setAccountForm] = useState<Account>({
    _id: '',
    userId: '',
    username: '',
    password: '',
    role: '',
    doctorId: ''
  });

  const resetForm = () => {
    setAccountForm({
      _id: '',
      userId: '',
      username: '',
      password: '',
      role: '',
      doctorId: ''
    });
  };

  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const toast = React.useRef<Toast>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
  };


  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAccount = accounts.filter((account) =>
    account.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://localhost:7183/api/User');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const openAddDialog = () => {
    setAccountForm({ _id: '', userId: '', username: '', role: '', password: '',doctorId:'' });
    setAddDialogVisible(true);
  };

  const addAccount = async () => {
    if (!accountForm.userId) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'ID tài khoản là bắt buộc!', life: 3000 });
      return;
    }
    if (!accountForm.username) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên tài khoản là bắt buộc!', life: 3000 });
      return;
    }
    if (accountForm.username.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên tài khoản phải dài ít nhất 6 ký tự!',
        life: 3000
      });
      return;
    }
    if (!accountForm.password) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu là bắt buộc!', life: 3000 });
      return;
    }
    if (accountForm.password.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu mới phải dài ít nhất 6 ký tự!',
        life: 3000
      });
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(accountForm.password)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        life: 3000
      });
      return;
    }
    if (!accountForm.role) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn vai trò!', life: 3000 });
      return;
    }
    try {
      const response = await axios.post('https://localhost:7183/api/User', accountForm);
      setAccounts((prev) => [...prev, response.data]);
      setAddDialogVisible(false);
      setAccountForm({ _id: '', userId: '', username: '', role: '', password: '',doctorId:'' });
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tài khoản đã được thêm!', life: 3000 });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Tài khoản không được thêm! Kiểm tra ID tài khoản và Tên tài khoản', life: 3000 });
      console.error('Error adding account:', error);
    }
  };


  const updateAccount = async () => {
    if (!accountForm.username) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên tài khoản là bắt buộc!', life: 3000 });
      return;
    }
    if (accountForm.username.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên tài khoản phải dài ít nhất 6 ký tự!',
        life: 3000
      });
      return;
    }
    if (!accountForm.password) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu là bắt buộc!', life: 3000 });
      return;
    }
    if (accountForm.password.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu mới phải dài ít nhất 6 ký tự!',
        life: 3000
      });
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(accountForm.password)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        life: 3000
      });
      return;
    }
    if (!accountForm.role) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn vai trò!', life: 3000 });
      return;
    }
    try {
      // Cập nhật tài khoản qua PUT request
      await axios.put(`https://localhost:7183/api/User/${accountForm.userId}`, accountForm);
      // Cập nhật dữ liệu tài khoản trong bảng
      setAccounts((prev) =>
        prev.map((account) => (account.userId === accountForm.userId ? accountForm : account))
      );
      
      setEditDialogVisible(false);
      setAccountForm({ _id: '', userId: '', username: '', role: '', password: '',doctorId:'' });
      
      // Thông báo thành công
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tài khoản đã được cập nhật!', life: 3000 });
      
      // Tải lại danh sách tài khoản từ API (đảm bảo bảng được cập nhật)
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi cập nhật tài khoản! Kiểm tra tên người dùng!', life: 3000 });
    }
  };
  
  const deleteAccount = async () => {
    if (!accountToDelete) return;
    try {
      // Delete account via DELETE request
      await axios.delete(`https://localhost:7183/api/User/${accountToDelete.userId}`);
      // Remove the account from the local state
      setAccounts((prev) => prev.filter((account) => account.userId !== accountToDelete.userId));
      setDeleteDialogVisible(false);
      setAccountToDelete(null);
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tài khoản đã được xóa!', life: 3000 });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi xóa tài khoản!', life: 3000 });
    }
  };


  const openEditDialog = (account: Account) => {
    setAccountForm(account);
    setEditDialogVisible(true);
  };

  const confirmDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogVisible(true);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Quản lý tài khoản</h2><br />
      <InputText
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài khoản (id hoặc username) ..."
          className="p-inputtext-custom rounded-md shadow-sm mb-3"
        />
      <Button label="Thêm tài khoản" icon="pi pi-plus" onClick={openAddDialog} className="rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300" />
      <DataTable value={filteredAccount} paginator rows={10} className="mt-4">
        <Column field="userId" header="ID" />
        <Column field="username" header="Tên tài khoản" />
        <Column field="role" header="Vai trò" />
        <Column field="doctorId" header="Mã bác sĩ" />
        <Column
          header="Hành động"
          body={(account: Account) => (
            <div className="flex space-x-2">
              <Button icon="pi pi-pencil" onClick={() => openEditDialog(account)} className="p-button-warning p-button-text hover:bg-yellow-100" />
              <Button icon="pi pi-trash" onClick={() => confirmDeleteAccount(account)} className="p-button-danger p-button-text hover:bg-red-100" />
            </div>
          )}
        />
      </DataTable>

      {/* Dialog for Adding Account */}
      <Dialog header="Thêm tài khoản" visible={addDialogVisible} onHide={() => {setAddDialogVisible(false);resetForm();}} className="p-dialog-custom">
        <div className="p-field mb-4">
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">ID Tài khoản</label>
          <InputText id="userId" value={accountForm.userId} onChange={(e) => setAccountForm({ ...accountForm, userId: e.target.value })} className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div className="p-field mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
          <InputText id="username" value={accountForm.username} onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })} className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div className="p-field mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <InputText
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={accountForm.password}
            onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md"
          />
          <Button
            type="button"
            icon={isPasswordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-8 text-gray-600 hover:text-gray-900"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              id="role"
              value={accountForm.role}
              onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Chọn vai trò</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="doctors">Doctors</option>
            </select>
          </div>
        <div className="flex flex-col">
            <label htmlFor="doctorId">Mã bác sĩ</label>
            <Dropdown
              id="doctorId"
              value={accountForm.doctorId}
              options={doctors.map((doc) => doc.iD_bacSi)}
              onChange={(e) => setAccountForm({ ...accountForm, doctorId: e.value })}
              placeholder="Chọn mã bác sĩ"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
      </div>
        <Button label="Thêm" icon="pi pi-check" onClick={addAccount} className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300" />
      </Dialog>

     
      <Dialog header="Chỉnh sửa tài khoản" visible={editDialogVisible} onHide={() => setEditDialogVisible(false)} className="p-dialog-custom">
        <div className="p-field mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
          <InputText id="username" value={accountForm.username} onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })} className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div className="p-field mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <InputText
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={accountForm.password}
            onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md"
          />
          <Button
            type="button"
            icon={isPasswordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-8 text-gray-600 hover:text-gray-900"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              id="role"
              value={accountForm.role}
              onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Chọn vai trò</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="doctors">Doctors</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="doctorId">Mã bác sĩ</label>
            <Dropdown
              id="doctorId"
              value={accountForm.doctorId}
              options={doctors.map((doc) => doc.iD_bacSi)}
              onChange={(e) => setAccountForm({ ...accountForm, doctorId: e.value })}
              placeholder="Chọn mã bác sĩ"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
      </div>
        <Button label="Cập nhật" icon="pi pi-check" onClick={updateAccount} className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300" />
      </Dialog>

      {/* Dialog for Confirming Delete */}
      <Dialog header="Xác nhận xóa" visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)} className="p-dialog-delete">
        <div>
          <p>Bạn có chắc chắn muốn xóa tài khoản "{accountToDelete?.username}" không?</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button label="Hủy" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} className="p-button-secondary" />
          <Button label="Xóa" icon="pi pi-check" onClick={deleteAccount} className="p-button-danger" />
        </div>
      </Dialog>
    </div>
  );
};

export default AccountManagement;
