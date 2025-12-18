export interface User {
  uid: string;
  name: string;
  email: string;
  followersCount: number;
  followingCount: number;
}

export interface Murmur {
  id: string;
  text: string;
  userId: string;
  userName: string;
  likeCount: number;
  createdAt: number;
}
