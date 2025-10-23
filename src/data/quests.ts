import { Quest } from '../types/Quest';

export const QUESTS: Quest[] = [
  {
    // Primeiro beijo
    id: 'quest-1',
    title: 'O Primeiro Beijo',
    riddle: 'Numa noite de rolê que nunca imaginei que mudaria tudo, mas foi onde descobri que a sorte aparece nos lugares mais inesperados.',
    hint: 'Falo muito mal do lugar. Mas aquela noite value a pena',
    targetLocation: {
      latitude: -26.9208813,
      longitude: -49.0694651,
      accuracy: 350 // raio de 50 metros
    },
    completed: false,
    difficulty: 'easy',
    points: 100
  },
  {
    // Primeira promoção no trabalho
    id: 'quest-2',
    title: 'Meu Orgulho',
    riddle: 'Onde celebramos sua primeira vitória profissional, onde meus olhos brilharam de orgulho e eu me apaixonei ainda mais pela mulher foda que você é.',
    hint: '🍣',
    targetLocation: {
      latitude: -26.9221066,
      longitude: -49.0663125,
      accuracy: 350
    },
    completed: false,
    difficulty: 'medium',
    points: 200
  },
  {
    // Primeiro encontro
    id: 'quest-3',
    title: 'Nosso Primeiro Encontro',
    riddle: 'Esse acho que nem precisa de dica. Agiliza que ainda tem chopp em dobro!',
    hint: '🍻',
    targetLocation: {
      latitude: -26.8993903,
      longitude: -49.0797488,
      accuracy: 350
    },
    completed: false,
    difficulty: 'medium',
    points: 300
  },
  {
    // Primeiro jantar romântico
    id: 'quest-4',
    title: 'Nosso Primeiro Jantar',
    riddle: 'Depois dessa da noite que te levei lá o "eu te amo" ficou preso na garganta.',
    hint: 'Infelizmente não dá mais para subir no terraço depois do jantar 🥲',
    targetLocation: {
      latitude: -26.9069832,
      longitude: -49.0809729,
      accuracy: 350
    },
    completed: false,
    difficulty: 'medium',
    points: 400
  },
  {
    // Primeiro apartamento
    id: 'quest-5',
    title: 'Nosso Lar',
    riddle: 'Onde começamos a construir nossa vida juntos, onde criamos nossas primeiras memórias morando juntos e que sempre terá um lugar especial no coração. Mesmo que nos mudemos, este será sempre nosso primeiro lar.',
    hint: 'O primeiro apartamento que nos mudamos juntos.',
    targetLocation: {
      latitude: -26.9021007, 
      longitude: -49.0786046 ,
      accuracy: 230
    },
    completed: false,
    difficulty: 'hard',
    points: 500
  }
];

export const getQuestById = (id: string): Quest | undefined => {
  return QUESTS.find(quest => quest.id === id);
};

export const getNextQuest = (completedQuests: string[]): Quest | null => {
  return QUESTS.find(quest => !completedQuests.includes(quest.id)) || null;
};
