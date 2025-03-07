import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Helmet>
        <title>La Liga Ixtlahuaca - No Autorizado</title>
      </Helmet>

      <h1>401 - No Autorizado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
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

export default Unauthorized;
