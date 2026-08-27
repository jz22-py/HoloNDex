import { useState, useEffect } from "react"
import { getCardById } from "../api/client"
import type { Card as CardType } from "../types/card"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import imageUnavailable from "../assets/image_unavailable.svg"


export function CardDetail( {cardId}: {cardId: string}){
    const [card, setCard] = useState<CardType | null>(null)

    useEffect(() => {
        getCardById(cardId).then(data => {setCard(data)})
    }, [cardId])

    if (!card){
        return null
    }

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-xl">{card.name}</CardTitle>
                <CardDescription>
                    #{card.number} · {card.rarity} · {card.artist !== null ? card.artist : "---"} | {card.current_price !== null ? `$${card.current_price}` : "---"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <img
                    src={card.image_url || imageUnavailable}
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = imageUnavailable
                    }}
                    alt={card.name}
                    className="w-56 rounded-lg shadow-md"
                />
            </CardContent>
        </Card>
    )
}