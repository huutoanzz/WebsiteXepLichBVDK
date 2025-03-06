import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '/DOAN/UngDungXepLichBenhVienDaKhoa/src/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faDatabase, faUpload } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const { user } = useContext(UserContext)!;
  const [file, setFile] = useState<File | null>(null); // state để lưu file chọn

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Trang chủ';
      case '/thongke':
        return 'Thống kê';
      case '/bacsi':
        return 'Bác sĩ';
      case '/phongkham':
        return 'Phòng khám';
      case '/catruc':
        return 'Ca trực';
      case '/dstaikhoan':
        return 'Quản lý tài khoản';
      case '/chuyenkhoa':
        return 'Chuyên khoa';
      case '/lichtruc':
        return 'Lịch trực';
      case '/quanlylichnghi':
        return 'Quản lý lịch nghỉ';
      default:
        return 'Trang chủ';
    }
  };

  const handleBackup = async () => {
    try {
      const response = await axios.post('https://localhost:7183/api/BackupAndRestore/backup', {
        outputPath: 'D:\\DOAN\\backup_database',
      });
      console.log('Backup response:', response);
      alert('Sao lưu thành công!');
    } catch (error) {
      console.error('Error backing up data', error);
      alert('Sao lưu thất bại!');
    }
  };

  // Xử lý sự kiện chọn file để phục hồi
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Xử lý phục hồi dữ liệu
  const handleRestore = async () => {
    if (!file) {
      alert('Vui lòng chọn file phục hồi.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://localhost:7183/api/BackupAndRestore/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Restore response:', response);
      alert('Phục hồi thành công!');
    } catch (error) {
      console.error('Error restoring data', error);
      alert('Phục hồi thất bại!');
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:bg-blue-700 px-4 py-2 rounded">
            Trang chủ
          </Link>
          <Link to="/thongke" className="hover:bg-blue-700 px-4 py-2 rounded">
            Thống kê
          </Link>
          <Link to="/lichtruc" className="hover:bg-blue-700 px-4 py-2 rounded">
            Lịch trực
          </Link>

          {user && (
            <Link to="/taikhoan" className="hover:bg-blue-700 px-4 py-2 rounded">
              <FontAwesomeIcon 
                icon={faUserCircle} 
                className="text-white text-3xl rounded-full border-2 border-white" 
              />
            </Link>
          )}

          {/* Icon Sao lưu */}
          <button onClick={handleBackup} className="hover:bg-blue-700 px-4 py-2 rounded">
            <FontAwesomeIcon icon={faDatabase} className="text-white text-3xl" />
          </button>

          {/* Icon Phục hồi */}
          <div className="relative">
            <button onClick={handleRestore} className="hover:bg-blue-700 px-4 py-2 rounded cursor-pointer">
              <FontAwesomeIcon icon={faUpload} className="text-white text-3xl" />
            </button>
            {/* Input File phục hồi */}
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="absolute left-0 top-0 opacity-0 cursor-pointer"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
