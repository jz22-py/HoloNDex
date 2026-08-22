import { useState, useEffect } from "react"
import { getCardById } from "../api/client"
import type { Card as CardType } from "../types/card"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"


export function CardDetail( {cardId}: {cardId: string}){
    const [card, setCard] = useState<CardType | null>(null)

    useEffect(() => {
        getCardById(cardId).then(data => {setCard(data)})
    }, [cardId])

    if (!card) {
        return <p>Card not found</p>
    }

    return (
        <Card>
            <CardContent>
                <img src={card.image_url} alt={card.name} />
            </CardContent>
            <CardHeader>
                <CardTitle>{card.name}</CardTitle>
                <CardDescription>
                    #{card.number} · {card.rarity}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}