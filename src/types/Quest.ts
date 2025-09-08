export interface Quest {
  id: string;
  title: string;
  riddle: string;
  hint?: string;
  targetLocation: {
    latitude: number;
    longitude: number;
    accuracy: number; // radius in meters
  };
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface QuestProgress {
  currentQuestId: string | null;
  completedQuests: string[];
  totalPoints: number;
  currentStreak: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}
