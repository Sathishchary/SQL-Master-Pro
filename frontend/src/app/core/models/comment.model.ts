export type CommentTargetType = 'BLOG' | 'COURSE';

export interface Comment {
  id: number;
  content: string;
  parentId: number | null;
  userId: number;
  userName: string;
  userAvatar: string | null;
  staff: boolean;
  createdAt: string;
  replies: Comment[];
}
