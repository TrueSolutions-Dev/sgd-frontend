// TeamCredentialsDocument.tsx
import { Player } from '@/types/Player';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';
import PlayerCredential from './PlayerCredential';

const styles = StyleSheet.create({
  page: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

interface PlayerData {
  player: Player;
  imageUrl: string;
  qrCodeUrl: string;
}

const TeamCredentialsDocument: React.FC<{ playersData: PlayerData[] }> = ({ playersData }) => {
  const chunkArray = (arr: PlayerData[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const playersPerPage = 8; // Número de credenciales por página
  const playerChunks = chunkArray(playersData, playersPerPage);

  return (
    <Document>
      {playerChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.content}>
            {chunk.map((playerData) => (
              <PlayerCredential
                key={playerData.player._id}
                player={playerData.player}
                imageUrl={playerData.imageUrl}
                qrCodeUrl={playerData.qrCodeUrl}
              />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TeamCredentialsDocument;
