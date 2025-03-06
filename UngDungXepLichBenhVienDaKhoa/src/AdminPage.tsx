import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DoctorList from './pages/DoctorList';
import HomePage from './pages/HomePage';
import ClinicList from './pages/ClinicList';
import SpecializationList from './pages/SpecializationList';
import './App.css'; 
import ShiftList from './pages/ShiftList';
import AccountManagement from './pages/AccountManagement ';
import AccountPage from './pages/AccountPage';
import ScheduleListAdmin from './pages/ScheduleListAdmin';
import ThongKeBacSi from './pages/ThongKeBacSi';
import DayOffPageAdmin from './pages/DayOffPageAdmin';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <Header />
          <main className="p-4">
            <Routes>
              <Route path="/thongke" element={<ThongKeBacSi />} />
              <Route path="/taikhoan" element={<AccountPage />} />
              <Route path="/bacsi" element={<DoctorList />} />
              <Route path="/phongkham" element={<ClinicList />} />
              <Route path="/quanlylichnghi" element={<DayOffPageAdmin />} />
              <Route path="/chuyenkhoa" element={<SpecializationList />} />
              <Route path="/catruc" element={<ShiftList />} />
              <Route path="/lichtruc" element={<ScheduleListAdmin />} />
              <Route path="/dstaikhoan" element={<AccountManagement />} />
              <Route path="" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default AdminPage;
