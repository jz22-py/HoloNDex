import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getCardById } from "../api/client"
import type { Card as CardType } from "../types/card"
import { CardDetail } from "../components/CardDetail"
import { PriceChart } from "../components/PriceChart"
import NotFoundPage from "./NotFoundPage"

function CardPage() {
    const params = useParams()
    const cardId = params.cardId ?? ""
    const [card, setCard] = useState<CardType | null>(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        getCardById(cardId)
            .then(data => setCard(data))
            .catch(() => setNotFound(true))
    }, [cardId])

    if (notFound) {
        return <NotFoundPage />
    }

    return (
        <div className="min-h-screen bg-[#121212] pb-16 text-[#f7f8f8]">
            <div className="mx-auto max-w-350 px-4 pt-10 sm:px-8">
                <Link
                    to={card ? `/sets/${card.card_set}` : "/"}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#b3b3b3] transition-colors duration-200 hover:text-[#f7f8f8]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                </Link>
                <main className="mt-6 flex flex-col gap-8">
                    <CardDetail card={card} />
                    <PriceChart cardId={cardId} />
                </main>
            </div>
        </div>
    )
}

export default CardPage
