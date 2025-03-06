import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Form.css';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

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

interface Specialization {
  _id: string;
  specializationId: string;
  specializationName: string;
  notes: string;
}

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
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

  const [doctorForm, setDoctorForm] = useState<Doctor>({
    _id: '',
    iD_bacSi: '',
    hoTen: '',
    iD_chuyenKhoa: '',
    gioiTinh: '',
    sdt: '',
    email: '',
    diaChi: '',
    ghiChu: '',
    chiTieu: 0,
    ngayDaLam: 0,
  });
  const resetForm = () => {
    setDoctorForm({
      _id: '',
      iD_bacSi: '',
      hoTen: '',
      iD_chuyenKhoa: '',
      gioiTinh: '',
      sdt: '',
      email: '',
      diaChi: '',
      ghiChu: '',
      chiTieu: 0,
      ngayDaLam: 0,
    });
  };
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.hoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.iD_bacSi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toast = React.useRef<Toast>(null);

  const addDoctor = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức regex để kiểm tra định dạng email
    const phoneRegex = /^[0-9]{9,11}$/; // Biểu thức regex để kiểm tra số điện thoại (9-11 chữ số)
  
    if (!doctorForm.iD_bacSi) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập id cho bác sĩ!', life: 3000 });
      }
      return;
    }
    if (!doctorForm.hoTen) {
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
      const response = await axios.post<Doctor>('https://localhost:7183/api/Doctor', doctorForm);
      setDoctors((prevDoctors: Doctor[]) => [...prevDoctors, response.data]);
      setDialogVisible(false);
      setDoctorForm({ _id: '', iD_bacSi: '', hoTen: '', iD_chuyenKhoa: '', gioiTinh: '', sdt: '', email: '', diaChi: '', ghiChu: '', chiTieu: 0, ngayDaLam: 0 });
      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Bác sĩ đã được thêm!', life: 3000 });
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm bác sĩ! Kiểm tra ID và email!', life: 3000 });
      }
    }
  };

  const updateDoctor = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức regex để kiểm tra định dạng email
    const phoneRegex = /^[0-9]{9,11}$/; // Biểu thức regex để kiểm tra số điện thoại (9-11 chữ số)
  
    if (!doctorForm.hoTen) {
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
      await axios.put(`https://localhost:7183/api/Doctor/${doctorForm.iD_bacSi}`, doctorForm);
      setDoctors((prevDoctors: Doctor[]) =>
        prevDoctors.map(doctor => (doctor.iD_bacSi === doctorForm.iD_bacSi ? doctorForm : doctor))
      );
      setEditDialogVisible(false);
      setDoctorForm({ _id: '', iD_bacSi: '', hoTen: '', iD_chuyenKhoa: '', gioiTinh: '', sdt: '', email: '', diaChi: '', ghiChu: '', chiTieu: 0, ngayDaLam: 0 });
      if (toast.current) {
        toast.current.show({ severity: 'warn', summary: 'Cập nhật', detail: 'Bác sĩ đã được cập nhật!', life: 3000 });
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật bác sĩ! Kiểm tra email!', life: 3000 });
      }
    }
  };

  const deleteDoctor = async () => {
    if (doctorToDelete) {
      try {
        await axios.delete(`https://localhost:7183/api/Doctor/${doctorToDelete.iD_bacSi}`);
        setDoctors((prevDoctors: Doctor[]) => prevDoctors.filter(doctor => doctor.iD_bacSi !== doctorToDelete.iD_bacSi));
        setDeleteDialogVisible(false);
        setDoctorToDelete(null);
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Bác sĩ đã được xóa!', life: 3000 });
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        if (toast.current) {
          toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa bác sĩ!', life: 3000 });
        }
      }
    }
  };

  const confirmDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setDeleteDialogVisible(true);
  };

  const openEditDialog = (doctor: Doctor) => {
    setDoctorForm(doctor);
    setEditDialogVisible(true);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Danh sách bác sĩ</h2><br></br>
      <InputText
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm bác sĩ (mã hoặc họ tên)..."
          className="p-inputtext-custom rounded-md shadow-sm mb-3"
        />
      <Button
        label="Thêm bác sĩ"
        icon="pi pi-plus"
        onClick={() => setDialogVisible(true)}
        className=" rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300"
      />
      <DataTable
        value={filteredDoctors}
        className="mt-4 border border-gray-300 rounded-lg shadow-sm"
        paginator
        rows={10}
        tableStyle={{ minWidth: '70rem' }}
      >

        <Column field="iD_bacSi" header="Mã bác sĩ" className="font-semibold px-4 py-2 text-left " />
        <Column field="hoTen" header="Họ tên" className="font-semibold px-4 py-2 text-left"  />
        <Column field="iD_chuyenKhoa" header="Mã chuyên khoa" className="font-semibold px-4 py-2 text-left" />
        <Column field="gioiTinh" header="Giới tính" className="font-semibold px-4 py-2 text-left" />
        <Column field="sdt" header="Số điện thoại" className="font-semibold px-4 py-2 text-left" />
        <Column field="email" header="Email" className="font-semibold px-4 py-2 text-left" />
        <Column field="diaChi" header="Địa chỉ" className="font-semibold px-4 py-2 text-left" />
        <Column field="ghiChu" header="Ghi chú" className="font-semibold px-4 py-2 text-left" />
        {/* <Column field="chiTieu" header="Chỉ tiêu" className="font-semibold px-4 py-2 text-left" />
        <Column field="ngayDaLam" header="Ngày đã làm" className="font-semibold px-4 py-2 text-left" /> */}
        <Column
          header="Hành động"
          body={(doctor: Doctor) => (
            <div className="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                onClick={() => openEditDialog(doctor)}
                className="p-button-warning p-button-text hover:bg-yellow-100"
                aria-label="Chỉnh sửa"
              />
              <Button
                icon="pi pi-trash"
                onClick={() => confirmDelete(doctor)}
                className="p-button-danger p-button-text hover:bg-red-100"
                aria-label="Xóa"
              />
            </div>
          )}
          className="text-center px-4 py-2"
        />
      </DataTable>

      <Dialog
      header="Thêm bác sĩ"
      visible={dialogVisible}
      onHide={() => setDialogVisible(false)}
      className="p-dialog-custom"
    >
      <div className="p-field mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Mã bác sĩ</label>
        <InputText
          id="idbacsi"
          value={doctorForm.iD_bacSi}
          onChange={(e) => setDoctorForm({ ...doctorForm, iD_bacSi: e.target.value })}
          className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div className="p-field mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên bác sĩ</label>
        <InputText
          id="name"
          value={doctorForm.hoTen}
          onChange={(e) => setDoctorForm({ ...doctorForm, hoTen: e.target.value })}
          className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                onChange={(e) => setDoctorForm({ ...doctorForm, gioiTinh: e.target.value })}
                placeholder="Chọn giới tính"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <InputText
              id="phone"
              value={doctorForm.sdt}
              onChange={(e) => setDoctorForm({ ...doctorForm, sdt: e.target.value })}
              className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <div className="p-field mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="email"
              value={doctorForm.email}
              onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
              className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <div className="p-field mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <InputText
              id="address"
              value={doctorForm.diaChi}
              onChange={(e) => setDoctorForm({ ...doctorForm, diaChi: e.target.value })}
              className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <div className="p-field mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <InputText
              id="notes"
              value={doctorForm.ghiChu}
              onChange={(e) => setDoctorForm({ ...doctorForm, ghiChu: e.target.value })}
              className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>


          <div className="flex justify-end space-x-2">
            <Button
              label="Lưu"
              icon="pi pi-check"
              onClick={addDoctor}
              className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-colors duration-300"
            />
          </div>
        </Dialog>


    <Dialog
        header="Chỉnh sửa bác sĩ"
        visible={editDialogVisible}
        onHide={() => {setEditDialogVisible(false);resetForm();}}
        className="p-dialog-custom"
      >
        <div className="p-field mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên bác sĩ</label>
          <InputText
            id="name"
            value={doctorForm.hoTen}
            onChange={(e) => setDoctorForm({ ...doctorForm, hoTen: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
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
                onChange={(e) => setDoctorForm({ ...doctorForm, gioiTinh: e.target.value })}
                placeholder="Chọn giới tính"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <InputText
            id="phone"
            value={doctorForm.sdt}
            onChange={(e) => setDoctorForm({ ...doctorForm, sdt: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <InputText
            id="email"
            value={doctorForm.email}
            onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <InputText
            id="address"
            value={doctorForm.diaChi}
            onChange={(e) => setDoctorForm({ ...doctorForm, diaChi: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <InputText
            id="notes"
            value={doctorForm.ghiChu}
            onChange={(e) => setDoctorForm({ ...doctorForm, ghiChu: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
        </div>

      

        <div className="flex justify-end space-x-2">
          <Button
            label="Cập nhật"
            icon="pi pi-check"
            onClick={updateDoctor}
            className="bg-yellow-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-yellow-600 transition-colors duration-300"
          />
        </div>
      </Dialog>

      <Dialog
      header="Xác nhận xóa"
      visible={deleteDialogVisible}
      onHide={() => setDeleteDialogVisible(false)}
      className="p-dialog-delete"
    >
      <p className="text-gray-700">Bạn có chắc chắn muốn xóa bác sĩ này không?</p>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          label="Hủy"
          icon="pi pi-times"
          onClick={() => setDeleteDialogVisible(false)}
          className="p-button-secondary bg-gray-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-gray-600 transition-colors duration-300"
        />
        <Button
          label="Xóa"
          icon="pi pi-trash"
          onClick={deleteDoctor}
          className="p-button-danger bg-red-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-red-600 transition-colors duration-300"
        />
      </div>
    </Dialog>
    </div>
  );
};

export default DoctorList;

