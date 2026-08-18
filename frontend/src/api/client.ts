import type { Card, PriceSnapshot } from "../types/card"


async function fetchAPI(endpoint: string){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`)
    console.log(response)
    const data = await response.json()
    console.log(data)
    return data
}

export async function getCardsBySet(setId: string): Promise<Card[]>{
    return fetchAPI(`/api/sets/${setId}/cards/`)
}

export async function getCardById(cardId: string): Promise<Card>{
    return fetchAPI(`/api/cards/${cardId}/`)
}

export async function getCardPrices(cardId: string): Promise<PriceSnapshot[]>{
    return fetchAPI(`/api/cards/${cardId}/prices/`)
}

