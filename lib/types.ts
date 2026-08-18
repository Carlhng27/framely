export interface User {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_color: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export interface PostWithMeta extends Post {
  author: User;
  like_count: number;
  liked_by_me: boolean;
  comment_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  author: User;
}
