import { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { UserContext } from '/DOAN/UngDungXepLichBenhVienDaKhoa/src/contexts/UserContext';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales: {
    'vi': vi,
  },
});

interface NgayNghi {
  id: string;
  idBacSi: string;
  ngayNghi: string;
  lyDo: string;
  trangThai : boolean;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const DayOffPage = () => {
  const { user } = useContext(UserContext)!;
  const [events, setEvents] = useState<Event[]>([]);
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null); // State to store the event to delete
  const doctorId = user?.doctorId;

  // Fetch all days off for the doctor
  useEffect(() => {
    if (!doctorId) return;  // Đảm bảo rằng doctorId có giá trị
  
    const fetchDaysOff = async () => {
      try {
        const response = await axios.get<NgayNghi[]>(`https://localhost:7183/api/NgayNghiPhep/doctor/${doctorId}`);
        const data = response.data.map((item) => ({
          id: item.id,
          title: item.lyDo,
          start: new Date(item.ngayNghi),
          end: new Date(item.ngayNghi),
          allDay: true,
        }));
        setEvents(data);

      } catch (error) {
        console.error('Error fetching days off:', error);
      }
    };
  
    fetchDaysOff();
  }, [doctorId]);

  const handleSelectSlot = async ({ start }: { start: Date }) => {
    if (!doctorId) {
      alert('Không xác định được mã bác sĩ.');
      return;
    }
  
    const reason = prompt('Nhập lý do nghỉ phép:');
    if (reason) {
      const newDayOff = {
        idBacSi: doctorId,
        ngayNghi: start.toLocaleDateString('en-CA'),  
        lyDo: reason,
        trangThai : false
      };
      try {
        const response = await axios.post<NgayNghi>('https://localhost:7183/api/NgayNghiPhep', newDayOff);
        const createdEvent = {
          id: response.data.id,
          title: reason,
          start: new Date(response.data.ngayNghi),
          end: new Date(response.data.ngayNghi),
          allDay: true,
        };
        setEvents([...events, createdEvent]);
      } catch (error) {
        console.error('Error adding day off:', error);
        alert('Không thể thêm ngày nghỉ. Kiểm tra ngày đã chọn !');
      }
    }
  };

  // Show delete confirmation modal
  const handleDeleteEvent = (event: Event) => {
    setDeleteEvent(event); // Store the event in the state to delete
  };

  const confirmDelete = async () => {
    if (!doctorId || !deleteEvent) {
      alert('Không xác định được mã bác sĩ.');
      return;
    }
    const ngayNghi = format(deleteEvent.start, 'yyyy-MM-dd'); // Chuyển đổi ngày thành định dạng 'yyyy-MM-dd'
    try {
      // Gửi yêu cầu xóa tới API với doctorId và ngayNghi
      await axios.delete(`https://localhost:7183/api/NgayNghiPhep/${doctorId}/${ngayNghi}`);
      // Cập nhật lại danh sách events sau khi xóa
      setEvents(events.filter((e) => e.id !== deleteEvent.id));
      setDeleteEvent(null); // Đóng modal sau khi xóa thành công
    } catch (error) {
      console.error('Error deleting day off:', error);
      alert('Không thể xóa ngày nghỉ.');
    }
  };

  // Cancel event deletion
  const cancelDelete = () => {
    setDeleteEvent(null);
  };

  const dayPropGetter = (date:Date) => {
    const style = {
      backgroundColor: date.toDateString() === new Date().toDateString() ? '#ffff99' : undefined,
    };
    return {
      style,
    };
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Lịch Nghỉ Phép</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleDeleteEvent}
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        messages={{
          allDay: 'Cả ngày',
          previous: 'Trước',
          next: 'Sau',
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Chương trình',
          date: 'Ngày',
          time: 'Thời gian',
          event: 'Sự kiện',
          noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này.',
          showMore: total => `+${total} sự kiện khác`,
        }}
        dayPropGetter={dayPropGetter}
      />
      
      {/* Confirmation modal */}
      {deleteEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Xóa ngày nghỉ</h3>
            <p>Bạn có chắc chắn muốn xóa ngày nghỉ ?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayOffPage;
