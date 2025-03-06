import { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios, { AxiosError } from 'axios';
import { UserContext } from '../contexts/UserContext';
import { vi } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales: {
    'vi': vi,
  },
});



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

interface PhongTruc {
  tenCa: string;
  idPhongKham: string;
  tenPhongKham: string;
  diaChi: string;
  gioBD: string;
  gioKT: string;
}

interface LichTruc {
  id: string;
  ngay: string;
  phong: PhongTruc[];
}

interface Event {
  id: string;
  title: JSX.Element;
  start: Date;
  end: Date;
  allDay: boolean;
}

const EventTitle = ({
  phongDetails,
  view,
}: {
  phongDetails: PhongTruc[];
  view: View;
}) => (
  <div>
    {phongDetails.map((pt) => (
      <div key={pt.tenCa}>
        <strong>Ca:</strong> {pt.tenCa}
        {view !== 'month' && (
          <>
            <br />
            <strong>Giờ:</strong> {`${format(new Date(pt.gioBD), 'HH:mm')} - ${format(new Date(pt.gioKT), 'HH:mm')}`}
            <br />
            <strong>Mã phòng:</strong> {pt.idPhongKham}
            <br />
            <strong>Phòng:</strong> {pt.tenPhongKham}
            <br />
            <strong>Địa chỉ:</strong> {pt.diaChi}
          </>
        )}
      </div>
    ))}
  </div>
);

const ScheduleList = () => {
  const { user } = useContext(UserContext)!;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState<number>();
  const doctorId = user?.doctorId;

  useEffect(() => {
    if (!doctorId) {
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await axios.get<LichTruc[]>(`https://localhost:7183/api/Schedule/${doctorId}`);
        const data = response.data.map((item) => {

          return item.phong.map((pt) => {
            const start = new Date(pt.gioBD);
            start.setDate(start.getDate() + 1);
            const end = new Date(pt.gioKT);
            end.setDate(end.getDate() + 1);
            if (end < start) {
              end.setDate(end.getDate() + 1);
            }

            return {
              id: item.id,
              title: <EventTitle phongDetails={[pt]} view={view} />,
              start,
              end,
              allDay: false,
            };
          });
        });

        setEvents(data.flat());
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [doctorId, view, selectedDate]);

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

  const handleSelectSlot = async ({ start }: { start: Date }) => {
    if (!doctorId) {
      alert('Không xác định được mã bác sĩ!');
      return;
    }

    setSelectedDate(start);
  };

  const handleClick = (date: Date) => {
    setSelectedDate(date); 
    setView('day');
  };
  
  const handleExportSchedule = async (type: 'month' | 'week') => {
    try {
      let url = '';
  
      // Xây dựng URL API tùy theo loại xuất (tháng hay tuần)
      if (type === 'month') {
        // API xuất lịch theo tháng
        url = `https://localhost:7183/api/Schedule/export-monthly-doctor?idBacSi=${doctor?.iD_bacSi}&month=${year}-${month}-01`;
      } else if (type === 'week') {
        // API xuất lịch theo tuần
        if (!selectedWeek) {
          alert("Vui lòng chọn tuần.");
          return;
        }
        // API xuất lịch theo tuần, sử dụng selectedWeek và selectedDoctorId
        url = `https://localhost:7183/api/Schedule/export-weekly-doctor?idBacSi=${doctor?.iD_bacSi}&weekNumber=${selectedWeek}&month=${year}-${month}-01`;
      }
  
      // Gửi request đến API
      const response = await axios.get(url, { responseType: 'blob' });
  
      // Tạo file tải về từ response
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute(
        'download',
        // Tên file sẽ khác nhau tùy vào type (tháng hoặc tuần)
        `lich-truc-${type === 'month' ? `thang-${month}-${doctor?.hoTen}` : `tuan-${selectedWeek}-${doctor?.hoTen}`}.xlsx`
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
  
  
  

  
  const dayPropGetter = (date: Date) => {
    const style = {
      backgroundColor: date.toDateString() === new Date().toDateString() ? '#ffff99' : undefined,
    };
    return {
      style,
    };
  };
  

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Lịch Trực</h2>
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-l font-bold mb-4">Xuất lịch trực</h2>
      <div className="flex mb-4">
      {/* Lựa chọn tháng */}
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
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            <FontAwesomeIcon icon={faCalendarDay} className="text-white mr-2" />
            Xuất Lịch Tháng
          </button>

          {/* Nút xuất lịch theo tuần */}
          <button
            onClick={() => handleExportSchedule('week')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon={faCalendarWeek} className="text-white mr-2" />
            Xuất Lịch Tuần
          </button>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => handleClick(event.start)}
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        view={view}
        onView={(newView) => setView(newView)}
        date={selectedDate}
        onNavigate={(date) => setSelectedDate(date)}
        dayPropGetter={dayPropGetter}
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


    </div>
  );
  
};

export default ScheduleList;
