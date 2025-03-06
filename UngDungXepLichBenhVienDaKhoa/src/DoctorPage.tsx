import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScheduleList from './pages/ScheduleList';
import HeaderDoctor from './components/HeaderDoctor';
import SidebarDoctor from './components/SidebarDoctor';
import AccountPage from './pages/AccountPage';
import DayOffPage from './pages/DayOffPage';


const DoctorPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex">
        <SidebarDoctor isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <HeaderDoctor/>
          <main className="p-4">
            <Routes>
              <Route path="/taikhoan" element={<AccountPage />} />
              <Route path="/dk_ngaynghi" element={<DayOffPage />} />
              <Route path="/lichtruc" element={<ScheduleList />} />
              <Route path="" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default DoctorPage;
