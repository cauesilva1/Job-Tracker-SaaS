export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface InterviewConfig {
  type: 'technical' | 'behavioral' | 'case-study' | 'general';
  level: 'junior' | 'mid' | 'senior';
  role: string;
  company: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
  score?: number;
  feedback?: string;
}

export interface AIResponse {
  message: string;
  nextQuestion?: string;
  feedback?: string;
  score?: number;
  suggestions?: string[];
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'case-study' | 'general';
  level: 'junior' | 'mid' | 'senior';
  question: string;
  expectedAnswer?: string;
  tips?: string[];
  category?: string;
} 