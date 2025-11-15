import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  rank: string;
  streak: number;
  lastActivityDate: string;
  dataStructuresScore: number;
  algorithmsScore: number;
  problemSolvingScore: number;
  systemDesignScore: number;
  behavioralScore: number;
  unlockedDomains: string[];
  completedChallenges: string[];
  completedQuests: string[];
}

export interface Domain extends Models.Document {
  $id: string;
  name: string;
  description: string;
  icon: string;
  rank: string;
  unlockLevel: number;
  topics: string[];
  isActive: boolean;
}

export interface Topic extends Models.Document {
  $id: string;
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

export interface Challenge extends Models.Document {
  $id: string;
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

export interface UserProgress extends Models.Document {
  userId: string;
  challengeId: string;
  topicId: string;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
  completedAt: string;
}

export interface Quest extends Models.Document {
  $id: string;
  domainId: string;
  topicId: string;
  title: string;
  narrative: string;
  objectives: string[];
  totalXP: number;
  theoryContent: string;
  challengeIds: string[];
  unlockRequirements: string[];
  order: number;
}

export interface TheorySection {
  title: string;
  content: string;
  codeExamples: Array<{
    language: string;
    code: string;
    explanation: string;
  }>;
  diagrams: string[];
  analogies: string[];
}

interface ScenarioChallengeProps {
  challenge: Challenge;
  onSubmit: (isCorrect: boolean, selectedAnswer: string) => void;
  onRequestHint: () => void;
  hints: string[];
  isLoading?: boolean;
}

interface ScenarioContent {
  scenario: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

interface PatternChallengeProps {
  challenge: PatternChallenge;
  onSubmit: (isCorrect: boolean, selectedPattern: string) => void;
  onRequestHint: () => void;
  hints: string[];
  isLoading?: boolean;
}

interface PatternContent {
  problemStatement: string;
  codeSnippets: Array<{
    language: string;
    code: string;
  }>;
  patterns: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  correctPattern: string;
  explanation: string;
  useCases: string[];
}

interface PatternChallenge extends Challenge {
  type: "pattern-recognition";
  content: PatternContent;
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
