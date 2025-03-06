import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Dialog } from 'primereact/dialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios, { AxiosError } from 'axios';
import { vi } from 'date-fns/locale';
import ChiTietLichTruc from './ChiTietLichTruc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarPlus, faCalendarWeek, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

type LichTruc = {
  id: {
    timestamp: number;
    creationTime: string;
  };
  ngay: Date; 
  phong: {
    idCa: string;
    idPhongKham: string;
    idBacSi: string;
  }[];
};

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  details: string;
  ngaytruc: Date;
  data: LichTruc['phong']; 
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales: { vi },
});

const ScheduleListAdmin = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); 
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [month2, setMonth2] = useState<number>(new Date().getMonth() + 1);
  const [year2, setYear2] = useState<number>(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState<number>();


  // Fetch all schedules
  const fetchSchedules = async () => {
    try {
      const response = await axios.get<LichTruc[]>(`https://localhost:7183/api/Schedule/schedules`);
      const data = response.data.map((item) => {
        const details = item.phong
          .map(
            (pt) =>
              `Ca: ${pt.idCa}, Phòng: ${pt.idPhongKham}, Bác sĩ: ${pt.idBacSi}`
          )
          .join('\n');
        return {
          id: item.id.timestamp.toString(),
          title: format(new Date(item.ngay), 'dd/MM/yyyy'),
          start: new Date(item.ngay),
          end: new Date(new Date(item.ngay).getTime() + 2 * 60 * 60 * 1000),
          allDay: false,
          details,
          data: item.phong,
          ngaytruc: item.ngay
        };
      });
      setEvents(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };
  
  useEffect(() => {
    fetchSchedules(); // Call it once when the component mounts
  }, []);

  // Handle event click and show modal
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event); // Set selected event details
    setModalVisible(true); // Show modal
  };

  const dayPropGetter = (date: Date) => {
    const style = {
      backgroundColor: date.toDateString() === new Date().toDateString() ? '#ffff99' : undefined,
    };
    return {
      style,
    };
  };

  const handleAutoSchedule = async () => {
    try {
      // Gọi API với định dạng URL hợp lệ
      const response = await axios.post(`https://localhost:7183/api/Schedule/xep-lich/${year}-${month}`);
      
      // Kiểm tra nếu API trả về lỗi (400 - Bad Request)
      if (response.status === 400) {
        alert(response.data); // Hiển thị thông báo lỗi từ API (ví dụ: "Đã có lịch trực cho tháng này, không cần xếp lại.")
        return;
      }
  
      // Cập nhật events sau khi xếp lịch thành công
      setEvents(response.data);
  
      // Refresh events (ensure the latest events are fetched from the server)
      await fetchSchedules();
  
      alert('Xếp lịch thành công!');
    } catch (err) {
      // Ép kiểu 'err' thành 'any' để có thể truy cập thuộc tính 'response'
      const error = err as AxiosError;
  
      // Kiểm tra chi tiết lỗi trả về và hiển thị thông báo tương ứng
      if (error.response && error.response.status === 400) {
        alert(`Xếp lịch thất bại: ${error.response.data}`);
      } else if (error.response && error.response.status === 409) { // 409 - Conflict
        alert("Lịch trực đã tồn tại, không thể xếp thêm.");
      } else if (error.response && error.response.status === 403) { // 403 - Forbidden
        alert("Không thể xếp lịch cho tháng trong quá khứ.");
      } else {
        console.error('Error auto-scheduling:', error);
        alert("Có lỗi xảy ra khi xếp lịch.");
      }
    }
  };
  

const handleDeleteSchedules = async () => {
  if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch của tháng này?")) {
    try {
      const response = await axios.delete(
        `https://localhost:7183/api/Schedule/xoa-lich-thang/${year}-${month}`
      );

      if (response.status === 200) {
        const firstDayOfMonth = new Date(year, month - 1, 1);

        const filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.start);
          return (
            eventDate.getFullYear() !== firstDayOfMonth.getFullYear() ||
            eventDate.getMonth() !== firstDayOfMonth.getMonth()
          );
        });

        setEvents(filteredEvents);
        alert("Đã xóa toàn bộ lịch của tháng này.");
      } else {
        alert(response.data);
      }
    } catch (err) {
      const error = err as AxiosError;

      if (error.response && error.response.status === 400) {
        alert(`Xóa lịch thất bại: ${error.response.data}`);
      } else if (error.response && error.response.status === 403) {
        alert("Không thể xóa lịch của tháng trong quá khứ.");
      } else if (error.response && error.response.status === 404) {
        alert("Không có lịch trực để xóa cho tháng này.");
      } else {
        console.error("Error deleting schedules:", error);
        alert("Có lỗi xảy ra khi xóa lịch.");
      }
    }
  }
};

  
const handleExportSchedule = async (type: 'month' | 'week') => {
  try {
    let url = '';

    // Xây dựng URL API tùy theo loại xuất (tháng hay tuần)
    if (type === 'month') {
      // API xuất lịch theo tháng
      url = `https://localhost:7183/api/Schedule/export-monthly?month=${year2}-${month2}-01`;
    } else if (type === 'week') {
      // API xuất lịch theo tuần, sử dụng selectedWeek
      if (!selectedWeek) {
        alert("Vui lòng chọn tuần.");
        return;
      }
      // API xuất lịch theo tuần
      url = `https://localhost:7183/api/Schedule/export-weekly?weekNumber=${selectedWeek}&month=${year2}-${month2}-01`;
    }

    // Gửi request đến API
    const response = await axios.get(url, { responseType: 'blob' });

    // Tạo file tải về từ response
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute(
      'download',
      // Tên file sẽ khác nhau tùy vào type (tháng hoặc tuần) và bao gồm năm
      `lich-truc-${type === 'month' ? `thang-${month2}/${year}` : `tuan-${selectedWeek}-thang-${month2}/${year}`}.xlsx`
    );
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Thông báo thành công
    alert(`Xuất lịch theo ${type === 'month' ? 'tháng' : 'tuần'} thành công!`);
  } catch (err) {
    const error = err as AxiosError;
    console.error('Error exporting schedule:', error);

    if (error.response && error.response.status === 400) {
      alert(`Xuất lịch thất bại: ${error.response.data}`);
    } else {
      alert('Có lỗi xảy ra khi xuất lịch.');
    }
  }
};

  

return (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold mb-4">Quản Lý Lịch Trực</h2>

    <h2 className="text-l font-bold mb-4">Xếp lịch tự động</h2>
    <div className="flex mb-4">
      <input
        type="number"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        placeholder="Tháng"
        className="border p-2 rounded mr-2"
        min="1"
        max="12"
      />
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        placeholder="Năm"
        className="border p-2 rounded mr-2"
        min="2020"
      />
      <button
        onClick={handleAutoSchedule}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 mr-2"
      >
        <FontAwesomeIcon icon={faCalendarPlus} className="text-white" />
        <span>Xếp lịch tự động</span>
      </button>
      <button
        onClick={handleDeleteSchedules}
        className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        <FontAwesomeIcon icon={faTrashAlt} className="text-white" />
        <span>Xóa lịch tháng</span>
      </button>
    </div>
    <h2 className="text-l font-bold mb-4">Xuất lịch trực</h2>
    <div className="flex mb-4">
      {/* Lựa chọn tháng */}
      <input
        type="number"
        value={month2}
        onChange={(e) => setMonth2(Number(e.target.value))}
        placeholder="Tháng"
        className="border p-2 rounded mr-2"
        min="1"
        max="12"
      />
      <input
        type="number"
        value={year2}
        onChange={(e) => setYear2(Number(e.target.value))}
        placeholder="Năm"
        className="border p-2 rounded mr-2"
        max="2023"
        min="2025"
      />
      {/* Lựa chọn tuần */}
      <input
        type="number"
        placeholder="Tuần"
        className="border p-2 rounded mr-2"
        onChange={(e) => setSelectedWeek(Number(e.target.value))}
        min="1"
        max="6"
      />
      {/* Nút xuất lịch theo tháng */}
      <button
        onClick={() => handleExportSchedule('month')}
        className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2 mr-2"
      >
        <FontAwesomeIcon icon={faCalendarDay} className="text-white" />
        <span>Xuất Lịch Tháng</span>
      </button>
      {/* Nút xuất lịch theo tuần */}
      <button
        onClick={() => handleExportSchedule('week')}
        className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        <FontAwesomeIcon icon={faCalendarWeek} className="text-white" />
        <span>Xuất Lịch Tuần</span>
      </button>
    </div>

    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      style={{ height: 600 }}
      views={['month', 'week', 'day']}
      onView={setView}
      date={selectedDate}
      onNavigate={setSelectedDate}
      dayPropGetter={dayPropGetter}
      onSelectEvent={handleSelectEvent}
      popup
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
        showMore: (total) => `+${total} sự kiện khác`,
      }}
    />

    <Dialog
      header={`Chi Tiết Lịch Trực Ngày ${selectedEvent?.title}`}
      visible={modalVisible}
      style={{ width: '80vw' }}
      onHide={() => setModalVisible(false)}
    >
      {selectedEvent ? (
        <ChiTietLichTruc
          ngay={selectedEvent.title}
          data={selectedEvent.data}
          ngaytruc={selectedEvent.ngaytruc}
          onClose={() => setModalVisible(false)}
        />
      ) : (
        <p>Không có thông tin chi tiết.</p>
      )}
    </Dialog>
  </div>
);
};

export default ScheduleListAdmin;
