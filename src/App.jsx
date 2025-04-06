import React, { useContext } from "react"
import { LevelButton } from "./components/LevelButton"
import { GameContext } from "./context/GameContext"

function App() {
    const { gameState } = useContext(GameContext)

    const handleLevelButtonClick = (level) => {}

    return (
        <React.Fragment>
            <h1>Memory Card Game</h1>
            <LevelButton
                level="easy"
                onClick={(e) => {
                    e.preventDefault()
                    handleLevelButtonClick("easy")
                }}
            />
            <LevelButton
                level="medium"
                onClick={(e) => {
                    e.preventDefault()
                    handleLevelButtonClick("medium")
                }}
            />
            <LevelButton
                level="hard"
                onClick={(e) => {
                    e.preventDefault()
                    handleLevelButtonClick("hard")
                }}
            />
        </React.Fragment>
    )
}

export default App
