import { Fragment } from "react"
import { DIFFICULTIES, useGameStore } from "../store/store"
import { useNavigate } from "react-router"

export function Start() {
    const setGridSize = useGameStore((state) => state.setGridSize)
    const setDifficulty = useGameStore((state) => state.setDifficulty)
    const isGameOver = useGameStore((state) => state.isGameOver)

    const navigate = useNavigate("/game")

    const changeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty)
        setGridSize(newDifficulty)
    }

    return (
        <Fragment>
            <h1>Memory Card Game</h1>
            <p>To start the game, choose one of the modes below:</p>

            <section>
                {Object.keys(DIFFICULTIES).map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            changeDifficulty(level)
                            navigate("/game")
                        }}
                        disabled={isGameOver}
                    >
                        {level}
                    </button>
                ))}
            </section>
        </Fragment>
    )
}
