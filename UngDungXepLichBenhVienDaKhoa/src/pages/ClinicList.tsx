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

interface Clinic {
  _id: string;         
  clinicId: string;   
  idChuyenKhoa: string;
  clinicName: string; 
  address: string;     
  phone: string;   
}

interface Specialization {
  _id: string;
  specializationId: string;
  specializationName: string;
  notes: string;
}

const ClinicList = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const [clinicForm, setClinicForm] = useState<Clinic>({
    _id: '',
    clinicId: '',
    idChuyenKhoa: '',
    clinicName: '',
    address: '',
    phone: ''
  });

  const resetForm = () => {
    setClinicForm({
      _id: '',
      clinicId: '',
      idChuyenKhoa: '',
      clinicName: '',
      address: '',
      phone: ''
    });
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get<Clinic[]>('https://localhost:7183/api/Clinic');
        setClinics(response.data);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      }
    };

    fetchClinics();
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

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<Clinic | null>(null);
  const toast = React.useRef<Toast>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredClinics = clinics.filter((clinic) =>
    clinic.clinicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addClinic = async () => {
    if (!clinicForm.clinicId) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mã phòng khám!', life: 3000 });
      }
      return;
    }
    if (!clinicForm.idChuyenKhoa) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mã chuyên khoa!', life: 3000 });
      }
      return;
    }
    if (!clinicForm.clinicName) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tên phòng khám!', life: 3000 });
      }
      return;
    }
    if (clinicForm.clinicName.length<6) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên phòng khám ít nhất 6 ký tự !', life: 3000 });
      }
      return;
    }
    if (!clinicForm.address) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập địa chỉ phòng khám!', life: 3000 });
      }
      return;
    }
    if (clinicForm.address.length<10) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Địa chỉ phòng khám ít nhất 10 ký tự !!', life: 3000 });
      }
      return;
    }
    if (!clinicForm.phone) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập số điện thoại phòng khám!', life: 3000 });
      }
      return;
    }
    const phoneRegex = /^[0-9]{9,11}$/; // Biểu thức regex để kiểm tra số điện thoại (9-11 chữ số)
    if (!phoneRegex.test(clinicForm.phone)) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại không đúng định dạng! Vui lòng nhập từ 9-11 chữ số.', life: 3000 });
      }
      return;
    }
    try {
      const response = await axios.post<Clinic>('https://localhost:7183/api/Clinic', clinicForm);
      setClinics((prevClinics: Clinic[]) => [...prevClinics, response.data]);
      setDialogVisible(false);
      setClinicForm({ _id: '', clinicId: '',idChuyenKhoa:'', clinicName: '', address: '', phone: '' });
      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Phòng khám đã được thêm!', life: 3000 });
      }
    } catch (error) {
      console.error('Error adding clinic:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm phòng khám!Kiểm tra ID, tên phòng và địa chỉ!', life: 3000 });
      }
    }
  };

  const updateClinic = async () => {
    if (!clinicForm.clinicName) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tên phòng khám!', life: 3000 });
      }
      return;
    }
    if (clinicForm.clinicName.length<6) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên phòng khám ít nhất 6 ký tự !', life: 3000 });
      }
      return;
    }
    if (!clinicForm.address) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập địa chỉ phòng khám!', life: 3000 });
      }
      return;
    }
    if (clinicForm.address.length<10) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Địa chỉ phòng khám ít nhất 10 ký tự !!', life: 3000 });
      }
      return;
    }
    if (!clinicForm.phone) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập số điện thoại phòng khám!', life: 3000 });
      }
      return;
    }
    const phoneRegex = /^[0-9]{9,11}$/; // Biểu thức regex để kiểm tra số điện thoại (9-11 chữ số)
    if (!phoneRegex.test(clinicForm.phone)) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại không đúng định dạng! Vui lòng nhập từ 9-11 chữ số.', life: 3000 });
      }
      return;
    }
    try {
      await axios.put(`https://localhost:7183/api/Clinic/${clinicForm.clinicId}`, clinicForm);
      setClinics((prevClinics: Clinic[]) =>
        prevClinics.map(clinic => (clinic.clinicId === clinicForm.clinicId ? clinicForm : clinic))
      );
      setEditDialogVisible(false);
      setClinicForm({ _id: '', clinicId: '',idChuyenKhoa:'', clinicName: '', address: '', phone: '' });
      if (toast.current) {
        toast.current.show({ severity: 'warn', summary: 'Cập nhật', detail: 'Phòng khám đã được cập nhật!', life: 3000 });
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật phòng khám!Kiểm tra tên phòng và địa chỉ!', life: 3000 });
      }
    }
  };

  const deleteClinic = async () => {
    if (clinicToDelete) {
      try {
        await axios.delete(`https://localhost:7183/api/Clinic/${clinicToDelete.clinicId}`);
        setClinics((prevClinics: Clinic[]) => prevClinics.filter(clinic => clinic.clinicId !== clinicToDelete.clinicId));
        setDeleteDialogVisible(false);
        setClinicToDelete(null);
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Phòng khám đã được xóa!', life: 3000 });
        }
      } catch (error) {
        console.error('Error deleting clinic:', error);
        if (toast.current) {
          toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa phòng khám!', life: 3000 });
        }
      }
    }
  };


  const confirmDelete = (clinic: Clinic) => {
    setClinicToDelete(clinic);
    setDeleteDialogVisible(true);
  };

  const openEditDialog = (clinic: Clinic) => {
    setClinicForm(clinic);
    setEditDialogVisible(true);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Danh sách phòng khám</h2><br></br>
      <InputText
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm phòng khám (id hoặc tên)..."
          className="p-inputtext-custom rounded-md shadow-sm mb-3"
        />
      <Button
        label="Thêm phòng khám"
        icon="pi pi-plus"
        onClick={() => setDialogVisible(true)}
        className="rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300"
      />
      <DataTable
        value={filteredClinics}
        className="mt-4 border border-gray-300 rounded-lg shadow-sm"
        paginator
        rows={10}
        tableStyle={{ minWidth: '70rem' }}
      >
        <Column field="clinicId" header="ID phòng khám" className="font-semibold px-4 py-2 text-left" />
        <Column field="idChuyenKhoa" header="ID chuyên khoa" className="font-semibold px-4 py-2 text-left" />
        <Column field="clinicName" header="Tên phòng khám" className="font-semibold px-4 py-2 text-left" />
        <Column field="address" header="Địa chỉ" className="font-semibold px-4 py-2 text-left" />
        <Column field="phone" header="Số điện thoại" className="font-semibold px-4 py-2 text-left" />
        <Column
          header="Hành động"
          body={(clinic: Clinic) => (
            <div className="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                onClick={() => openEditDialog(clinic)}
                className="p-button-warning p-button-text hover:bg-yellow-100"
                aria-label="Chỉnh sửa"
              />
              <Button
                icon="pi pi-trash"
                onClick={() => confirmDelete(clinic)}
                className="p-button-danger p-button-text hover:bg-red-100"
                aria-label="Xóa"
              />
            </div>
          )}
          className="text-center px-4 py-2"
        />
      </DataTable>

      {/* Dialog thêm phòng khám */}
      <Dialog
        header="Thêm phòng khám"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        className="p-dialog-custom"
      >
        <div className="flex flex-col">
          <label htmlFor="idClicnic" className="block text-sm font-medium text-gray-700">Mã phòng khám</label>
          <InputText
            id="idclinic"
            value={clinicForm.clinicId}
            onChange={(e) => setClinicForm({ ...clinicForm, clinicId: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex flex-col">
            <label htmlFor="iD_chuyenKhoa">Mã chuyên khoa</label>
                <Dropdown
                  id="iD_chuyenKhoa"
                  value={clinicForm.idChuyenKhoa}
                  options={specializations.map((spec) => spec.specializationId)}
                  onChange={(e) => setClinicForm({ ...clinicForm, idChuyenKhoa: e.value })}
                  placeholder="Chọn chuyên khoa"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
          </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên phòng khám</label>
          <InputText
            id="name"
            value={clinicForm.clinicName}
            onChange={(e) => setClinicForm({ ...clinicForm, clinicName: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <InputText
            id="address"
            value={clinicForm.address}
            onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <InputText
            id="phone"
            value={clinicForm.phone}
            onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <Button
          label="Thêm"
          icon="pi pi-check"
          onClick={addClinic}
          className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
        />
      </Dialog>

      {/* Dialog chỉnh sửa phòng khám */}
      <Dialog
        header="Chỉnh sửa phòng khám"
        visible={editDialogVisible}
        onHide={() => {setEditDialogVisible(false); resetForm();}}
        className="p-dialog-custom"
      >
        <div className="flex flex-col">
            <label htmlFor="iD_chuyenKhoa">Mã chuyên khoa</label>
                <Dropdown
                  id="iD_chuyenKhoa"
                  value={clinicForm.idChuyenKhoa}
                  options={specializations.map((spec) => spec.specializationId)}
                  onChange={(e) => setClinicForm({ ...clinicForm, idChuyenKhoa: e.value })}
                  placeholder="Chọn chuyên khoa"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
          </div>
        <div className="p-field mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên phòng khám</label>
          <InputText
            id="name"
            value={clinicForm.clinicName}
            onChange={(e) => setClinicForm({ ...clinicForm, clinicName: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <InputText
            id="address"
            value={clinicForm.address}
            onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <InputText
            id="phone"
            value={clinicForm.phone}
            onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <Button
          label="Cập nhật"
          icon="pi pi-check"
          onClick={updateClinic}
          className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300"
        />
      </Dialog>

      {/* Dialog xóa phòng khám */}
      <Dialog
        header="Xóa phòng khám"
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        className="p-dialog-delete"
        footer={
          <div>
            <Button label="Không" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} className="p-button-text" />
            <Button label="Có" icon="pi pi-check" onClick={deleteClinic} className="p-button-danger" />
          </div>
        }
      >
        <p>Bạn có chắc chắn muốn xóa phòng khám này?</p>
      </Dialog>
    </div>
  );
};

export default ClinicList;