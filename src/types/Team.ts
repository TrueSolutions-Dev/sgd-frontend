export interface Team {
  _id: number;
  name: string;
  forceId: {
    _id: number;
    name: string;
  };
  owner: string;
  representative: string;
}
