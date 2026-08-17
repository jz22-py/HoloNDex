export async function getCardsBySet(setId: string){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sets/${setId}/cards/`)
    const data = await response.json()
    return data
}

export async function getCardById(cardId: string){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/${cardId}/`)
    const data = await response.json()
    return data
}

export async function getCardPrices(cardId: string){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/${cardId}/prices/`)
    const data = await response.json()
    return data
}
