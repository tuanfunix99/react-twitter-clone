export interface User {
  uid: string;
  photoURL: string | null;
  displayName: string;
}

export interface Post {
  id: string;
  tweet: string;
  postImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
}
