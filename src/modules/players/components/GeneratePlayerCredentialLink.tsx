import { Player } from '@/types/Player';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import PlayerCredential from './PlayerCredential';


const GenerateCredentialLink = ({
  player,
  baseUrl,
}: {
  player: Player;
  baseUrl: string;
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const imageUrl = `${baseUrl}/${player.photo}?t=${Date.now()}`;
  const playerUrl = `https://laliga-ixtlahuaca.com/player/${player._id}`;

  useEffect(() => {
    QRCode.toDataURL(playerUrl, { width: 128, margin: 2 })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((error) => {
        console.error('Error al generar el código QR:', error);
      });
  }, [playerUrl]);

  return qrCodeUrl ? (
    <>
      <PDFDownloadLink
        document={
          <PlayerCredential
            player1={player}
            imageUrl1={imageUrl}
            player2={player}
            imageUrl2={imageUrl}
            qrCodeUrl1={qrCodeUrl}
            qrCodeUrl2={qrCodeUrl}
          />
        }
        fileName={`Credencial_${player.name}.pdf`}
        style={{
          textDecoration: 'none',
          fontSize: '13px',
          color: '#1976d2',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        GENERAR CREDENCIAL
      </PDFDownloadLink>
    </>
  ): (
    <p>Generando QR...</p>
  );;
};

export default GenerateCredentialLink;
