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
  isLastQuest: boolean;
}

const INITIAL_PROGRESS: QuestProgress = {
  currentQuestId: null,
  completedQuests: [],
  totalPoints: 0,
  currentStreak: 0,
};

export const useQuest = (): UseQuestReturn => {
  const [progress, setProgress] = useState<QuestProgress>(INITIAL_PROGRESS);
  const [isLastQuest, setIsLastQuest] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);

  const completeQuest = useCallback((questId: string) => {
    setProgress(prev => {
      if (prev.completedQuests.includes(questId)) {
        return prev; // Already completed
      }

      const quest = getQuestById(questId);
      if (!quest) {
        return prev;
      }

      const newProgress = {
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
        totalPoints: prev.totalPoints + quest.points,
        currentStreak: prev.currentStreak + 1,
        currentQuestId: null,
      };
      
      return newProgress;
    });

    setCurrentQuest(null);
  }, []);

  const startNextQuest = useCallback(() => {
    setProgress(prev => {
      const nextQuest = getNextQuest(prev.completedQuests);
      
      if (nextQuest) {
        setCurrentQuest(nextQuest);
        return {
          ...prev,
          currentQuestId: nextQuest.id,
        };
      } else if (prev.completedQuests.length === 5) {
        setIsLastQuest(true);
        return prev;
      }
      
      return prev;
    });
  }, []);

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
        message: 'Nenhuma memória ativa. Vamos começar nossa história!',
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
        message: `🎈 Memória Encontrada! Você encontrou "${currentQuest.title}"! +${currentQuest.points} pontos`,
      };
    } else {
      let message = `❌ Ainda não chegamos lá! Estamos a ${Math.round(distance)}m de distância.`;
      
      if (distance > 1000) {
        message += ` Vamos para ${direction}!`;
      } else if (distance > 100) {
        message += ` Tamo quase lá! Siga para ${direction}.`;
      } else {
        message += ` Quase lá! Só falta pouco: ${direction}!`;
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
    isLastQuest,
  };
};
