export interface Match {
  _id: string;
  matchName: string;
  matchDate: string;
  forceId: string;
  stadium: string;
  matchHour: string;
  teamOne: {
    _id: string;
    name: string;
  };
  teamTwo: {
    _id: string;
    name: string;
  };
  teamOneScore: number;
  teamTwoScore: number;
}
