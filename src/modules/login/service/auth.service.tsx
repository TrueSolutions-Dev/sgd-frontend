const API_URL = import.meta.env.REACT_APP_API_URL;


export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error durante la autenticación', error);
    throw new Error('Ocurrió un problema al iniciar sesión. Por favor, intenta nuevamente.');
  }
};