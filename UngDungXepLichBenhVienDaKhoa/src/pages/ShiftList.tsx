import { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Form.css';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';

interface Shift {
    _id: string;          
    shiftId: string;    
    shiftName: string;        
    startTime: string | null; 
    endTime: string | null; 
}

const ShiftList = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);

    useEffect(() => {
        const fetchShifts = async () => {
          try {
            const response = await axios.get('https://localhost:7183/api/Shift');
            setShifts(response.data);
          } catch (error) {
            console.error('Error fetching shifts:', error);
          }
        };
    
        fetchShifts();
      }, []);

    const [shiftForm, setShiftForm] = useState<Shift>({
        _id: '',
        shiftId: '',
        shiftName: '',
        startTime: '',
        endTime: ''
    });

    const resetForm = () => {
        setShiftForm({
            _id: '',
            shiftId: '',
            shiftName: '',
            startTime: '',
            endTime: ''
        });
      };

    const [dialogVisible, setDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
    const toast = useRef<Toast>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredShifts = shifts.filter((shift) =>
        shift.shiftId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.shiftName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addShift = async () => {
        if (!shiftForm.shiftId) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mã ca trực!', life: 3000 });
            }
            return;
        }
        if (!shiftForm.shiftName) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tên ca trực!', life: 3000 });
            }
            return;
        }
        if (!shiftForm.startTime) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn thời gian bắt đầu ca trực!', life: 3000 });
            }
            return;
        }
        if (!shiftForm.endTime) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn thời gian kết thúc ca trực!', life: 3000 });
            }
            return;
        }

        try {
            const response = await axios.post('https://localhost:7183/api/Shift', shiftForm);
            setShifts((prevShifts) => [...prevShifts, response.data]);
            setDialogVisible(false);
            setShiftForm({ _id: '', shiftId: '', shiftName: '', startTime: '', endTime: '' });
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Ca trực đã được thêm!', life: 3000 });
            }
        } catch (error) {
            console.error('Error adding shift:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm ca trực! Trùng mã hoặc trùng giờ làm việc!', life: 3000 });
            }
        }
    };
    const updateShift = async () => {
        if (!shiftForm.shiftName) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tên ca trực!', life: 3000 });
            }
            return;
        }
        if (!shiftForm.startTime) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn thời gian bắt đầu ca trực!', life: 3000 });
            }
            return;
        }
        if (!shiftForm.endTime) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn thời gian kết thúc ca trực!', life: 3000 });
            }
            return;
        }

        try {
            await axios.put(`https://localhost:7183/api/Shift/${shiftForm.shiftId}`, shiftForm);
            setShifts((prevShifts) =>
                prevShifts.map(shift => (shift.shiftId === shiftForm.shiftId ? shiftForm : shift))
            );
            setEditDialogVisible(false);
            setShiftForm({ _id: '', shiftId: '', shiftName: '', startTime: '', endTime: '' });
            if (toast.current) {
                toast.current.show({ severity: 'warn', summary: 'Cập nhật', detail: 'Ca trực đã được cập nhật!', life: 3000 });
            }
        } catch (error) {
            console.error('Error updating shift:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật ca trực!', life: 3000 });
            }
        }
    };
    

    const deleteShift = async () => {
        if (shiftToDelete) {
            try {
                await axios.delete(`https://localhost:7183/api/Shift/${shiftToDelete.shiftId}`);
                setShifts((prevShifts) => prevShifts.filter(shift => shift.shiftId !== shiftToDelete.shiftId));
                setDeleteDialogVisible(false);
                setShiftToDelete(null);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Ca trực đã được xóa!', life: 3000 });
                }
            } catch (error) {
                console.error('Error deleting shift:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa ca trực!', life: 3000 });
                }
            }
        }
    };
    
    const confirmDelete = (shift: Shift) => {
        setShiftToDelete(shift);
        setDeleteDialogVisible(true);
    };

    const openEditDialog = (shift: Shift) => {
        setShiftForm(shift);
        setEditDialogVisible(true);
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold">Danh sách ca trực</h2><br />
            <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm chuyên khoa (id hoặc tên)..."
                className="p-inputtext-custom rounded-md shadow-sm mb-3"
                />
            <Button
                label="Thêm ca trực"
                icon="pi pi-plus"
                onClick={() => setDialogVisible(true)}
                className="rounded-md px-4 py-2 shadow-md hover:bg-blue-500 transition-colors duration-300"
            />
            <DataTable
                value={filteredShifts}
                className="mt-4 border border-gray-300 rounded-lg shadow-sm"
                paginator
                rows={10}
                tableStyle={{ minWidth: '70rem' }}
            >
                <Column field="shiftId" header="ID" className="font-semibold px-4 py-2 text-left" />
                <Column field="shiftName" header="Tên ca trực" className="font-semibold px-4 py-2 text-left" />
                <Column field="startTime" header="Giờ bắt đầu" className="font-semibold px-4 py-2 text-left" />
                <Column field="endTime" header="Giờ kết thúc" className="font-semibold px-4 py-2 text-left" />
                <Column
                    header="Hành động"
                    body={(shift: Shift) => (
                        <div className="flex space-x-2">
                            <Button
                                icon="pi pi-pencil"
                                onClick={() => openEditDialog(shift)}
                                className="p-button-warning p-button-text hover:bg-yellow-100"
                                aria-label="Chỉnh sửa"
                            />
                            <Button
                                icon="pi pi-trash"
                                onClick={() => confirmDelete(shift)}
                                className="p-button-danger p-button-text hover:bg-red-100"
                                aria-label="Xóa"
                            />
                        </div>
                    )}
                    className="text-center px-4 py-2"
                />
            </DataTable>

            {/* Dialog thêm ca trực */}
            <Dialog
                header="Thêm ca trực"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                className="p-dialog-custom"
            >
                <div className="p-field mb-4">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">Mã ca trực</label>
                    <input
                        id="id"
                        value={shiftForm.shiftId}
                        onChange={(e) => setShiftForm({ ...shiftForm, shiftId: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="p-field mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên ca trực</label>
                    <input
                        id="name"
                        value={shiftForm.shiftName}
                        onChange={(e) => setShiftForm({ ...shiftForm, shiftName: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="p-field mb-4">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
                    <input
                        type="time"
                        value={shiftForm.startTime || '00:00'} // Đặt giá trị mặc định là 00:00
                        onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="p-field mb-4">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                    <input
                        type="time"
                        value={shiftForm.endTime || '00:00'} // Đặt giá trị mặc định là 00:00
                        onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <Button
                    label="Thêm"
                    icon="pi pi-check"
                    onClick={addShift}
                    className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                />
            </Dialog>

            {/* Dialog chỉnh sửa ca trực */}
            <Dialog
                header="Chỉnh sửa ca trực"
                visible={editDialogVisible}
                onHide={() => {setEditDialogVisible(false);resetForm();}}
                className="p-dialog-custom"
            >
                <div className="p-field mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên ca trực</label>
                    <input
                        id="name"
                        value={shiftForm.shiftName}
                        onChange={(e) => setShiftForm({ ...shiftForm, shiftName: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="p-field mb-4">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
                    <input
                        type="time"
                        value={shiftForm.startTime || ''}
                        onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="p-field mb-4">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                    <input
                        type="time"
                        value={shiftForm.endTime || ''}
                        onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                        className="p-inputtext-custom mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <Button
                    label="Cập nhật"
                    icon="pi pi-check"
                    onClick={updateShift}
                    className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300"
                />
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog
                header="Xóa ca trực"
                visible={deleteDialogVisible}
                onHide={() => setDeleteDialogVisible(false)}
                className="p-dialog-custom"
                footer={
                    <div>
                        <Button
                            label="Không"
                            icon="pi pi-times"
                            onClick={() => setDeleteDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Có"
                            icon="pi pi-check"
                            onClick={deleteShift}
                            className="p-button-danger"
                        />
                    </div>
                }
            >
                <p>Bạn có chắc chắn muốn xóa ca trực này?</p>
            </Dialog>
        </div>
    );
};

export default ShiftList;
