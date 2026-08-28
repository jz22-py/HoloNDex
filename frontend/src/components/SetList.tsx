import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { getAllSets } from "../api/client"
import type { Set } from "../types/set"
import { groupSetsBySeries } from "../utils/groupSetsBySeries"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatReleaseDate(dateStr: string): string {
    const [year, month] = dateStr.split("-")
    return `${MONTH_NAMES[Number(month) - 1]} ${year}`
}

export function SetList() {
    const [sets, setSets] = useState<Set[]>([])

    useEffect(() => {
        getAllSets().then(data => {setSets(data)})
    }, [])

    const groupedSets = useMemo(() => groupSetsBySeries(sets), [sets])

    return (
        <div className="space-y-10">
            {groupedSets.map((group) => (
                <div key={group.sets[0].id}>
                    <h2 className="mb-4 text-xl font-semibold tracking-[-0.6px] text-[#f7f8f8] sm:text-2xl">{group.series}</h2>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {group.sets.map((set) => (
                            <Link
                                key={set.id}
                                to={`/sets/${set.id}`}
                                className="group block rounded-xl border border-transparent bg-[#181818] p-4 transition-colors duration-200 hover:border-[#34343a] hover:bg-[#1f1f1f]"
                            >
                                <div className="relative mb-3 flex aspect-square items-center justify-center">
                                    <img
                                        src={set.logo_url}
                                        alt={set.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    <div className="absolute right-0 bottom-0 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#5e6ad2] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-3">
                                    <p className="truncate text-sm font-medium tracking-[-0.1px] text-[#f7f8f8]">{set.name}</p>
                                    <p className="text-xs text-[#b3b3b3]">
                                        <span className="mr-2 border-r border-white/15 pr-2">{set.abbreviation}</span>
                                        {formatReleaseDate(set.release_date)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}