import { create } from "zustand"
import { persist } from "zustand/middleware"

export const DIFFICULTIES = {
    Easy: 4,
    Medium: 6,
    Hard: 8,
}

export const useGameStore = create()(
    persist(
        (set) => ({
            difficulty: "Easy",
            gridSize: DIFFICULTIES["Easy"],
            cards: [],
            flippedCards: [],
            matchedCards: [],
            playerOneStartTime: null,
            playerOneEndTime: null,
            playerOneAttempts: 0,
            playerTwoStartTime: null,
            playerTwoEndTime: null,
            playerTwoAttempts: 0,
            isGameOver: false,
            disableClicks: false,
            now: Date.now(),
            currentPlayer: null,
            playerOneName: "Player1",
            playerTwoName: "Player2",

            setCurrentPlayer: (player) => set({ currentPlayer: player }),
            setPlayerNames: ({ playerOneName, playerTwoName }) =>
                set({ playerOneName, playerTwoName }),
            setDifficulty: (newDifficulty) =>
                set({ difficulty: newDifficulty }),
            setGridSize: (mode) => set({ gridSize: DIFFICULTIES[mode] }),
            setCards: (cards) => set({ cards }),
            setFlippedCards: (cards) => set({ flippedCards: cards }),
            setMatchedCards: (cards) => set({ matchedCards: cards }),

            setPlayerOneStartTime: (time) => set({ playerOneStartTime: time }),
            setPlayerOneEndTime: (time) => set({ playerOneEndTime: time }),
            increasePlayerOneAttempts: () =>
                set((state) => ({
                    playerOneAttempts: state.playerOneAttempts + 1,
                })),

            setPlayerTwoStartTime: (time) => set({ playerTwoStartTime: time }),
            setPlayerTwoEndTime: (time) => set({ playerTwoEndTime: time }),
            increasePlayerTwoAttempts: () =>
                set((state) => ({
                    playerTwoAttempts: state.playerTwoAttempts + 1,
                })),

            setIsGameOver: () => set({ isGameOver: true }),
            setDisableClicks: (bool) => set({ disableClicks: bool }),
            setNow: () => set({ now: Date.now() }),
            resetGame: () =>
                set((state) => ({
                    flippedCards: [],
                    matchedCards: [],
                    playerOneEndTime: null,
                    playerOneAttempts: 0,
                    playerTwoEndTime: null,
                    playerTwoAttempts: 0,
                    isGameOver: false,
                    currentPlayer: state.currentPlayer,
                })),
        }),
        {
            name: "game-storage",
        }
    )
)
