export interface Card {
    id: number
    name: string
    number: string
    rarity: string
    supertype: string
    external_id: string
    image_url: string
}

export interface PriceSnapshot {
    variant: string
    price: string
    recorded_at: string
}