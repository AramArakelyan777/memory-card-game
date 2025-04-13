import { Routes, Route } from "react-router"
import { Start } from "./components/Start"
import { Game } from "./components/Game"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/game" element={<Game />} />
        </Routes>
    )
}
