import { Quest } from '../types/Quest';

export const QUESTS: Quest[] = [
  {
    // Primeiro beijo
    id: 'quest-1',
    title: 'O Primeiro Beijo',
    riddle: 'Numa noite de rolê que nunca imaginei que mudaria tudo. Onde descobri que a sorte aparece nos lugares mais inesperados.',
    hint: 'É um lugar que eu sempre reclamava de ir, mas valeu a pena estar lá naquela noite.',
    targetLocation: {
      latitude: -26.920886,
      longitude: -49.0714982,
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
    riddle: 'Onde celebramos sua primeira vitória profissional, onde meus olhos brilharam de orgulho e eu me apaixonei ainda mais pela mulher foda que você é.',
    hint: '🍣',
    targetLocation: {
      latitude: -26.8990482,
      longitude: -49.0802902,
      accuracy: 35
    },
    completed: false,
    difficulty: 'medium',
    points: 200
  },
  {
    // Primeiro encontro
    id: 'quest-3',
    title: 'Nosso Primeiro Encontro',
    riddle: 'Esse acho que nem precisa de dica. Bora logo que ainda ta no happy hour!',
    hint: 'Quase uma segunda casa.',
    targetLocation: {
      latitude: -26.8993697,
      longitude: -49.0798083,
      accuracy: 40
    },
    completed: false,
    difficulty: 'medium',
    points: 300
  },
  {
    // Primeiro jantar romântico
    id: 'quest-4',
    title: 'O Primeiro Jantar Romântico',
    riddle: 'Onde eu quase disse "eu te amo" pela primeira vez, porque meu coração transbordava, mas me segurei. Fiquei nervoso como nunca antes de te levar nesse lugar. Lá nós conversamos sobre tudo e eu descobri que te amava ainda mais.',
    hint: 'Infelizmente não dá mais para subir no terraço depois do jantar 🥲',
    targetLocation: {
      latitude: -26.9041199,
      longitude: -49.0777477,
      accuracy: 30
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
      latitude: -26.9021614,
      longitude: -49.0785365,
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
