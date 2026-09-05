import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Card } from "../types/card"
import { getCardsBySet } from "../api/client"
import imageUnavailable from "../assets/image_unavailable.svg"
import { getVisiblePages } from "./pagination"

// must match core/pagination.CardListPagination on the backend
const PAGE_SIZE = 30

export function CardList({ setId }: { setId: string }) {
    const [searchParams, setSearchParams] = useSearchParams()

    // reads URL for the page value. If the user changes sets,
    // the URL won't have a ?page= yet, so it'll default back to 1.
    const page = Number(searchParams.get("page")) || 1

    const [cards, setCards] = useState<Card[]>([])
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        getCardsBySet(setId, page).then(data => {
            setCards(data.results)
            setHasNext(!!data.next)
            setHasPrev(!!data.previous)
            setTotalPages(Math.max(1, Math.ceil(data.count / PAGE_SIZE)))
        })
    }, [setId, page])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [page])

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {cards.map(card => (
                    <Link
                        key={card.id}
                        to={`/cards/${card.id}`}
                        className="group block rounded-xl border border-transparent bg-[#181818] p-3 transition-colors duration-200 hover:border-[#34343a] hover:bg-[#1f1f1f]"
                    >
                        <div className="relative mb-3 overflow-hidden rounded-lg bg-black/20">
                            <img
                                src={card.image_url || imageUnavailable}
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = imageUnavailable
                                }}
                                alt={card.name}
                                className="aspect-[5/7] w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                            />
                        </div>
                        <div className="border-t border-white/10 pt-2.5">
                            <p className="truncate text-sm font-medium tracking-[-0.1px] text-[#f7f8f8]">{card.name}</p>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="truncate text-xs text-[#b3b3b3]">{card.rarity || "—"}</span>
                                <span className="text-xs font-semibold tracking-[-0.1px] text-[#1ed760]">
                                    {card.current_price !== null ? `$${card.current_price}` : "---"}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                    onClick={() => setSearchParams({ page: String(page - 1) })}
                    disabled={!hasPrev}
                    aria-label="Previous page"
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#1f1f1f] px-3 text-xs font-bold tracking-[1.2px] text-[#f7f8f8] uppercase transition-colors duration-200 hover:bg-[#2a2a2a] disabled:pointer-events-none disabled:opacity-40 sm:px-4"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                </button>
                <div className="flex max-w-full min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
                    {getVisiblePages(page, totalPages).map((item, index) =>
                        item === "ellipsis" ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-9 w-7 shrink-0 items-center justify-center text-xs text-[#b3b3b3]"
                                aria-hidden
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => setSearchParams({ page: String(item) })}
                                aria-current={item === page ? "page" : undefined}
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors duration-200 ${
                                    item === page
                                        ? "bg-[#2a2a2a] text-[#f7f8f8]"
                                        : "text-[#b3b3b3] hover:bg-white/5 hover:text-[#f7f8f8]"
                                }`}
                            >
                                {item}
                            </button>
                        ),
                    )}
                </div>
                <button
                    onClick={() => setSearchParams({ page: String(page + 1) })}
                    disabled={!hasNext}
                    aria-label="Next page"
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#1f1f1f] px-3 text-xs font-bold tracking-[1.2px] text-[#f7f8f8] uppercase transition-colors duration-200 hover:bg-[#2a2a2a] disabled:pointer-events-none disabled:opacity-40 sm:px-4"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
