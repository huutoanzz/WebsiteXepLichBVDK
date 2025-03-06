import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Định nghĩa kiểu cho response từ API login
interface LoginResponse {
  _id: string;
  userId: string;
  username: string;
  password: string;
  role: string;
  doctorId: string | null;
}

const LoginPage = () => {
  const { setUser } = useContext(UserContext)!;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Thực hiện gọi API đăng nhập
      const response = await axios.post<LoginResponse>('https://localhost:7183/api/User/login', {
        username,
        password,
      });

      // Lưu thông tin người dùng vào context
      const loggedInUser = {
        _id: response.data._id,
        userId: response.data.userId,
        username: response.data.username,
        password: response.data.password,
        role: response.data.role,
        doctorId: response.data.doctorId || null,
      };
      
      setUser(loggedInUser);
      setError('');
    } catch (error: unknown) { // Explicitly typing the error
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      } else {
        setError('Đã có lỗi xảy ra, vui lòng thử lại');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">ĐĂNG NHẬP</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            placeholder="Nhập mật khẩu"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center h-full">
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-500"
            />
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
