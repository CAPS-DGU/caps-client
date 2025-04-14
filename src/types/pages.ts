import { User } from "./common";

export interface WikiData {
  title: string;
  content: string;
  writer?: User;
}

export interface WikiPageProps {
  title: string;
  content: string;
  author: User;
  lastModified: string;
}

export interface StudyPageProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: User[];
}

export interface EventPageProps {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  status?: "active" | "completed" | "cancelled";
  location?: string;
  startDate?: string;
  endDate?: string;
  participants?: string[];
  maxParticipants?: number;
  category?: string;
  tags?: string[];
}

export interface BoardPageProps {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  views: number;
}

export interface VotePageProps {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  endDate: string;
  isVoted: boolean;
}

export interface MyPageProps {
  user: User;
  activities: {
    type: "study" | "event" | "board";
    id: string;
    title: string;
    date: string;
  }[];
}

export interface GalleryPost {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  imageSrc: string;
}

export interface StudyData {
  id: number;
  title: string;
  category: string;
  description: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  location: string;
  type: "ONLINE" | "OFFLINE";
  maxParticipants: number;
  participants: User[];
  files: Array<{
    fileId: number;
    name: string;
  }>;
}

export interface BoardPost {
  id: number;
  writer: {
    id: number;
    grade: number;
    name: string;
  };
  isDeleted: number;
  isModified: number;
  category: number;
  title: string;
  time: string;
  hit: number;
  content: string;
  like: number;
  comment: Array<{
    id: number;
    userId: number;
    isDeleted: number;
    targetId: number;
    content: string;
    time: string;
  }>;
  files: Array<{
    fileId: number;
    name: string;
  }>;
}

export interface VoteData {
  voteId: number;
  choiceId: number;
  clientIp: string;
  totalVotes?: number;
}
