import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { getAllSets } from "../api/client"
import type { Set } from "../types/set"
import { groupSetsBySeries } from "../utils/groupSetsBySeries"

import megaEvolution from "../assets/mega_evolution.jpg"
import scarletViolet from "../assets/scarlet_violet.jpeg"
import swordShield from "../assets/sword_shield.png"
import sunMoon from "../assets/sun_moon.jpg"
import xy from "../assets/x_y.jpg"
import blackWhite from "../assets/black_white.jpg"
import heartGoldSoulSilver from "../assets/heartgold_soulsilver.png"
import platinum from "../assets/platinum.png"
import diamondPearl from "../assets/diamond_pearl.jpg"
import ex from "../assets/ex.png"
import eCard from "../assets/ecard.png"
import neo from "../assets/neo.png"
import gym from "../assets/gym.png"
import base from "../assets/base.png"



const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const SERIES_BANNERS: Record<string, string> = {
    "Mega Evolution": megaEvolution,
    "Scarlet & Violet": scarletViolet,
    "Sword & Shield": swordShield,
    "Sun & Moon": sunMoon,
    "XY": xy,
    "Black & White": blackWhite,
    "HeartGold & SoulSilver": heartGoldSoulSilver,
    "Platinum": platinum,
    "Diamond & Pearl": diamondPearl,
    "EX": ex,
    "E-Card": eCard,
    "Neo": neo,
    "Gym": gym,
    "Base": base,
}

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
            {groupedSets.map((group) => {
                const banner = SERIES_BANNERS[group.series]

                return (
                <div key={group.sets[0].id}>
                    {banner ? (
                        <div className="relative mb-4 overflow-hidden rounded-xl">
                            <img src={banner} alt="" className="h-40 w-full object-cover object-[50%_40%] sm:h-52" />
                            <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-[#121212]/30 to-transparent" />
                            <h2 className="absolute bottom-4 left-4 text-2xl font-semibold tracking-[-0.6px] text-white sm:text-3xl">
                                {group.series}
                            </h2>
                        </div>
                    ) : (
                        <h2 className="mb-4 text-xl font-semibold tracking-[-0.6px] text-[#f7f8f8] sm:text-2xl">{group.series}</h2>
                    )}

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
                )
            })}
        </div>
    )
}