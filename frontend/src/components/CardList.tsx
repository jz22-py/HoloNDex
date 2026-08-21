import { useState, useEffect } from "react"
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
            <img key={card.id} src={card.image_url} />
        ))}
        </>
    )
}

