// src/Sidebar.tsx
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faUsersCog,
  faHome,
  faSignOutAlt,
  faCalendarAlt,
  faClinicMedical,
  faCalendarDay,
  faStethoscope,
  faTimes,
  faBars,
  faChartBar,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '/DOAN/UngDungXepLichBenhVienDaKhoa/src/contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { setUser } = useContext(UserContext)!;

  const handleLogout = () => {
    // Xóa thông tin người dùng khi đăng xuất
    setUser(null);
    // Có thể điều hướng hoặc thực hiện hành động khác sau khi đăng xuất
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-1 right-1 text-gray-400 hover:text-white focus:outline-none"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>
      <div className="mt-1">
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faHome} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Trang chủ</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/thongke"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Thống kê</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dstaikhoan"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faUsersCog} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Quản lý tài khoản</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/quanlylichnghi"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Quản lý lịch nghỉ</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/lichtruc"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Lịch trực</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/catruc"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faCalendarDay} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Ca trực</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/bacsi"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faUserMd} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Bác sĩ</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/chuyenkhoa"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faStethoscope} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Chuyên khoa</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/phongkham"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faClinicMedical} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Phòng khám</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-4 text-red-500 bg-gray-700 rounded hover:bg-gray-600 hover:text-red-400 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Đăng xuất</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
