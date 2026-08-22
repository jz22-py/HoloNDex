import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { Card } from "../types/card"
import { getCardsBySet } from "../api/client"

export function CardList( {setId}: {setId: string}){
    const [cards, setCards] = useState<Card[]>([])

    useEffect(() => {
        getCardsBySet(setId).then(data => setCards(data))
    }, [setId])

    return (
        <>
        {cards.map(card => (
            <Link key={card.id} to={`/cards/${card.id}`}>
                <img src={card.image_url} />
            </Link>
        ))}
        </>
    )
}

