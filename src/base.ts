export interface User {
  uid: string;
  photoURL: string | null;
  displayName: string;
  email: string;
}

export interface Post {
  id: string;
  tweet: string;
  postImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userPhotoURL: string | null | undefined;
  userDisplayName: string;
  userEmail: string;
}
