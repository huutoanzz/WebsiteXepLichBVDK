import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import icon

const HeaderDoctor = () => {
  const location = useLocation();
  const { user } = useContext(UserContext)!; // Lấy thông tin người dùng từ context

  const getTitle = () => {
    if (location.pathname === '/') {
      return 'Trang chủ';
    } else if (location.pathname === '/thongke') {
      return 'Thống kê';
    } else if (location.pathname === '/lichtruc') {
      return 'Lịch trực';
    }else if (location.pathname === '/dk_ngaynghi') {
      return 'Lịch Nghỉ Phép';
    }
    return 'Trang chủ';
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Dynamic title based on current route */}
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
        
        {/* Nav links */}
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:bg-blue-700 px-4 py-2 rounded">
            Trang chủ
          </Link>
          <Link to="/lichtruc" className="hover:bg-blue-700 px-4 py-2 rounded">
            Lịch trực
          </Link>
          <Link to="/dk_ngaynghi" className="hover:bg-blue-700 px-4 py-2 rounded">
            Đăng ký ngày nghỉ
          </Link>

          {/* Hiển thị icon nếu đã đăng nhập và thêm link */}
          {user && (
            <Link to="/taikhoan" className="hover:bg-blue-700 px-4 py-2 rounded">
              <FontAwesomeIcon 
                icon={faUserCircle} 
                className="text-white text-3xl rounded-full border-2 border-white" 
              />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderDoctor;
