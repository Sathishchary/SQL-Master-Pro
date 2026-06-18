import { User } from './user.model';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string;
  readingTimeMinutes: number;
  views: number;
  likes: number;
  published: boolean;
  featured: boolean;
  author?: User;
  publishedAt?: string;
  createdAt: string;
}
