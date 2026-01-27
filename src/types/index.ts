export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  category: string;
  image: string | null;
  capacity: number | null;
  price: number;
}