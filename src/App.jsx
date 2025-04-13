import { Routes, Route } from "react-router"
import { Start } from "./components/Start"
import { Game } from "./components/Game"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

export default function App() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/game" element={<Game />} />
            </Routes>
        </QueryClientProvider>
    )
}
