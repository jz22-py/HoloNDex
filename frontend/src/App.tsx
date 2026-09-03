import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CardPage from "./pages/CardPage"
import SetPage from "./pages/SetPage"
import NotFoundPage from "./pages/NotFoundPage"

function CardRoute() {
  const { cardId } = useParams()
  return <CardPage key={cardId} />
}

function SetRoute() {
  const { setId } = useParams()
  return <SetPage key={setId} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage />}/>
        <Route path="/cards/:cardId" element= { <CardRoute />}/>
        <Route path="/sets/:setId" element = { <SetRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
