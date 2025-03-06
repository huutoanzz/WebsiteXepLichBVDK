import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

type DataItem = {
  idCa: string;
  idPhongKham: string;
  idBacSi: string;
};

interface BacSi {
  _id: string;
  iD_bacSi: string;
  hoTen: string;
}

interface PhongKham {
  _id: string;
  clinicId: string;
  clinicName: string;
}

interface catruc
{
  _id: string;
  shiftId: string;
  shiftName: string;
}


type ChiTietLichTrucProps = {
  ngaytruc: Date,
  ngay: string;
  data: DataItem[];
  onClose: () => void;
};

const ChiTietLichTruc: React.FC<ChiTietLichTrucProps> = ({ ngaytruc ,ngay, data, onClose }) => {
  const [selectedCa, setSelectedCa] = useState<string | null>(null);
  const [selectedPhongKham, setSelectedPhongKham] = useState<string | null>(null);
  const [selectedBacSi, setSelectedBacSi] = useState<BacSi | null>(null);
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);
  const [searchName, setSearchName] = useState<string>('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [initialItem, setInitialItem] = useState<DataItem | null>(null); 
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const onCaChange = (e: DropdownChangeEvent) => {
    setSelectedCa(e.value === 'all' ? null : e.value);
  };

  const onPhongKhamChange = (e: DropdownChangeEvent) => {
    setSelectedPhongKham(e.value === 'all' ? null : e.value);
  };

  const onBacSiChange = (e: DropdownChangeEvent) => {
    setSelectedBacSi(e.value === 'all' ? null : e.value);
  };

  const [doctors, setDoctors] = useState<BacSi[]>([]);
  const [clinics, setClinics] = useState<PhongKham[]>([]);
  const [shifts, setShifts] = useState<catruc[]>([]);

  const fetchData = async () => {
    const doctorResponse = await fetch('https://localhost:7183/api/Doctor');
    const clinicResponse = await fetch('https://localhost:7183/api/Clinic'); 
    const shiftResponse = await fetch('https://localhost:7183/api/Shift');
  
    const doctorsData = await doctorResponse.json();
    const clinicsData = await clinicResponse.json();
    const shiftsData = await shiftResponse.json();
  
    setDoctors(doctorsData);
    setClinics(clinicsData);
    setShifts(shiftsData);
  };

  useEffect(() => {
    fetchData();
  
    const filtered = data.filter((item: DataItem) => {
      const caMatch = selectedCa ? item.idCa === selectedCa : true;
      const phongKhamMatch = selectedPhongKham ? item.idPhongKham === selectedPhongKham : true;
      const bacSiMatch = selectedBacSi ? item.idBacSi === String(selectedBacSi) : true;
      
      const doctorName = doctorMap[item.idBacSi]?.toLowerCase() || '';
      const searchMatch = searchName ? doctorName.includes(searchName.toLowerCase()) : true;
      return caMatch && phongKhamMatch && bacSiMatch && searchMatch;
    });
    setFilteredData(filtered);
  }, [selectedCa, selectedPhongKham, selectedBacSi, searchName, data]);
  
  

  const caOptions = [
    { label: 'Tất cả', value: 'all' },
    ...shifts.map(shift => ({
      label: shift.shiftName, 
      value: shift.shiftId
    })),
  ];
  
  const phongKhamOptions = [
    { label: 'Tất cả', value: 'all' },
    ...clinics.map(clinic => ({
      label: clinic.clinicName, 
      value: clinic.clinicId
    })),
  ];
  const bacSiOptions = [
    { label: 'Tất cả', value: 'all' },
    ...doctors.map(doctor => ({
      label: doctor.hoTen, 
      value: doctor.iD_bacSi
    })),
  ];

  
  const onCreate = async () => {
    if (!selectedItem || !selectedItem.idCa || !selectedItem.idPhongKham || !selectedItem.idBacSi) {
      alert("Vui lòng điền đầy đủ thông tin trước khi thêm lịch trực.");
      return;
    }
    const ngayTrucAdd = ngaytruc.toString();
    if (selectedItem) {
      try {
        const response = await fetch(`https://localhost:7183/api/Schedule/themPhongTruc/${ngayTrucAdd}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedItem),
        });
  
        if (response.ok) {
          const newPhongTruc = selectedItem;
          
          // Thêm mục mới vào danh sách hiện tại
          setFilteredData((prevFilteredData) => {
            const updatedList = [...prevFilteredData, newPhongTruc];
            console.log("Cập nhật danh sách mới:", updatedList);  
            return updatedList;
          });
  
          // Reset trạng thái form
          setIsDialogVisible(false);
          setSelectedItem(null);
  
          // Thông báo thành công
          alert("Thêm mới thành công!");
        } else {
          alert("Thêm mới thất bại!");
          alert(`Thông tin đã gửi: \nSelectedItem: ${JSON.stringify(selectedItem, null, 2)}\nNgayTruc: ${ngayTrucAdd}`);
        }
      } catch (error) {
        console.error('Error updating phong truc:', error);
        alert("Có lỗi xảy ra khi thêm phòng trực.");
      }
    }
  };


  const onEdit = (item: DataItem) => {
    setInitialItem(item);
    setSelectedItem(item);
    setIsDialogVisible(true);
    setIsEditing(true);
  };

  const onDelete = async (item: DataItem) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mục này?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://localhost:7183/api/Schedule/xoaBacSiPhongTruc/${ngaytruc}/${item.idBacSi}/${item.idCa}/${item.idPhongKham}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFilteredData((prevFilteredData) => 
            prevFilteredData.filter(
              (dataItem) => 
                dataItem.idBacSi !== item.idBacSi ||
                dataItem.idCa !== item.idCa ||
                dataItem.idPhongKham !== item.idPhongKham
            )
          );
          alert("Xóa thành công!");
        } else {
          alert("Xóa không thành công!");
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert("Có lỗi xảy ra khi xóa mục.");
      }
    }
  };

  const handleSave = async () => {
    const ngayTrucEdit = ngaytruc.toString();
    if (selectedItem && initialItem) {
      // Ngày trực và các thông tin cũ (ban đầu)
      const ngayTruc = ngay.toString(); 
      const { idCa, idPhongKham, idBacSi } = initialItem; // Thông số cũ
  
      // Các thông tin mới (sẽ thay thế)
      const updatedPhongTruc = {
        IDCa: selectedItem.idCa,
        IDPhongKham: selectedItem.idPhongKham,
        IDBacSi: selectedItem.idBacSi,
      };
  
      try {
        const response = await fetch(`https://localhost:7183/api/Schedule/suaPhongTruc/${ngayTrucEdit}/${idBacSi}/${idCa}/${idPhongKham}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPhongTruc),
        });
  
        if (response.ok) {
          // Cập nhật danh sách sau khi chỉnh sửa thành công
          setFilteredData(filteredData.map((dataItem) => (
            dataItem.idBacSi === initialItem.idBacSi &&
            dataItem.idCa === initialItem.idCa &&
            dataItem.idPhongKham === initialItem.idPhongKham
              ? selectedItem 
              : dataItem
          )));
          setIsDialogVisible(false);
          setSelectedItem(null);
          alert("Cập nhật thành công!");
        } else {
          const errorText = await response.text();
          alert(`Cập nhật thất bại: ${errorText}\n\nThông tin đã gửi: \nUpdatedPhongTruc: ${JSON.stringify(updatedPhongTruc, null, 2)}\nNgayTruc: ${ngayTruc}\nIDCa cũ: ${idCa}\nIDPhongKham cũ: ${idPhongKham}\nIDBacSi cũ: ${idBacSi}`);
        }
      } catch (error) {
        console.error('Error updating phong truc:', error);
        alert("Có lỗi xảy ra khi cập nhật phòng trực.");
      }
    }
  };
  


  const doctorMap = Object.fromEntries(doctors.map(doctor => [doctor.iD_bacSi, doctor.hoTen]));
  const clinicMap = Object.fromEntries(clinics.map(clinic => [clinic.clinicId, clinic.clinicName]));
  const shiftMap = Object.fromEntries(shifts.map(shift => [shift.shiftId, shift.shiftName]));
  const openDialog = () => {
    setSelectedItem({ idCa: '', idPhongKham: '', idBacSi: ''});
    setIsEditing(false);
    setIsDialogVisible(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-7xl relative h-auto max-h-[80vh] overflow-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✖
        </button>

        <h3 className="text-lg font-bold mb-4 text-center">
          Chi Tiết Lịch Trực Ngày {ngay.toString()}
        </h3>

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={openDialog}
          >
            Thêm lịch trực
          </button>
        </div>
        <div className="flex flex-col w-1/2 ml-2">
          <span className="font-semibold mb-2">Tìm kiếm theo tên:</span>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nhập tên bác sĩ"
            className="w-full p-2 border rounded"
          />
        </div>


        <div className="mb-4 flex justify-between">
          <div className="flex flex-col w-1/2 mr-2">
            <span className="font-semibold mb-2">Lọc theo Ca Trực:</span>
            <Dropdown
              value={selectedCa}
              options={caOptions}
              onChange={onCaChange}
              placeholder="Chọn Ca Trực"
              className="w-full"
            />
          </div>

          <div className="flex flex-col w-1/2 ml-2">
            <span className="font-semibold mb-2">Lọc theo Phòng Khám:</span>
            <Dropdown
              value={selectedPhongKham}
              options={phongKhamOptions}
              onChange={onPhongKhamChange}
              placeholder="Chọn Phòng Khám"
              className="w-full"
            />
          </div>

          <div className="flex flex-col w-1/2 ml-2">
            <span className="font-semibold mb-2">Lọc theo Bác sĩ:</span>
            <Dropdown
              value={selectedBacSi}
              options={bacSiOptions}
              onChange={onBacSiChange}
              placeholder="Chọn Bác Sĩ"
              className="w-full"
            />
          </div>
        </div>

        <DataTable value={filteredData} paginator rows={10} className="w-full mb-4">
          <Column field="idCa" header="Ca Trực" body={(rowData) => shiftMap[rowData.idCa] || rowData.idCa} />
          <Column field="idPhongKham" header="Phòng Khám" body={(rowData) => clinicMap[rowData.idPhongKham] || rowData.idPhongKham} />
          <Column field="idBacSi" header="Bác Sĩ" body={(rowData) => doctorMap[rowData.idBacSi] || rowData.idBacSi} />
          <Column
            header="Actions"
            body={(rowData: DataItem) => (
              <div className="flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => onEdit(rowData)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => onDelete(rowData)}
                >
                  Xóa
                </button>
              </div>
            )}
          />
        </DataTable>

        <Dialog
          header={isEditing ? 'Chỉnh sửa lịch trực' : 'Thêm lịch trực'}
          visible={isDialogVisible}
          style={{ width: '50vw' }}
          onHide={() => setIsDialogVisible(false)}
        >
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="idCa">Ca Trực</label>
              <Dropdown
                id="idCa"
                value={selectedItem?.idCa}
                options={caOptions}
                onChange={(e) =>
                  setSelectedItem((prev) => (prev ? { ...prev, idCa: e.value } : null))
                }
                placeholder="Chọn Ca Trực"
              />
            </div>

            <div className="field">
              <label htmlFor="idPhongKham">Phòng Khám</label>
              <Dropdown
                id="idPhongKham"
                value={selectedItem?.idPhongKham}
                options={phongKhamOptions}
                onChange={(e) =>
                  setSelectedItem((prev) => (prev ? { ...prev, idPhongKham: e.value } : null))
                }
                placeholder="Chọn Phòng Khám"
              />
            </div>

            <div className="field">
              <label htmlFor="idBacSi">Bác Sĩ</label>
              <Dropdown
                id="idBacSi"
                value={selectedItem?.idBacSi}
                options={bacSiOptions}
                onChange={(e) =>
                  setSelectedItem((prev) => (prev ? { ...prev, idBacSi: e.value } : null))
                }
                placeholder="Chọn Bác Sĩ"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setIsDialogVisible(false)}
            >
              Hủy
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={isEditing ? handleSave : onCreate}
            >
              {isEditing ? 'Lưu' : 'Thêm'}
            </button>
          </div>
        </Dialog>


        

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietLichTruc;
