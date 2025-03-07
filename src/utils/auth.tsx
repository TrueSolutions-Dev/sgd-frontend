export const getDecodedToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        console.warn('Token has expired');
        localStorage.removeItem('token');
        return null;
      }

      return decodedToken;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  return null;
};

export const getUserRole = () => {
  const decodedToken = getDecodedToken();
  return decodedToken?.role || null;
};
