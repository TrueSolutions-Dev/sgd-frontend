// src/components/GenerateTeamCredentialsLink.tsx

import { Player } from '@/types/Player';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import TeamCredentialsDocument from './TeamCredentialsDocument';

const GenerateTeamCredentialsLink = ({
  players,
  baseUrl,
  teamName,
}: {
  players: Player[];
  baseUrl: string;
  teamName: string;
}) => {
  const [playersData, setPlayersData] = useState<
    {
      player: Player;
      imageUrl: string;
      qrCodeUrl: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      const data = await Promise.all(
        players.map(async (player) => {
          const imageUrl = `${baseUrl}/${player.photo}?t=${Date.now()}`;
          const playerUrl = `https://laliga-ixtlahuaca.com/player/${player._id}`;
          const qrCodeUrl = await QRCode.toDataURL(playerUrl, { width: 128, margin: 2 });
          return { player, imageUrl, qrCodeUrl };
        })
      );
      setPlayersData(data);
    };

    fetchPlayerData();
  }, [players, baseUrl]);

  return playersData.length > 0 ? (
    <PDFDownloadLink
      document={
        <TeamCredentialsDocument playersData={playersData} />
      }
      fileName={`Credenciales_${teamName}.pdf`}
      style={{
        textDecoration: 'none',
        fontSize: '13px',
        color: '#1976d2',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
      }}
    >
      GENERAR CREDENCIALES DEL EQUIPO
    </PDFDownloadLink>
  ) : (
    <p>Selecciona jugadores para generar la credencial.</p>
  );
};

export default GenerateTeamCredentialsLink;
