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

interface Specialization {
  _id: string;
  specializationId: string;
  specializationName: string;
  notes: string;
}

const SpecializationList = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const [specializationForm, setSpecializationForm] = useState<Specialization>({
    _id: '',
    specializationId: '',
    specializationName: '',
    notes: ''
  });

  const resetForm = () => {
    setSpecializationForm({
      _id: '',
      specializationId: '',
      specializationName: '',
      notes: ''
    });
  };

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
  const [specializationToDelete, setSpecializationToDelete] = useState<Specialization | null>(null);
  const toast = React.useRef<Toast>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSpecializations = specializations.filter((specialization) =>
    specialization.specializationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    specialization.specializationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addSpecialization = async () => {
    if (!specializationForm.specializationId) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'ID là bắt buộc!', life: 3000 });
      return;
    }
    if (!specializationForm.specializationName) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên chuyên khoa là bắt buộc!', life: 3000 });
      return;
    }
    try {
      const response = await axios.post('https://localhost:7183/api/Specialization', specializationForm);
      setSpecializations((prev) => [...prev, response.data]);
      setDialogVisible(false);
      setSpecializationForm({ _id: '', specializationId: '', specializationName: '', notes: '' });
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Chuyên khoa đã được thêm!', life: 3000 });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Chuyên khoa chưa được thêm! Kiểm tra mã và tên chuyên khoa!', life: 3000 });
    }
  };


  const updateSpecialization = async () => {
    if (!specializationForm.specializationName) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Tên chuyên khoa là bắt buộc!', life: 3000 });
      return;
    }
    try {
      await axios.put(`https://localhost:7183/api/Specialization/${specializationForm.specializationId}`, specializationForm);
      setSpecializations((prev) =>
        prev.map((spec) => (spec.specializationId === specializationForm.specializationId ? specializationForm : spec))
      );
      setEditDialogVisible(false);
      setSpecializationForm({ _id: '', specializationId: '', specializationName: '', notes: '' });
      toast.current?.show({ severity: 'warn', summary: 'Cập nhật', detail: 'Chuyên khoa đã được cập nhật!', life: 3000 });
    } catch{
      toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Chuyên khoa chưa được cập nhật! Kiểm tra tên chuyên khoa!', life: 3000 });
    }
  };

  const deleteSpecialization = async () => {
    try {
      await axios.delete(`https://localhost:7183/api/Specialization/${specializationToDelete?.specializationId}`);
      setSpecializations((prev) => prev.filter((spec) => spec.specializationId !== specializationToDelete?.specializationId));
      setDeleteDialogVisible(false);
      setSpecializationToDelete(null);
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Chuyên khoa đã được xóa!', life: 3000 });
    } catch (error) {
      console.error('Error deleting specialization:', error);
    }
  };

  const confirmDelete = (specialization: Specialization) => {
    setSpecializationToDelete(specialization);
    setDeleteDialogVisible(true);
  };

  const openEditDialog = (specialization: Specialization) => {
    setSpecializationForm(specialization);
    setEditDialogVisible(true);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Danh sách chuyên khoa</h2><br />
      <InputText
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm chuyên khoa (id hoặc tên)..."
          className="p-inputtext-custom rounded-md shadow-sm mb-3"
        />
      <Button
        label="Thêm chuyên khoa"
        icon="pi pi-plus"
        onClick={() => setDialogVisible(true)}
        className="rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300"
      />
      <DataTable
        value={filteredSpecializations}
        className="mt-4 border border-gray-300 rounded-lg shadow-sm"
        paginator
        rows={10}
        tableStyle={{ minWidth: '70rem' }}
      >
        <Column field="specializationId" header="ID" className="font-semibold px-4 py-2 text-left" />
        <Column field="specializationName" header="Tên chuyên khoa" className="font-semibold px-4 py-2 text-left" />
        <Column field="notes" header="Ghi chú" className="font-semibold px-4 py-2 text-left" />
        <Column
          header="Hành động"
          body={(specialization: Specialization) => (
            <div className="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                onClick={() => openEditDialog(specialization)}
                className="p-button-warning p-button-text hover:bg-yellow-100"
                aria-label="Chỉnh sửa"
              />
              <Button
                icon="pi pi-trash"
                onClick={() => confirmDelete(specialization)}
                className="p-button-danger p-button-text hover:bg-red-100"
                aria-label="Xóa"
              />
            </div>
          )}
          className="text-center px-4 py-2"
        />
      </DataTable>

      {/* Dialog thêm chuyên khoa */}
      <Dialog
        header="Thêm chuyên khoa"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        className="p-dialog-custom"
      >
        <div className="p-field mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">Mã chuyên khoa</label>
          <InputText
            id="id"
            value={specializationForm.specializationId}
            onChange={(e) => setSpecializationForm({ ...specializationForm, specializationId: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="p-field mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên chuyên khoa</label>
          <InputText
            id="name"
            value={specializationForm.specializationName}
            onChange={(e) => setSpecializationForm({ ...specializationForm, specializationName: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <InputText
            id="notes"
            value={specializationForm.notes}
            onChange={(e) => setSpecializationForm({ ...specializationForm, notes: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <Button
          label="Thêm"
          icon="pi pi-check"
          onClick={addSpecialization}
          className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
        />
      </Dialog>

      {/* Dialog chỉnh sửa chuyên khoa */}
      <Dialog
        header="Chỉnh sửa chuyên khoa"
        visible={editDialogVisible}
        onHide={() => {setEditDialogVisible(false);resetForm();}}
        className="p-dialog-custom"
      >
        <div className="p-field mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên chuyên khoa</label>
          <InputText
            id="name"
            value={specializationForm.specializationName}
            onChange={(e) => setSpecializationForm({ ...specializationForm, specializationName: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="p-field mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <InputText
            id="notes"
            value={specializationForm.notes}
            onChange={(e) => setSpecializationForm({ ...specializationForm, notes: e.target.value })}
            className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <Button
          label="Cập nhật"
          icon="pi pi-check"
          onClick={updateSpecialization}
          className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300"
        />
      </Dialog>

      {/* Dialog xác nhận xóa chuyên khoa */}
      <Dialog
        header="Xác nhận xóa"
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        className="p-dialog-delete"
      >
        <div>
          <p>Bạn có chắc chắn muốn xóa chuyên khoa "{specializationToDelete?.specializationName}" không?</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            label="Hủy"
            icon="pi pi-times"
            onClick={() => setDeleteDialogVisible(false)}
            className="p-button-secondary"
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            onClick={deleteSpecialization}
            className="p-button-danger"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default SpecializationList;
