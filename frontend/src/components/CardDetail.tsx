import type { Card as CardType } from "../types/card"
import imageUnavailable from "../assets/image_unavailable.svg"

export function CardDetail({ card }: { card: CardType | null }) {
    if (!card) {
        return null
    }

    return (
        <div className="flex flex-col gap-8 rounded-3xl bg-[#181818] p-8 sm:flex-row sm:items-center">
            <div className="mx-auto flex h-72 w-56 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/20 sm:mx-0">
                <img
                    src={card.image_url || imageUnavailable}
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = imageUnavailable
                    }}
                    alt={card.name}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
            <div className="min-w-0">
                <p className="text-sm text-[#b3b3b3]">
                    #{card.number} · {card.rarity || "—"}
                </p>
                <h1 className="mt-1 text-4xl font-normal tracking-[-0.5px] text-[#f7f8f8]">{card.name}</h1>
                <p className="mt-6 font-mono text-3xl font-medium text-[#1ed760]">
                    {card.current_price !== null ? `$${card.current_price}` : "No Price Recorded"}
                </p>
            </div>
        </div>
    )
}
