import type { Card, PriceSnapshot } from "../types/card"
import type { Set } from "../types/set"
import type { Page } from "../types/page"

async function fetchAPI(endpoint: string){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`)
    const data = await response.json()
    return data
}

export async function getCardsBySet(setId: string, page: number = 1): Promise<Page<Card>>{
    return fetchAPI(`/api/sets/${setId}/cards/?page=${page}`)
}

export async function getCardById(cardId: string): Promise<Card>{
    return fetchAPI(`/api/cards/${cardId}/`)
}

export async function getCardPrices(cardId: string): Promise<PriceSnapshot[]>{
    return fetchAPI(`/api/cards/${cardId}/prices/`)
}

export async function getAllSets(): Promise<Set[]>{
    return fetchAPI(`/api/sets/`)
}

export async function getSetById(setId: string): Promise<Set>{
    return fetchAPI(`/api/sets/${setId}/`)
}