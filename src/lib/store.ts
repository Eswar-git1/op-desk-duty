import { create } from 'zustand';

interface GameState {
  isGuest: boolean;
  sanityPoints: number;
  chaiLevel: number;
  currentRank: string;
  medals: number;
  paperworkCompleted: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentLevel: number;
  answeredQuestions: string[];
  finalScore: number;
  setIsGuest: (isGuest: boolean) => void;
  setSanityPoints: (points: number) => void;
  setChaiLevel: (level: number) => void;
  setCurrentRank: (rank: string) => void;
  setMedals: (medals: number) => void;
  setPaperworkCompleted: (count: number) => void;
  setCorrectAnswers: (count: number) => void;
  setWrongAnswers: (count: number) => void;
  setCurrentLevel: (level: number) => void;
  addAnsweredQuestion: (questionId: string) => void;
  setFinalScore: (score: number) => void;
  resetGame: () => void;
  resetLevelProgress: () => void;
}

const RANKS = [
  'Lieutenant',
  'Captain',
  'Major',
  'Lieutenant Colonel',
  'Colonel',
  'Brigadier',
  'Major General',
  'Lieutenant General',
  'General',
];

export const useGameStore = create<GameState>((set) => ({
  isGuest: false,
  sanityPoints: 100,
  chaiLevel: 100,
  currentRank: RANKS[0],
  medals: 0,
  paperworkCompleted: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentLevel: 1,
  answeredQuestions: [],
  finalScore: 0,
  setIsGuest: (isGuest) => set({ isGuest }),
  setSanityPoints: (points) => set({ sanityPoints: points }),
  setChaiLevel: (level) => set({ chaiLevel: level }),
  setCurrentRank: (rank) => set({ currentRank: rank }),
  setMedals: (medals) => set({ medals }),
  setPaperworkCompleted: (count) => set({ paperworkCompleted: count }),
  setCorrectAnswers: (count) => set({ correctAnswers: count }),
  setWrongAnswers: (count) => set({ wrongAnswers: count }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  addAnsweredQuestion: (questionId) =>
    set((state) => ({
      answeredQuestions: [...state.answeredQuestions, questionId],
    })),
  setFinalScore: (score) => set({ finalScore: score }),
  resetGame: () =>
    set({
      isGuest: false,
      sanityPoints: 100,
      chaiLevel: 100,
      currentRank: RANKS[0],
      medals: 0,
      paperworkCompleted: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentLevel: 1,
      answeredQuestions: [],
      finalScore: 0,
    }),
  resetLevelProgress: () =>
    set((state) => ({
      sanityPoints: 100, // Reset sanity at new level
      correctAnswers: 0,
      wrongAnswers: 0,
      answeredQuestions: [], // Clear answered questions for new level
    })),
}));