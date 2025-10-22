import { Quest } from '../types/Quest';

export const QUESTS: Quest[] = [
  {
    // Primeiro beijo
    id: 'quest-1',
    title: 'O Primeiro Beijo',
    riddle: 'Onde nossos corações bateram em uníssono pela primeira vez, onde o tempo parou e só existimos nós dois. Encontre o lugar onde nossa história de amor verdadeiramente começou.',
    hint: 'Procure pelo local onde compartilhamos nosso primeiro momento mágico',
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
    // Primeira promoção no trabalho
    id: 'quest-2',
    title: 'A Primeira Conquista',
    riddle: 'Onde celebramos sua primeira vitória profissional, onde seus olhos brilharam de orgulho e eu me apaixonei ainda mais pela mulher guerreira que você é.',
    hint: 'Procure pelo lugar onde comemoramos sua primeira promoção',
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
    // Primeiro encontro
    id: 'quest-3',
    title: 'Nosso Primeiro Encontro',
    riddle: 'Onde tudo começou, onde nossos olhares se cruzaram pela primeira vez e eu soube que você seria especial na minha vida. Encontre o lugar onde nossa jornada teve início.',
    hint: 'Procure pelo local do nosso primeiro encontro',
    targetLocation: {
      latitude: -26.9069832,
      longitude: -49.0809675,
      accuracy: 25
    },
    completed: false,
    difficulty: 'hard',
    points: 300
  },
  {
    // Primeiro jantar romântico
    id: 'quest-4',
    title: 'O Primeiro Jantar Romântico',
    riddle: 'Onde compartilhamos nossa primeira refeição especial, onde conversamos por horas e eu descobri que você é a pessoa com quem quero passar o resto da minha vida.',
    hint: 'Procure pelo restaurante do nosso primeiro jantar romântico',
    targetLocation: {
      latitude: -26.9045000,
      longitude: -49.0830000,
      accuracy: 25
    },
    completed: false,
    difficulty: 'hard',
    points: 400
  },
  {
    // Sua casa
    id: 'quest-5',
    title: 'Nosso Lar',
    riddle: 'Onde quero construir nossa vida juntos, onde quero acordar todos os dias ao seu lado e onde quero fazer você minha esposa. Este é o lugar onde nossa história continua.',
    hint: 'Procure pela casa onde quero passar o resto da vida com você',
    targetLocation: {
      latitude: -26.9000000,
      longitude: -49.0850000,
      accuracy: 20
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
