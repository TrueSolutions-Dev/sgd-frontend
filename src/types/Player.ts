export interface Player {
  _id: number;
  name: string;
  curpPlayer: string;
  playerNumber: string;
  birthDate: string;
  photo?: string;
  ine?: string;
  curp?: string;
  proofOfAddress?: string;
  forceId: {
    _id: number;
    name: string;
  };
  teamId: {
    _id: number;
    name: string;
  };
  isActive: boolean;
  isYounger: boolean;
  isForeigner: boolean;
  [key: string]: any;
}
