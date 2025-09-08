import { Quest } from '../types/Quest';

export const QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'The Hidden Treasure',
    riddle: 'Where the old oak tree once stood, now stands a building tall. Find the spot where history meets the future.',
    hint: 'Look for a building with a clock tower',
    targetLocation: {
      latitude: -26.9020959,
      longitude: -49.0811795,
      accuracy: 50 // 50 meter radius
    },
    completed: false,
    difficulty: 'easy',
    points: 100
  },
  {
    id: 'quest-2',
    title: 'The Secret Garden',
    riddle: 'In the heart of the city, where flowers bloom and fountains flow, seek the statue that never sleeps.',
    hint: 'Near the main square, look for a bronze figure',
    targetLocation: {
      latitude: -26.9045000,
      longitude: -49.0830000,
      accuracy: 30
    },
    completed: false,
    difficulty: 'medium',
    points: 200
  },
  {
    id: 'quest-3',
    title: 'The Lost Library',
    riddle: 'Where knowledge rests and stories unfold, find the place where silence speaks volumes.',
    hint: 'Look for a building with columns and steps',
    targetLocation: {
      latitude: -26.9000000,
      longitude: -49.0850000,
      accuracy: 25
    },
    completed: false,
    difficulty: 'hard',
    points: 300
  }
];

export const getQuestById = (id: string): Quest | undefined => {
  return QUESTS.find(quest => quest.id === id);
};

export const getNextQuest = (completedQuests: string[]): Quest | null => {
  return QUESTS.find(quest => !completedQuests.includes(quest.id)) || null;
};
