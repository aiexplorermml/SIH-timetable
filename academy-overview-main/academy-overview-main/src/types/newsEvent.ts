export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  status: "Published" | "Upcoming";
  type: "News" | "Event";
  location?: string;
  category: string;
  author: string;
  image?: string;
  attachments?: string[];
}