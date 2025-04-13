import { Fragment, useRef, useEffect } from "react"
import "../MemoryGame.css"
import { useGameStore } from "../store/store"
import { useNavigate } from "react-router"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function Game() {
    const {
        difficulty,
        gridSize,
        setGridSize,
        cards,
        setCards,
        flippedCards,
        setFlippedCards,
        matchedCards,
        setMatchedCards,
        disableClicks,
        setDisableClicks,
        playerOneAttempts,
        playerTwoAttempts,
        increasePlayerOneAttempts,
        increasePlayerTwoAttempts,
        playerOneStartTime,
        setPlayerOneStartTime,
        playerTwoStartTime,
        setPlayerTwoStartTime,
        playerOneEndTime,
        setPlayerOneEndTime,
        playerTwoEndTime,
        setPlayerTwoEndTime,
        isGameOver,
        setIsGameOver,
        now,
        setNow,
        resetGame,
        currentPlayer,
        setCurrentPlayer,
        playerOneName,
        playerTwoName,
    } = useGameStore()

    const timeoutRef = useRef(null)
    const navigate = useNavigate()
    const pairs = (gridSize * gridSize) / 2

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["photos", gridSize],
        enabled: !!gridSize,
        queryFn: async () => {
            const page = Math.round(Math.random() * 29 + 1)
            const response = await axios.get(
                `${
                    import.meta.env.VITE_CARD_IMAGES_API_URL
                }?page=${page}&limit=${pairs}`
            )
            return response.data
        },
    })

    useEffect(() => {
        if (data && gridSize && !isError) {
            startNewGame()
        }
    }, [data, gridSize, isError])

    useEffect(() => {
        if (!playerOneStartTime || !playerTwoStartTime || isGameOver) return
        const interval = setInterval(() => setNow(), 1000)
        return () => clearInterval(interval)
    }, [playerOneStartTime, playerTwoStartTime, isGameOver, setNow])

    const startNewGame = () => {
        if (!data || isError) {
            console.error("Error fetching images:", error)
            return
        }

        resetGame()
        setGridSize(difficulty)

        const duplicated = data.flatMap((image) => [
            { id: `${image.id}-a`, content: image.download_url },
            { id: `${image.id}-b`, content: image.download_url },
        ])

        const shuffled = shuffleArray(duplicated)

        setCards(shuffled)
        const now = Date.now()
        setPlayerOneStartTime(now)
        setPlayerTwoStartTime(now)
        setNow()
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
            const [first, second] = newFlipped
            const isMatch = cards[first].content === cards[second].content

            if (currentPlayer === playerOneName) {
                increasePlayerOneAttempts()
            } else {
                increasePlayerTwoAttempts()
            }

            if (isMatch) {
                const newMatched = [...matchedCards, cards[first].content]
                setMatchedCards(newMatched)
                setFlippedCards([])

                if (newMatched.length === cards.length / 2) {
                    const endTime = Date.now()
                    if (currentPlayer === playerOneName) {
                        setPlayerOneEndTime(endTime)
                    } else {
                        setPlayerTwoEndTime(endTime)
                    }
                    setIsGameOver()
                }
            } else {
                setDisableClicks(true)
                timeoutRef.current = setTimeout(() => {
                    setFlippedCards([])
                    setDisableClicks(false)
                    setCurrentPlayer(
                        currentPlayer === playerOneName
                            ? playerTwoName
                            : playerOneName
                    )
                }, 1000)
            }
        }
    }

    const formatTime = (ms) => {
        const seconds = Math.floor((ms || 0) / 1000)
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
            2,
            "0"
        )}`
    }

    const goToMenu = () => {
        if (flippedCards.length > 0 || matchedCards.length > 0) {
            const confirmReset = window.confirm(
                "Are you sure? The current game progress will be lost."
            )
            if (!confirmReset) return
        }
        navigate("/")
    }

    const getWinner = () => {
        const p1Duration =
            playerOneEndTime && playerOneStartTime
                ? playerOneEndTime - playerOneStartTime
                : now - playerOneStartTime

        const p2Duration =
            playerTwoEndTime && playerTwoStartTime
                ? playerTwoEndTime - playerTwoStartTime
                : now - playerTwoStartTime

        if (playerOneAttempts < playerTwoAttempts) return playerOneName
        if (playerTwoAttempts < playerOneAttempts) return playerTwoName

        if (p1Duration < p2Duration) return playerOneName
        if (p2Duration < p1Duration) return playerTwoName

        return "Tie"
    }

    const playerOneDuration = (playerOneEndTime || now) - playerOneStartTime
    const playerTwoDuration = (playerTwoEndTime || now) - playerTwoStartTime
    const winner = getWinner()

    return (
        <Fragment>
            <button onClick={goToMenu}>{"<"}</button>
            <h3>It's the turn of {currentPlayer}</h3>

            {isLoading ? (
                <h2>Loading...</h2>
            ) : (
                <section
                    className="game-board"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 100px)`,
                    }}
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
                                <div className="card-back">
                                    <img src={card.content} alt="card" />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {isGameOver ? (
                <section>
                    <h2>🎉 Game Over!</h2>
                    <p>Winner: {winner === "Tie" ? "It's a tie!" : winner}</p>
                    <p>
                        {playerOneName} attempts: {playerOneAttempts} <br />
                        Duration: {formatTime(playerOneDuration)}
                    </p>
                    <p>
                        {playerTwoName} attempts: {playerTwoAttempts} <br />
                        Duration: {formatTime(playerTwoDuration)}
                    </p>
                    <button onClick={startNewGame}>Play again</button>
                </section>
            ) : null}
        </Fragment>
    )
}
