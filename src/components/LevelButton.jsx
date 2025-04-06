export function LevelButton({ level = "EASY" }) {
    return <button>{level.toUpperCase()}</button>
}
