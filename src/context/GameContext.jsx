import { createContext, useReducer } from "react"

export const GameContext = createContext(null)

const initialState = {
    cards: [],
    attempts: 0,
}

const reducer = (state, action) => {}

export function GameContextProvider({ children }) {
    const [gameState, dispatchGameState] = useReducer(reducer, initialState)

    return (
        <GameContext.Provider value={{ gameState }}>
            {children}
        </GameContext.Provider>
    )
}
