// PlayerCredential.tsx
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { Player } from '../../../types/Player';

// Estilos actualizados
const styles = StyleSheet.create({
  credentialContainer: {
    width: '48%', // Ajusta el ancho para que quepan dos por fila
    margin: '1%',
    borderRadius: 10,
    position: 'relative',
    height: 180, // Altura fija para las credenciales
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  content: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  textBlock: {
    position: 'absolute',
    fontSize: 6,
    color: '#000000',
    fontWeight: 'bold',
  },
  playerName: {
    top: 107,
    left: 130,
  },
  birthDate: {
    top: 127,
    left: 174,
  },
  teamName: {
    top: 78,
    left: 130,
  },
  forceName: {
    top: 47,
    left: 130,
  },
  playerImage: {
    position: 'absolute',
    top: 45,
    left: 18,
    width: 68,
    height: 80,
    borderRadius: 5,
  },
  playerType: {
    color: 'white',
    fontWeight: 'black',
    top: 130,
    left: 20,
  },
  qrCode: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
  },
});

interface PlayerCredentialProps {
  player: Player;
  imageUrl: string;
  qrCodeUrl: string;
}

const PlayerCredential: React.FC<PlayerCredentialProps> = ({
  player,
  imageUrl,
  qrCodeUrl,
}) => {
  const backgroundYounger = 'https://i.imgur.com/EJL9AFR.png';
  const backgroundForeigner = 'https://i.imgur.com/UY9A1Nb.png';
  const backgroundFirstForce = 'https://i.imgur.com/oah1rjO.png';
  const backgroundSecondForceA1 = 'https://i.imgur.com/Y1eNOJJ.png';
  const backgroundSecondForceA2 = 'https://i.imgur.com/VW3vnw9.png';
  const backgroundThirdForceB1 = 'https://i.imgur.com/PiGwaCi.png';
  const backgroundThirdForceB2 = 'https://i.imgur.com/QIeuUWC.png';

  // Verificar que player y sus propiedades existen
  if (!player || !player.forceId || !player.teamId) {
    return null; // O mostrar algún mensaje de error
  }

  function getBackgroundUrl() {
    if (player.isYounger) return backgroundYounger;
    if (player.isForeigner) return backgroundForeigner;

    switch (player.forceId.name) {
      case 'Primera Fuerza':
        return backgroundFirstForce;
      case 'Segunda Fuerza, Zona A-1':
        return backgroundSecondForceA1;
      case 'Segunda Fuerza, Zona A-2':
        return backgroundSecondForceA2;
      case 'Tercera Fuerza, Zona B-1':
        return backgroundThirdForceB1;
      case 'Tercera Fuerza, Zona B-2':
        return backgroundThirdForceB2;
      default:
        return 'https://i.imgur.com/ShI1lWu.jpg';
    }
  }

  function getPlayerType() {
    if (player.isForeigner) return 'FORÁNEO';
    if (player.isYounger) return 'JUVENIL';
    return 'LOCAL';
  }

  const backgroundUrl = getBackgroundUrl();
  const playerType = getPlayerType();

  return (
    <View style={styles.credentialContainer}>
      {/* Imagen de fondo de la credencial */}
      <Image src={backgroundUrl} style={styles.backgroundImage} />

      {/* Contenido superpuesto */}
      <View style={styles.content}>
        {/* Imagen del jugador */}
        {imageUrl && <Image src={imageUrl} style={styles.playerImage} />}

        {/* Información del jugador */}
        <Text style={[styles.textBlock, styles.forceName]}>
          {player.forceId.name ? player.forceId.name.toUpperCase() : ''}
        </Text>
        <Text style={[styles.textBlock, styles.teamName]}>
          {player.teamId.name ? player.teamId.name.toUpperCase() : ''}
        </Text>
        <Text style={[styles.textBlock, styles.teamName]}>
          {player.teamId.name ? player.teamId.name.toUpperCase() : ''}
        </Text>
        <Text style={[styles.textBlock, styles.playerName]}>
          {player.name ? player.name.toUpperCase() : ''}
        </Text>
        <Text style={[styles.textBlock, styles.playerType]}>{playerType}</Text>
        <Text style={[styles.textBlock, styles.birthDate]}>
          {player.birthDate
            ? new Date(player.birthDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : ''}
        </Text>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
      </View>
    </View>
  );
};

export default PlayerCredential;