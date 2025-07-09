export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bio?: string;
  location?: string;
  interests: string[];
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  isSuper: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: User;
  user2: User;
  canUser1Message: boolean;
  canUser2Message: boolean;
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  content: string;
  fromUserId: string;
  toUserId: string;
  matchId: string;
  read: boolean;
  createdAt: string;
}