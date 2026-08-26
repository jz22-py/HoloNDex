import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import type { Card } from "../types/card"
import { getCardsBySet } from "../api/client"

export function CardList({ setId }: { setId: string }) {
    const [searchParams, setSearchParams] = useSearchParams()
    
    // reads URL for the page value. If the user changes sets, 
    // the URL won't have a ?page= yet, so it'll default back to 1.
    const page = Number(searchParams.get("page")) || 1

    const [cards, setCards] = useState<Card[]>([])
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    useEffect(() => {
        getCardsBySet(setId, page).then(data => {
            setCards(data.results)
            setHasNext(!!data.next)
            setHasPrev(!!data.previous)
        })
    }, [setId, page])

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4">
                {cards.map(card => (
                    <Link key={card.id} to={`/cards/${card.id}`}>
                        <img src={card.image_url} alt={card.name} />
                        <p className="text-sm text-center mt-1">
                            {card.name}
                        </p>
                        <p className="text-sm text-center mt-1">
                            {card.current_price !== null ? `$${card.current_price}` : "---"}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={() => setSearchParams({ page: String(page - 1) })} 
                    disabled={!hasPrev}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Previous
                </button>
                <span className="text-sm">Page {page}</span>
                <button 
                    onClick={() => setSearchParams({ page: String(page + 1) })} 
                    disabled={!hasNext}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
