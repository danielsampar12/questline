import { useState, useCallback } from 'react';
import { Quest, QuestProgress, LocationData } from '../types/Quest';
import { QUESTS, getQuestById, getNextQuest } from '../data/quests';
import { isWithinTarget, calculateDistance, getDirectionHint } from '../utils/locationUtils';

interface UseQuestReturn {
  currentQuest: Quest | null;
  progress: QuestProgress;
  checkLocation: (location: LocationData) => Promise<{
    success: boolean;
    distance: number;
    direction?: string;
    message: string;
  }>;
  completeQuest: (questId: string) => void;
  startNextQuest: () => void;
  resetProgress: () => void;
}

const INITIAL_PROGRESS: QuestProgress = {
  currentQuestId: null,
  completedQuests: [],
  totalPoints: 0,
  currentStreak: 0,
};

export const useQuest = (): UseQuestReturn => {
  const [progress, setProgress] = useState<QuestProgress>(INITIAL_PROGRESS);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);

  const completeQuest = useCallback((questId: string) => {
    setProgress(prev => {
      if (prev.completedQuests.includes(questId)) {
        return prev; // Already completed
      }

      const quest = getQuestById(questId);
      if (!quest) return prev;

      return {
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
        totalPoints: prev.totalPoints + quest.points,
        currentStreak: prev.currentStreak + 1,
        currentQuestId: null,
      };
    });

    setCurrentQuest(null);
  }, []);

  const startNextQuest = useCallback(() => {
    const nextQuest = getNextQuest(progress.completedQuests);
    if (nextQuest) {
      setCurrentQuest(nextQuest);
      setProgress(prev => ({
        ...prev,
        currentQuestId: nextQuest.id,
      }));
    }
  }, [progress.completedQuests]);

  const checkLocation = useCallback(async (
    location: LocationData
  ): Promise<{
    success: boolean;
    distance: number;
    direction?: string;
    message: string;
  }> => {
    if (!currentQuest) {
      return {
        success: false,
        distance: 0,
        message: 'No active quest. Start a quest first!',
      };
    }

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      currentQuest.targetLocation.latitude,
      currentQuest.targetLocation.longitude
    );

    const isWithinRange = isWithinTarget(location, currentQuest.targetLocation);
    const direction = getDirectionHint(
      location.latitude,
      location.longitude,
      currentQuest.targetLocation.latitude,
      currentQuest.targetLocation.longitude
    );

    if (isWithinRange) {
      completeQuest(currentQuest.id);
      return {
        success: true,
        distance,
        message: `🎉 Quest Complete! You found "${currentQuest.title}"! +${currentQuest.points} points`,
      };
    } else {
      let message = `❌ Not quite there yet! You're ${Math.round(distance)}m away.`;
      
      if (distance > 1000) {
        message += ` Head ${direction} to get closer!`;
      } else if (distance > 100) {
        message += ` You're getting close! Go ${direction}.`;
      } else {
        message += ` Almost there! Just a few more steps ${direction}.`;
      }

      return {
        success: false,
        distance,
        direction,
        message,
      };
    }
  }, [currentQuest, completeQuest]);

  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
    setCurrentQuest(null);
  }, []);

  return {
    currentQuest,
    progress,
    checkLocation,
    completeQuest,
    startNextQuest,
    resetProgress,
  };
};
