import { create } from 'zustand';

interface GameState {
  sanityPoints: number;
  chaiLevel: number;
  currentRank: string;
  medals: number;
  paperworkCompleted: number;
  setSanityPoints: (points: number) => void;
  setChaiLevel: (level: number) => void;
  setCurrentRank: (rank: string) => void;
  setMedals: (medals: number) => void;
  setPaperworkCompleted: (count: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  sanityPoints: 100,
  chaiLevel: 100,
  currentRank: 'Lieutenant',
  medals: 0,
  paperworkCompleted: 0,
  setSanityPoints: (points) => set({ sanityPoints: points }),
  setChaiLevel: (level) => set({ chaiLevel: level }),
  setCurrentRank: (rank) => set({ currentRank: rank }),
  setMedals: (medals) => set({ medals }),
  setPaperworkCompleted: (count) => set({ paperworkCompleted: count }),
  resetGame: () =>
    set({
      sanityPoints: 100,
      chaiLevel: 100,
      currentRank: 'Lieutenant',
      medals: 0,
      paperworkCompleted: 0,
    }),
}));