import Fire from '../../assets/fire.png';
import Ice from '../../assets/ice.png';
import Dessert from '../../assets/dessert.png';
import DefaultPlanet from '../../assets/DefaultPlanet.png';
import Cat from '../../assets/cat.png';
import Dog from '../../assets/dog.png';


const images = [Fire, Ice, Dessert, DefaultPlanet, Cat, Dog];

const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const challenges = [
  {
    planetId: 1,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Morning Run',
    content: 'Join us for a daily morning run challenge!',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 10,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 2,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'Healthy Eating',
    content: 'Challenge yourself to eat healthy every day.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 5,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 3,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'Skincare Routine',
    content: 'Follow a daily skincare routine for glowing skin.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 7,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 4,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'Daily Coding',
    content: 'Improve your coding skills with daily practice.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 3,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 5,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Meditation',
    content: 'Meditate daily for a calm and peaceful mind.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 9,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 6,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Yoga',
    content: 'Start your day with a relaxing yoga session.',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 6,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 7,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'No Sugar',
    content: 'Cut out sugar for a month and feel the difference.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 5,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 8,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'Hair Care',
    content: 'Take good care of your hair with a daily routine.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 6,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 9,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'Read a Book',
    content: 'Read a book a day and expand your knowledge.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 4,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 10,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Journaling',
    content: 'Write in your journal every day.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 7,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 11,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Cycling',
    content: 'Cycle every day and stay fit.',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 4,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 12,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'Daily Walk',
    content: 'Walk at least 10,000 steps every day.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 6,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 13,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'Daily Makeup Free',
    content: 'Go makeup-free for a month and let your skin breathe.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 3,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 14,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'Language Learning',
    content: 'Learn a new language with daily practice.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 5,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 15,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Digital Detox',
    content: 'Stay away from digital devices for a month.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 8,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 16,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Strength Training',
    content: 'Build muscle with daily strength training exercises.',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 5,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 17,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'Hydration',
    content: 'Drink at least 2 liters of water every day.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 6,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 18,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'Nail Care',
    content: 'Maintain healthy nails with a daily care routine.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 4,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 19,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'Math Practice',
    content: 'Improve your math skills with daily practice.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 5,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 20,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Volunteer',
    content: 'Volunteer every day and make a difference.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 7,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 21,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Swimming',
    content: 'Swim daily for a full-body workout.',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 4,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 22,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'Mindfulness',
    content: 'Practice mindfulness and stay present.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 6,
    maxParticipants: 9,
    isJoined: false
  },
  {
    planetId: 23,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'Natural Beauty',
    content: 'Embrace your natural beauty with minimal products.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 3,
    maxParticipants: 6,
    isJoined: false
  },
  {
    planetId: 24,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'Writing Practice',
    content: 'Improve your writing skills with daily practice.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 5,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 25,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Cooking',
    content: 'Cook a new recipe every day.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 8,
    maxParticipants: 10,
    isJoined: false
  },
  {
    planetId: 26,
    planetImg: getRandomImage(),
    category: 'EXERCISE',
    name: 'Pilates',
    content: 'Strengthen your core with daily Pilates sessions.',
    startDate: [2023, 7, 1],
    endDate: [2023, 7, 31],
    currentParticipants: 5,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 27,
    planetImg: getRandomImage(),
    category: 'LIFE',
    name: 'Gratitude',
    content: 'Write down what you are grateful for every day.',
    startDate: [2023, 8, 1],
    endDate: [2023, 8, 31],
    currentParticipants: 4,
    maxParticipants: 8,
    isJoined: false
  },
  {
    planetId: 28,
    planetImg: getRandomImage(),
    category: 'BEAUTY',
    name: 'DIY Beauty',
    content: 'Create your own beauty products at home.',
    startDate: [2023, 9, 1],
    endDate: [2023, 9, 30],
    currentParticipants: 3,
    maxParticipants: 6,
    isJoined: false
  },
  {
    planetId: 29,
    planetImg: getRandomImage(),
    category: 'STUDY',
    name: 'History Lessons',
    content: 'Learn about a new historical event every day.',
    startDate: [2023, 10, 1],
    endDate: [2023, 10, 31],
    currentParticipants: 7,
    maxParticipants: 7,
    isJoined: false
  },
  {
    planetId: 30,
    planetImg: getRandomImage(),
    category: 'ETC',
    name: 'Gardening',
    content: 'Tend to your garden every day and watch it flourish.',
    startDate: [2023, 11, 1],
    endDate: [2023, 11, 30],
    currentParticipants: 7,
    maxParticipants: 10,
    isJoined: false
  }
];

export default challenges;
