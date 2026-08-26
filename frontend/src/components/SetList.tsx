import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { getAllSets } from "../api/client"
import type { Set } from "../types/set"
import { groupSetsBySeries } from "../utils/groupSetsBySeries"

export function SetList() {
    const [sets, setSets] = useState<Set[]>([])

    useEffect(() => {
        getAllSets().then(data => {setSets(data)})
    }, [])

    const groupedSets = useMemo(() => groupSetsBySeries(sets), [sets])

    return (
        <div className="p-4">
            {groupedSets.map((group) => (
                <div key={group.sets[0].id} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{group.series}</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {group.sets.map((set) => (
                            <Link key={set.id} to={`/sets/${set.id}`} className="text-center">
                                <img src={set.logo_url} alt={set.name} className="h-16 mx-auto object-contain mb-2"/>
                                <p className="text-sm">{set.name} - {set.abbreviation}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}