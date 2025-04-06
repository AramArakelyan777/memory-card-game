import { useState, useEffect, useRef, Fragment } from "react"
import "./MemoryGame.css"

const DIFFICULTIES = {
    Easy: 4,
    Medium: 6,
    Hard: 8,
}

const generateCardContent = () => {
    const emojis = [
        "🐶",
        "🍕",
        "🚀",
        "🌈",
        "🎉",
        "🧠",
        "🐱",
        "🌸",
        "🔥",
        "🍩",
        "💎",
        "📚",
        "⚽",
        "🎮",
        "🪐",
        "🍓",
        "🎧",
        "🌍",
        "🦄",
        "🍔",
        "🐸",
        "🏆",
        "📸",
        "🧩",
        "🐵",
        "🍇",
        "💡",
        "🎲",
        "🌙",
        "🍀",
        "👾",
        "🐥",
        "🍉",
        "🛸",
        "🌟",
        "🥑",
        "🎵",
        "🧁",
        "🎯",
        "🚲",
        "🚁",
        "🐙",
        "🍋",
        "🐚",
        "🪴",
        "🎻",
        "🏖",
        "🧃",
        "📀",
    ]
    return emojis
}

export default function App() {
    const [difficulty, setDifficulty] = useState("Easy")
    const [gridSize, setGridSize] = useState(DIFFICULTIES[difficulty])
    const [cards, setCards] = useState([])
    const [flippedCards, setFlippedCards] = useState([])
    const [matched, setMatched] = useState([])
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [attempts, setAttempts] = useState(0)
    const [isGameOver, setIsGameOver] = useState(false)
    const [disableClicks, setDisableClicks] = useState(false)
    const [now, setNow] = useState(Date.now())

    const timeoutRef = useRef(null)

    useEffect(() => {
        if (!startTime || isGameOver) return

        const interval = setInterval(() => {
            setNow(Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, isGameOver])

    useEffect(() => {
        startNewGame()
    }, [difficulty])

    const startNewGame = () => {
        const size = DIFFICULTIES[difficulty]
        setGridSize(size)
        const pairs = (size * size) / 2

        const emojiPool = generateCardContent()
            .sort(() => 0.5 - Math.random())
            .slice(0, pairs)
        const duplicated = [...emojiPool, ...emojiPool].sort(
            () => 0.5 - Math.random()
        )

        const gameCards = duplicated.map((content, index) => ({
            id: index,
            content,
            flipped: false,
        }))

        setCards(gameCards)
        setFlippedCards([])
        setMatched([])
        setStartTime(Date.now())
        setEndTime(null)
        setAttempts(0)
        setIsGameOver(false)
    }

    const handleCardClick = (index) => {
        if (
            flippedCards.length === 2 ||
            flippedCards.includes(index) ||
            matched.includes(cards[index].content) ||
            disableClicks
        )
            return

        const newFlipped = [...flippedCards, index]
        setFlippedCards(newFlipped)

        if (newFlipped.length === 2) {
            setAttempts((prev) => prev + 1)
            const [first, second] = newFlipped
            if (cards[first].content === cards[second].content) {
                const newMatched = [...matched, cards[first].content]
                setMatched(newMatched)
                setFlippedCards([])

                if (newMatched.length === cards.length / 2) {
                    setEndTime(Date.now())
                    setIsGameOver(true)
                }
            } else {
                setDisableClicks(true)
                timeoutRef.current = setTimeout(() => {
                    setFlippedCards([])
                    setDisableClicks(false)
                }, 1000)
            }
        }
    }

    const changeDifficulty = (newDifficulty) => {
        if (flippedCards.length > 0 || matched.length > 0) {
            const confirmReset = window.confirm(
                "Are you sure? The current game progress will be lost."
            )
            if (!confirmReset) return
        }
        setDifficulty(newDifficulty)
    }

    const playAgain = () => {
        startNewGame()
    }

    const formatTime = (ms) => {
        const seconds = Math.floor((ms || 0) / 1000)
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
            2,
            "0"
        )}`
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

            <section
                className="game-board"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)` }}
            >
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`card ${
                            flippedCards.includes(index) ||
                            matched.includes(card.content)
                                ? "flipped"
                                : ""
                        }`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="card-inner">
                            <div className="card-front">❓</div>
                            <div className="card-back">{card.content}</div>
                        </div>
                    </div>
                ))}
            </section>

            {isGameOver ? (
                <section>
                    <h2>🎉 You did it!</h2>
                    <p>Total Attempts: {attempts}</p>
                    <p>Duration: {formatTime(endTime - startTime)}</p>
                    <p>
                        Accuracy:{" "}
                        {((matched.length / attempts) * 100).toFixed(0)}%
                    </p>
                    <button onClick={playAgain}>Play Again</button>
                </section>
            ) : (
                <section>
                    <p>Attempts: {attempts}</p>
                    <p>
                        Time:{" "}
                        {isGameOver
                            ? formatTime(endTime - startTime)
                            : startTime
                            ? formatTime(Date.now() - startTime)
                            : "0:00"}
                    </p>
                    {attempts > 0 && (
                        <p>
                            Accuracy:{" "}
                            {((matched.length / attempts) * 100).toFixed(0)}%
                        </p>
                    )}
                </section>
            )}
        </Fragment>
    )
}
