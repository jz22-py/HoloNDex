import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { Set } from "../types/set"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatReleaseDate(dateStr: string): string {
    const [year, month] = dateStr.split("-")
    return `${MONTH_NAMES[Number(month) - 1]} ${year}`
}

export function SetHeader({ set }: { set: Set | null }) {
    return (
        <header className="border-b border-white/10 pb-6">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#b3b3b3] transition-colors duration-200 hover:text-[#f7f8f8]"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Sets
            </Link>

            <div className="mt-5 flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#181818] p-3 sm:h-24 sm:w-24">
                    {set && (
                        <img src={set.logo_url} alt={set.name} className="max-h-full max-w-full object-contain" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-[13px] font-medium tracking-[0.4px] text-[#b3b3b3]">{set?.series ?? "\u00A0"}</p>
                    <h1 className="mt-1 truncate text-2xl font-semibold tracking-[-0.8px] text-[#f7f8f8] sm:text-3xl">
                        {set?.name ?? "\u00A0"}
                    </h1>
                    {set && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#b3b3b3]">
                            <span className="rounded-full bg-[#1f1f1f] px-2.5 py-1 font-semibold tracking-wide text-[#f7f8f8]">
                                {set.abbreviation}
                            </span>
                            <span>{formatReleaseDate(set.release_date)}</span>
                            <span className="text-white/20">•</span>
                            <span>{set.total_cards} cards</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
