import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getDecodedToken, getUserRole } from '../../utils/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleTokenExpiration = () => {
        window.location.href = '/login';
    };

    const token = getDecodedToken();
    if (!token) {
      handleTokenExpiration();
    } else {
      const role = getUserRole();
      if (!role) {
        handleTokenExpiration();
      } else {
        setUserRole(role);
        setIsLoading(false);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
