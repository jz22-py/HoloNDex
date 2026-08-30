export interface Card {
    id: number
    card_set: number
    name: string
    number: string
    rarity: string
    supertype: string
    external_id: string
    image_url: string
    current_price: string | null
    artist: string | null
}

export interface PriceSnapshot {
    variant: string
    price: string
    recorded_at: string
}