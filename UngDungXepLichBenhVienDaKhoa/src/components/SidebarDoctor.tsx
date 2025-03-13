// src/Sidebar.tsx
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSignOutAlt,
  faCalendarAlt,
  faUser,
  faTimes,
  faBars,
  faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarDoctor = ({ isOpen, toggleSidebar }: SidebarProps) => {
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
      <div className="mt-8">
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
              to="/taikhoan"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faUser} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Tài khoản</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dk_ngaynghi"
              className={`flex items-center p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <FontAwesomeIcon icon={faCalendarDay} className={`${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span>Đăng ký ngày nghỉ</span>}
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

export default SidebarDoctor;
