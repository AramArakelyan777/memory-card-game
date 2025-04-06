import { useState, useEffect, useRef, Fragment } from "react"
import "./MemoryGame.css"

const DIFFICULTIES = {
    Easy: 4,
    Medium: 6,
    Hard: 8,
}

export default function App() {
    const [difficulty, setDifficulty] = useState("Easy")
    const [flippedCards, setFlippedCards] = useState([])
    const [matched, setMatched] = useState([])

    const changeDifficulty = (newDifficulty) => {
        if (flippedCards.length > 0 || matched.length > 0) {
            const confirmReset = window.confirm(
                "Are you sure? The current game progress will be lost."
            )
            if (!confirmReset) return
        }
        setDifficulty(newDifficulty)
    }

    return (
        <Fragment>
            <h1>Memory Card Game</h1>

            <section className="difficulty-buttons">
                {Object.keys(DIFFICULTIES).map((level) => (
                    <button
                        key={level}
                        onClick={() => changeDifficulty(level)}
                        className={difficulty === level ? "selected" : ""}
                    >
                        {level}
                    </button>
                ))}
            </section>
        </Fragment>
    )
}
