import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import axios from 'axios';
import './Form.css';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

interface NgayNghi {
  _id: string;
  idBacSi: string;
  ngayNghi: string;
  lyDo: string;
  trangThai: boolean;
}

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

const DayOffPageAdmin = () => {
  const [dayOffs, setDayOffs] = useState<NgayNghi[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dayOffForm, setDayOffForm] = useState<NgayNghi>({
    _id: '',
    idBacSi: '',
    ngayNghi: '',
    lyDo: '',
    trangThai: false,
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [dayOffToDelete, setDayOffToDelete] = useState<NgayNghi | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchDayOffs = async () => {
      try {
        const response = await axios.get<NgayNghi[]>('https://localhost:7183/api/NgayNghiPhep');
        setDayOffs(response.data);
      } catch (error) {
        console.error('Error fetching day offs:', error);
      }
    };
    fetchDayOffs();
  }, []);

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

  const resetForm = () => {
    setDayOffForm({
        _id: '',
      idBacSi: '',
      ngayNghi: '',
      lyDo: '',
      trangThai: false,
    });
  };

  const addDayOff = async () => {
    if (!dayOffForm.idBacSi || !dayOffForm.ngayNghi || !dayOffForm.lyDo) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin!', life: 3000 });
      return;
    }
    const newDayOff = {
        idBacSi: dayOffForm.idBacSi,
        ngayNghi: dayOffForm.ngayNghi, 
        lyDo: dayOffForm.lyDo,
        trangThai : dayOffForm.trangThai
      };
    try {
      const response = await axios.post('https://localhost:7183/api/NgayNghiPhep', newDayOff);
      setDayOffs([...dayOffs, response.data]);
      setDialogVisible(false);
      resetForm();
      toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Ngày nghỉ đã được thêm!', life: 3000 });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm ngày nghỉ! Kiểm tra ngày đang chọn !', life: 3000 });
    }
  };
  
  const updateDayOff = async () => {
    if (!dayOffForm.idBacSi || !dayOffForm.ngayNghi || !dayOffForm.lyDo || dayOffForm.trangThai === undefined) {
        toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin!', life: 3000 });
        return;
    }

    try {
        const updatedDayOff = {
            idBacSi: dayOffForm.idBacSi,
            ngayNghi: dayOffForm.ngayNghi,
            lyDo: dayOffForm.lyDo,
            trangThai: dayOffForm.trangThai,
        };

        // Gọi API PUT để cập nhật
        await axios.put(`https://localhost:7183/api/NgayNghiPhep/${dayOffForm.idBacSi}/${dayOffForm.ngayNghi}`, updatedDayOff);

        if (updatedDayOff.trangThai) {
            await axios.delete(`https://localhost:7183/api/Schedule/xoaBacSiNgayTruc/${dayOffForm.ngayNghi}/${dayOffForm.idBacSi}`);
        }

        // Cập nhật lại danh sách ngày nghỉ trong state
        setDayOffs(dayOffs.map((off) => (off.idBacSi === dayOffForm.idBacSi && off.ngayNghi === dayOffForm.ngayNghi ? { ...off, ...updatedDayOff } : off)));
        setEditDialogVisible(false);
        resetForm();

        // Hiển thị thông báo thành công
        toast.current?.show({ severity: 'success', summary: 'Cập nhật', detail: 'Ngày nghỉ đã được cập nhật!', life: 3000 });
    } catch (error) {
        // Xử lý lỗi khi không thể cập nhật
        toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật ngày nghỉ!', life: 3000 });
        console.error("Error details:", error); // Hiển thị lỗi chi tiết trong console
    }
};


  const deleteDayOff = async () => {
    try {
      if (!dayOffToDelete) return;

      const response = await axios.delete(`https://localhost:7183/api/NgayNghiPhep/${dayOffToDelete.idBacSi}/${dayOffToDelete.ngayNghi}`);
      
      if (response.status === 204) { 
        const updatedDayOffs = dayOffs.filter((off) => 
          off.idBacSi !== dayOffToDelete.idBacSi ||
          off.ngayNghi !== dayOffToDelete.ngayNghi ||
          off.lyDo !== dayOffToDelete.lyDo ||
          off.trangThai !== dayOffToDelete.trangThai
        );
        setDayOffs(updatedDayOffs);

        setDeleteDialogVisible(false);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Ngày nghỉ đã được xóa!', life: 3000 });
      }
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa ngày nghỉ!', life: 3000 });
    }
  };

  

  const confirmDelete = (dayOff: NgayNghi) => {
    setDayOffToDelete(dayOff);
    setDeleteDialogVisible(true);
  };

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-6">Danh sách Ngày Nghỉ</h2>
      <Button
        label="Thêm ngày nghỉ"
        icon="pi pi-plus"
        onClick={() => setDialogVisible(true)}
        className="rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300"
      />
      <DataTable value={dayOffs} paginator rows={10} className="mt-4">
        <Column
          header="Bác Sĩ"
          body={(data) => {
            const doctor = doctors.find((d) => d.iD_bacSi === data.idBacSi);
            return doctor ? doctor.hoTen : data.idBacSi;
          }}
        />
        <Column field="ngayNghi" header="Ngày Nghỉ" />
        <Column field="lyDo" header="Lý Do" />
        <Column
          field="trangThai"
          header="Trạng Thái"
          body={(data) => (data.trangThai ? 'Duyệt' : 'Chờ')}
        />
        <Column
          header="Hành động"
          body={(dayOff: NgayNghi) => (
            <div className="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info"
                onClick={() => {
                  setDayOffForm(dayOff);
                  setEditDialogVisible(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => confirmDelete(dayOff)}
              />
            </div>
          )}
        />
      </DataTable>

      {/* Add Day Off Dialog */}
<Dialog visible={dialogVisible} header="Thêm Ngày Nghỉ" onHide={() => setDialogVisible(false)} className="p-fluid p-dialog-custom">
  <div className="space-y-4">
    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Bác Sĩ:</label>
    <Dropdown
      id="doctor"
      value={dayOffForm.idBacSi}
      options={doctors}
      onChange={(e) => setDayOffForm({ ...dayOffForm, idBacSi: e.value })}
      optionLabel="hoTen"
      optionValue="iD_bacSi"
      placeholder="Chọn Bác Sĩ"
      className="w-full"
    />
    <label htmlFor="ngayNghi" className="block text-sm font-medium text-gray-700">Ngày Nghỉ:</label>
    <Calendar
        id="ngayNghi"
        value={dayOffForm.ngayNghi ? new Date(dayOffForm.ngayNghi) : null}
        onChange={(e) => setDayOffForm({ ...dayOffForm, ngayNghi: e.value ? new Date(new Date(e.value).setDate(e.value.getDate() + 1)).toISOString().split('T')[0] : '' })}
        dateFormat="dd/mm/yy"
        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />

    <label htmlFor="lyDo" className="block text-sm font-medium text-gray-700">Lý Do:</label>
    <InputText
      id="lyDo"
      value={dayOffForm.lyDo}
      onChange={(e) => setDayOffForm({ ...dayOffForm, lyDo: e.target.value })}
      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />
    <label htmlFor="trangThai" className="block text-sm font-medium text-gray-700">Trạng Thái:</label>
    <Dropdown
      id="trangThai"
      value={dayOffForm.trangThai}
      options={[{ label: 'Duyệt', value: true }, { label: 'Chờ', value: false }]}
      onChange={(e) => setDayOffForm({ ...dayOffForm, trangThai: e.value })}
      placeholder="Chọn Trạng Thái"
      className="w-full"
    />
  </div>
  <Button
    label="Thêm"
    icon="pi pi-check"
    onClick={addDayOff}
    className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
  />
</Dialog>

    {/* Edit Day Off Dialog */}
<Dialog
  visible={editDialogVisible}
  header="Chỉnh sửa Ngày Nghỉ"
  onHide={() => {setEditDialogVisible(false);resetForm();}}
  className="p-fluid p-dialog-custom"
>
  <div className="space-y-4">
    <label htmlFor="doctor-edit" className="block text-sm font-medium text-gray-700">Bác Sĩ:</label>
    <Dropdown
      id="doctor-edit"
      value={dayOffForm.idBacSi}
      options={doctors}
      onChange={(e) => setDayOffForm({ ...dayOffForm, idBacSi: e.value })}
      optionLabel="hoTen"
      optionValue="iD_bacSi"
      placeholder="Chọn Bác Sĩ"
      className="w-full"
    />
    <label htmlFor="ngayNghi-edit" className="block text-sm font-medium text-gray-700">Ngày Nghỉ:</label>
    <Calendar
        id="ngayNghi-edit"
        value={dayOffForm.ngayNghi ? new Date(dayOffForm.ngayNghi) : null}
        onChange={(e) => setDayOffForm({ ...dayOffForm, ngayNghi: e.value ? new Date(new Date(e.value).setDate(e.value.getDate() + 1)).toISOString().split('T')[0] : '' })}
        dateFormat="dd/mm/yy"
        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />

    <label htmlFor="lyDo-edit" className="block text-sm font-medium text-gray-700">Lý Do:</label>
    <InputText
      id="lyDo-edit"
      value={dayOffForm.lyDo}
      onChange={(e) => setDayOffForm({ ...dayOffForm, lyDo: e.target.value })}
      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />
    <label htmlFor="trangThai-edit" className="block text-sm font-medium text-gray-700">Trạng Thái:</label>
    <Dropdown
      id="trangThai-edit"
      value={dayOffForm.trangThai}
      options={[{ label: 'Duyệt', value: true }, { label: 'Chờ', value: false }]}
      onChange={(e) => setDayOffForm({ ...dayOffForm, trangThai: e.value })}
      placeholder="Chọn Trạng Thái"
      className="w-full"
    />
  </div>
  <Button
    label="Cập nhật"
    icon="pi pi-check"
    onClick={updateDayOff}
    className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300"
  />
</Dialog>

      <Dialog
        header="Xác nhận xóa"
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        className="p-dialog-delete"
      >
        <div>
        <div>Bạn có chắc chắn muốn xóa ngày nghỉ này?</div>
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
            onClick={deleteDayOff}
            className="p-button-danger"
          />
        </div>
      </Dialog>


    </div>
  );
};

export default DayOffPageAdmin;