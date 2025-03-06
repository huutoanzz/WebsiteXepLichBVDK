// src/AccountPage.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '/DOAN/UngDungXepLichBenhVienDaKhoa/src/contexts/UserContext';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React from 'react';
import { Toast } from 'primereact/toast';
import '/DOAN/UngDungXepLichBenhVienDaKhoa/src/pages/Form.css';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Doctor {
  _id: string;
  iD_bacSi: string;
  hoTen: string;
  iD_chuyenKhoa: string;
  gioiTinh: string;
  sdt: string;
  email: string;
  diaChi: string;
  ghiChu: string;
  chiTieu: number;
  ngayDaLam: number;
}

interface Specialization {
  _id: string;
  specializationId: string;
  specializationName: string;
  notes: string;
}

const AccountPage = () => {
  const { user } = useContext(UserContext)!;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const toast = React.useRef<Toast>(null);
  const [doctorForm, setDoctorForm] = useState<Doctor | null>(null);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Fetch all specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('https://localhost:7183/api/Specialization');
        setSpecializations(response.data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (user && user.doctorId) {
        try {
          const response = await axios.get<Doctor>(`https://localhost:7183/api/Doctor/${user.doctorId}`);
          setDoctor(response.data);
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
      }
    };

    fetchDoctor();
  }, [user]);

  const handleEditButtonClick = () => {
    if (doctor) {
      setDoctorForm({ ...doctor });
      setEditDialogVisible(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent) => {
    const { name, value } = e.target || e;
    setDoctorForm((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu xác nhận không khớp!',
        life: 3000
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu phải dài ít nhất 6 ký tự!',
        life: 3000
      });
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(newPassword)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        life: 3000
      });
      return;
    }

    try {
      const requestData = {
        userId: user?.userId,
        oldPassword,
        newPassword,
        confirmNewPassword: newPassword,
      };

      const response = await axios.post(
        `https://localhost:7183/api/User/change-password`,
        requestData
      );

      if (response.status === 200) {
        toast.current?.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đổi mật khẩu thành công!',
          life: 3000
        });
        setPasswordDialogVisible(false);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Đổi mật khẩu thất bại!',
          life: 3000
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Đổi mật khẩu thất bại!',
        life: 3000
      });
      console.error('Error changing password:', error);
    }
  };
  const updateDoctor = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức regex để kiểm tra định dạng email
    const phoneRegex = /^[0-9]{9,11}$/; // Biểu thức regex để kiểm tra số điện thoại (9-11 chữ số)
  
    if (!doctorForm?.hoTen) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập họ tên bác sĩ!', life: 3000 });
      }
      return;
    }
    if (!doctorForm.iD_chuyenKhoa) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mã chuyên khoa!', life: 3000 });
      }
      return;
    }
    if (!doctorForm.gioiTinh) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn giới tính!', life: 3000 });
      }
      return;
    }
    if (!doctorForm.sdt) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập số điện thoại!', life: 3000 });
      }
      return;
    }
    if (!phoneRegex.test(doctorForm.sdt)) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại không đúng định dạng! Vui lòng nhập từ 9-11 chữ số.', life: 3000 });
      }
      return;
    }
    if (!doctorForm.email) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập email!', life: 3000 });
      }
      return;
    }
    if (!emailRegex.test(doctorForm.email)) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Email không đúng định dạng!', life: 3000 });
      }
      return;
    }
    if (!doctorForm.diaChi) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập địa chỉ!', life: 3000 });
      }
      return;
    }
    try {
      if (doctorForm) {
        await axios.put(`https://localhost:7183/api/Doctor/${doctorForm.iD_bacSi}`, doctorForm);
        setDoctor(doctorForm);
        setEditDialogVisible(false);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin thành công!', life: 3000 });
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại!', life: 3000 });
    }
  };

  if (!user) {
    return <p className="text-center text-red-500">Bạn cần đăng nhập để xem thông tin tài khoản.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-6 text-center">Thông tin tài khoản</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* User information column */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Thông tin User</h2>
          <ul className="space-y-2">
            <li><strong>User ID:</strong> {user.userId}</li>
            <li><strong>Username:</strong> {user.username}</li>
            {/* <li className="flex items-center">
              <strong className="mr-2">Password:</strong>
              <span className="mr-2">{ '●'.repeat(user.password.length)}</span>
            </li> */}
            <li><strong>Role:</strong> {user.role}</li>
          </ul>
          <Button
            label="Đổi mật khẩu"
            icon="pi pi-key"
            className="mt-4"
            onClick={() => setPasswordDialogVisible(true)}
          />
        </div>

        {/* Doctor information column */}
        {doctor ? (
          <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Thông tin Bác sĩ</h2>
            <ul className="space-y-2">
              <li><strong>Mã bác sĩ:</strong> {doctor.iD_bacSi}</li>
              <li><strong>Họ tên:</strong> {doctor.hoTen}</li>
              <li><strong>Mã chuyên khoa:</strong> {doctor.iD_chuyenKhoa}</li>
              <li><strong>Giới tính:</strong> {doctor.gioiTinh}</li>
              <li><strong>SĐT:</strong> {doctor.sdt}</li>
              <li><strong>Email:</strong> {doctor.email}</li>
              <li><strong>Địa chỉ:</strong> {doctor.diaChi}</li>
              <li><strong>Ghi chú:</strong> {doctor.ghiChu}</li>
            </ul>
            <Button label="Chỉnh sửa" icon="pi pi-pencil" className="mt-4" onClick={handleEditButtonClick} />
          </div>
        ) : (
          <p>Không có thông tin bác sĩ.</p>
        )}
      </div>

      <Dialog
        visible={passwordDialogVisible}
        onHide={() => setPasswordDialogVisible(false)}
        header="Đổi mật khẩu"
        className='w-full max-w-lg mx-auto'
        footer={
          <Button
            label="Đổi mật khẩu"
            icon="pi pi-check"
            onClick={handleChangePassword}
            className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-md"
          />
        }
      >
        <div className="space-y-4 p-4">
          <div className="flex flex-col">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
            <div className="relative">
              <InputText
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Button
                icon={showOldPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowOldPassword(!showOldPassword)}
                type="button"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <div className="relative">
              <InputText
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Button
                icon={showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
                type="button"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <InputText
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Button
                icon={showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              />
            </div>
          </div>
        </div>
      </Dialog>
      {/* Dialog for editing doctor information */}
      <Dialog
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        header="Chỉnh sửa thông tin bác sĩ"
        className="w-full max-w-lg mx-auto"
      >
        {doctorForm && (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="hoTen" className="font-medium mb-1">Họ tên</label>
              <InputText
                id="hoTen"
                name="hoTen"
                value={doctorForm.hoTen}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
            <label htmlFor="iD_chuyenKhoa">Mã chuyên khoa</label>
                <Dropdown
                  id="iD_chuyenKhoa"
                  value={doctorForm.iD_chuyenKhoa}
                  options={specializations.map((spec) => spec.specializationId)}
                  onChange={(e) => setDoctorForm({ ...doctorForm, iD_chuyenKhoa: e.value })}
                  placeholder="Chọn chuyên khoa"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
          </div>
          
            <div className="flex flex-col">
              <label htmlFor="gioiTinh" className="font-medium mb-1">Giới tính</label>
              <Dropdown
                id="gioiTinh"
                name="gioiTinh"
                value={doctorForm.gioiTinh}
                options={['Nam', 'Nữ', 'Khác']}
                onChange={handleInputChange}
                placeholder="Chọn giới tính"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="sdt" className="font-medium mb-1">Số điện thoại</label>
              <InputText
                id="sdt"
                name="sdt"
                value={doctorForm.sdt}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium mb-1">Email</label>
              <InputText
                id="email"
                name="email"
                value={doctorForm.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="diaChi" className="font-medium mb-1">Địa chỉ</label>
              <InputText
                id="diaChi"
                name="diaChi"
                value={doctorForm.diaChi}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              label="Lưu"
              icon="pi pi-save"
              className="bg-blue-500 text-white hover:bg-blue-600 mt-4 rounded-md px-4 py-2"
              onClick={updateDoctor}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AccountPage;
