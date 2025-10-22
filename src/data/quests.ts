import { Quest } from '../types/Quest';

export const QUESTS: Quest[] = [
  {
    // BAckstage
    id: 'quest-1',
    title: 'O Tesouro Escondido',
    riddle: 'Onde outrora a velha árvore de carvalho se erguia, agora se levanta um prédio alto. Encontre o local onde a história encontra o futuro.',
    hint: 'Procure por um prédio com uma torre de relógio',
    targetLocation: {
      latitude: -26.899297,
      longitude: -49.0770892,
      accuracy: 50 // raio de 50 metros
    },
    completed: false,
    difficulty: 'easy',
    points: 100
  },
  {
    // aquele café
    id: 'quest-2',
    title: 'O Jardim Secreto',
    riddle: 'No coração da cidade, onde as flores desabrocham e as fontes fluem, procure pela estátua que nunca dorme.',
    hint: 'Perto da praça principal, procure por uma figura de bronze',
    targetLocation: {
      latitude: -26.9086372,
      longitude: -49.0729781,
      accuracy: 30
    },
    completed: false,
    difficulty: 'medium',
    points: 200
  },
  {
    // nonno nico
    id: 'quest-3',
    title: 'A Biblioteca Perdida',
    riddle: 'Onde o conhecimento repousa e as histórias se desdobram, encontre o lugar onde o silêncio fala volumes.',
    hint: 'Procure por um prédio com colunas e degraus',
    targetLocation: {
      latitude: -26.9069832,
      longitude: -49.0809675,
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
