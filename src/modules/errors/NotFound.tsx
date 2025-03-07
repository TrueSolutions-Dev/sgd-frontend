import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Helmet>
        <title>La Liga Ixtlahuaca - Página No Encontrada</title>
      </Helmet>

      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button
          style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
        >
          Volver a la página principal
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
