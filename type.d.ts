import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  rank: string;
  dataStructuresScore: number;
  algorithmsScore: number;
  problemSolvingScore: number;
  systemDesignScore: number;
  behavioralScore: number;
  unlockedDomains: string[];
  completedChallenges: string[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  rank: string;
  unlockLevel: number;
  topics: string[];
  isActive: boolean;
}

export interface Topic {
  id: string;
  domainId: string;
  name: string;
  description: string;
  order: number;
  unlockRequirement: string | null;
  theoryContent: string;
  challengeIds: string[];
  quizId?: string;
  xpReward: number;
}

export interface Challenge {
  id: string;
  topicId: string;
  title: string;
  description: string;
  type: "multiple-choice" | "drag-drop" | "code";
  difficulty: "easy" | "medium" | "hard";
  content: any;
  correctAnswer: any;
  explanation: string;
  xpReward: number;
  hints: string[];
}

export interface UserProgress {
  userId: string;
  challengeId: string;
  topicId: string;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
  completedAt: string;
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}
