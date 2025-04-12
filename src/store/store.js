import { create } from "zustand"

export const DIFFICULTIES = {
    Easy: 4,
    Medium: 6,
    Hard: 8,
}

export const useGameStore = create((set) => ({
    difficulty: "Easy",
    gridSize: DIFFICULTIES["Easy"],
    cards: [],
    flippedCards: [],
    matchedCards: [],
    startTime: null,
    endTime: null,
    attempts: 0,
    isGameOver: false,
    disableClicks: false,
    now: Date.now(),

    setDifficulty: (newDifficulty) => set({ difficulty: newDifficulty }),
    setGridSize: (mode) => set({ gridSize: DIFFICULTIES[mode] }),
    setCards: (cards) => set({ cards }),
    setFlippedCards: (cards) => set({ flippedCards: cards }),
    setMatchedCards: (cards) => set({ matchedCards: cards }),
    setStartTime: (time) => set({ startTime: time }),
    setEndTime: (time) => set({ endTime: time }),
    increaseAttempts: () => set((state) => ({ attempts: state.attempts + 1 })),
    setIsGameOver: () => set({ isGameOver: true }),
    setDisableClicks: (bool) => set({ disableClicks: bool }),
    setNow: () => set({ now: Date.now() }),
    resetGame: () =>
        set({
            flippedCards: [],
            matchedCards: [],
            endTime: null,
            attempts: 0,
            isGameOver: false,
        }),
}))
