// src/App.tsx (cập nhật)
import  { useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import AdminPage from './AdminPage';
import DoctorPage from './DoctorPage';
import StaffPage from './StaffPage';
import LoginPage from './LoginPage';

const App = () => {
  const { user } = useContext(UserContext)!;

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      {user.role === 'admin' && <AdminPage />}
      {user.role === 'doctors' && <DoctorPage />}
      {user.role === 'staff' && <StaffPage />}
    </>
  );
};

export default App;
