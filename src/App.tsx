import { Route, Routes } from 'react-router-dom';
import './App.css';
import SeeRole from './modules/dashboard/screens/SeeRole';
import NotFound from './modules/errors/NotFound';
import Unauthorized from './modules/errors/Unauthorized';
import Login from './modules/login/screens/Login';
import GetPlayerById from './modules/players/screens/GetPlayerById';
import ProtectedRoute from './modules/protectedroute/ProtectedRoute';
import { useSiteSettings } from './modules/settings/components/SiteSettingsProvider';
import MaintenanceScreen from './modules/settings/screens/MaintenanceScreen';
import { getUserRole } from './utils/auth';
import Home from './modules/home/screen/home';

function App() {

    const { maintenanceMode } = useSiteSettings();
    const userRole = getUserRole();

  if (maintenanceMode && userRole !== 'admin') {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<GetPlayerById />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'team']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/add-player"
          element={
            <ProtectedRoute allowedRoles={['admin', 'team']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/get-players"
          element={
            <ProtectedRoute allowedRoles={['admin', 'team']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-team"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/get-teams"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credentials"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SeeRole />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;


