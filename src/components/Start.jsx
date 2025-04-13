import { Fragment, useState } from "react"
import { DIFFICULTIES, useGameStore } from "../store/store"
import { useNavigate } from "react-router"

export function Start() {
    const setGridSize = useGameStore((state) => state.setGridSize)
    const setDifficulty = useGameStore((state) => state.setDifficulty)
    const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer)
    const setPlayerNames = useGameStore((state) => state.setPlayerNames)

    const navigate = useNavigate()

    const changeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty)
        setGridSize(newDifficulty)
    }

    const [playerOneName, setPlayerOneName] = useState("Player1")
    const [playerTwoName, setPlayerTwoName] = useState("Player2")
    const [showModal, setShowModal] = useState(false)
    const [player, setPlayer] = useState(null)

    const decideRandomPlayer = () => {
        const selected = Math.random() <= 0.5 ? playerOneName : playerTwoName
        setPlayer(selected)
        setCurrentPlayer(selected)
    }

    return (
        <Fragment>
            <h1>Memory Card Game</h1>
            <p>
                To start the game, enter your names and choose one of the modes
                below.
            </p>

            <section>
                <input
                    type="text"
                    value={playerOneName}
                    onChange={(e) => setPlayerOneName(e.target.value)}
                    placeholder="Player 1"
                    disabled={showModal}
                />
                <br />
                <input
                    type="text"
                    value={playerTwoName}
                    onChange={(e) => setPlayerTwoName(e.target.value)}
                    placeholder="Player 2"
                    disabled={showModal}
                />
            </section>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>{player} starts the game.</p>
                        <button
                            onClick={() => {
                                setPlayerNames({ playerOneName, playerTwoName })
                                navigate("/game")
                            }}
                        >
                            Start the game
                        </button>
                    </div>
                </div>
            )}

            <section>
                {Object.keys(DIFFICULTIES).map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            changeDifficulty(level)
                            setShowModal(true)
                            decideRandomPlayer()
                        }}
                        disabled={
                            playerOneName === playerTwoName ||
                            !playerOneName ||
                            !playerTwoName ||
                            showModal
                        }
                    >
                        {level}
                    </button>
                ))}
            </section>
        </Fragment>
    )
}
