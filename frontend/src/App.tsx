import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CardPage from "./pages/CardPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage />}/>
        <Route path="/cards/:cardId" element= { <CardPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
