export interface Announcement {
  _id?: string;
  title: string;
  content: string;
  author: string;
  image: File;
  createdAt?: string;
  updatedAt?: string;
}
