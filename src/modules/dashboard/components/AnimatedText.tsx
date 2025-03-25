import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const AnimatedText = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' } }>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667652, #667652)', // Verde y amarillo para el fútbol
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
          letterSpacing: '2px',
        }}
      >
        «El fútbol no es solo un juego, es pasión, es vida, es lo que te hace sentir vivo.»
      </motion.h1>

      <div
        style={{
          fontSize: '1.2rem',
          fontWeight: 'normal',
          color: '#333',
          fontStyle: 'italic',
          textShadow: '2px 2px 5px rgba(0,0,0,0.2)',
          marginTop: '10px',
        }}
      >
        <Typewriter
          words={['- Lionel Messi']}
          loop={1}
          cursor
          cursorStyle="|"
          typeSpeed={100}
        />
      </div>
    </div>
  );
};

export default AnimatedText;
