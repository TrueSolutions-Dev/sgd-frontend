import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddPlayers from '../../../modules/players/screens/AddPlayers';
import GetPlayers from '../../../modules/players/screens/GetPlayers';
import GetTeams from '../../../modules/teams/screens/GetTeams';
import { getUserRole } from '../../../utils/auth';
import Announcements from '../../announcements/screens/Announcements';
import Credentials from '../../credentials/screens/Credentials';
import Matches from '../../matches/screens/Matches';
import GetPlayerById from '../../players/screens/GetPlayerById';
import SiteSettings from '../../settings/screens/SiteSettings';
import AddTeam from '../../teams/screens/AddTeam';
import DashboardAdmin from './DashboardAdmin';
import DashboardTeam from './DashboardTeam';

const SeeRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    const role = getUserRole();
    if (!role) {
      navigate('/');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  if (!userRole) return null;

  // Rutas de admin
  const adminRoutes: Record<string, JSX.Element> = {
    '/dashboard': <DashboardAdmin />,
    '/settings' : <SiteSettings/>,
    '/add-player': <AddPlayers />,
    '/get-players': <GetPlayers />,
    '/add-team': <AddTeam />,
    '/get-teams': <GetTeams />,
    '/announcements': <Announcements/>,
    '/credentials': <Credentials/>,
    '/matches': <Matches/>
  };
  
  // Rutas de team
  const teamRoutes: Record<string, JSX.Element> = {
    '/dashboard': <DashboardTeam />,
    '/add-player': <AddPlayers />,
    '/get-players': <GetPlayers />,
  };

  if (location.pathname.startsWith('/player/') && id) {
    return <GetPlayerById />;
  }

  const routes = userRole === 'admin' ? adminRoutes : teamRoutes;
  const Component = routes[location.pathname];

  return Component ? (
    Component
  ) : userRole === 'admin' ? (
    <DashboardAdmin />
  ) : (
    <DashboardTeam />
  );
};

export default SeeRole;
