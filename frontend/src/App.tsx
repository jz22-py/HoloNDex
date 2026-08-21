import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CardPage from "./pages/CardPage"
import SetPage from "./pages/SetPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage />}/>
        <Route path="/cards/:cardId" element= { <CardPage />}/>
        <Route path="/sets/:setId" element = { <SetPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
