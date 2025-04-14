interface PostLike {
  userId: string;
}

export interface Post {
  content: string;
  id: string;
  user: {
    username: string;
  };
  likes: PostLike[];
  userId: string;
}

export interface Comment {
  content: string;
  id: string;
  user: {
    username: string;
  };
}

export interface User {
  username: string;
  bio: string;
  data_entrada: string;
  id: string;
  nickname: string;
}
