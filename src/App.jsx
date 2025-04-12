import { useEffect, useRef, Fragment } from "react"
import "./MemoryGame.css"
import { useGameStore } from "./store/store"
import { DIFFICULTIES } from "./store/store"

const generateCardContent = () => {
    return [
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
}

export default function App() {
    const difficulty = useGameStore((state) => state.difficulty)
    const setDifficulty = useGameStore((state) => state.setDifficulty)
    const gridSize = useGameStore((state) => state.gridSize)
    const setGridSize = useGameStore((state) => state.setGridSize)
    const cards = useGameStore((state) => state.cards)
    const setCards = useGameStore((state) => state.setCards)
    const flippedCards = useGameStore((state) => state.flippedCards)
    const setFlippedCards = useGameStore((state) => state.setFlippedCards)
    const matchedCards = useGameStore((state) => state.matchedCards)
    const setMatchedCards = useGameStore((state) => state.setMatchedCards)
    const startTime = useGameStore((state) => state.startTime)
    const setStartTime = useGameStore((state) => state.setStartTime)
    const endTime = useGameStore((state) => state.endTime)
    const setEndTime = useGameStore((state) => state.setEndTime)
    const attempts = useGameStore((state) => state.attempts)
    const increaseAttempts = useGameStore((state) => state.increaseAttempts)
    const isGameOver = useGameStore((state) => state.isGameOver)
    const setIsGameOver = useGameStore((state) => state.setIsGameOver)
    const disableClicks = useGameStore((state) => state.disableClicks)
    const setDisableClicks = useGameStore((state) => state.setDisableClicks)
    const now = useGameStore((state) => state.now)
    const setNow = useGameStore((state) => state.setNow)
    const resetGame = useGameStore((state) => state.resetGame)

    const timeoutRef = useRef(null)

    useEffect(() => {
        if (!startTime || isGameOver) return

        const interval = setInterval(() => {
            setNow()
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, endTime, isGameOver, setNow])

    useEffect(() => {
        if (gridSize) {
            startNewGame()
        }
    }, [gridSize])

    const startNewGame = () => {
        setGridSize(difficulty)
        const pairs = (gridSize * gridSize) / 2

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

        resetGame()
        setNow()
        setStartTime(Date.now())
        setCards(gameCards)
    }

    const handleCardClick = (index) => {
        if (
            flippedCards.length === 2 ||
            flippedCards.includes(index) ||
            matchedCards.includes(cards[index].content) ||
            disableClicks
        )
            return

        const newFlipped = [...flippedCards, index]
        setFlippedCards(newFlipped)

        if (newFlipped.length === 2) {
            increaseAttempts()
            const [first, second] = newFlipped
            if (cards[first].content === cards[second].content) {
                const newMatched = [...matchedCards, cards[first].content]
                setMatchedCards(newMatched)
                setFlippedCards([])

                if (newMatched.length === cards.length / 2) {
                    setEndTime(Date.now())
                    setIsGameOver()
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
        if (flippedCards.length > 0 || matchedCards.length > 0) {
            const confirmReset = window.confirm(
                "Are you sure? The current game progress will be lost."
            )
            if (!confirmReset) return
        }

        setDifficulty(newDifficulty)
        setGridSize(newDifficulty)
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
                        disabled={isGameOver}
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
                            matchedCards.includes(card.content)
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
                        {((matchedCards.length / attempts) * 100).toFixed(0)}%
                    </p>
                    <button onClick={startNewGame}>Play Again</button>
                </section>
            ) : (
                <section>
                    <p>Attempts: {attempts}</p>
                    <p>
                        Time:{" "}
                        {isGameOver
                            ? formatTime(endTime - startTime)
                            : startTime
                            ? formatTime(now - startTime)
                            : "0:00"}
                    </p>
                    {attempts > 0 && (
                        <p>
                            Accuracy:{" "}
                            {((matchedCards.length / attempts) * 100).toFixed(
                                0
                            )}
                            %
                        </p>
                    )}
                </section>
            )}
        </Fragment>
    )
}
