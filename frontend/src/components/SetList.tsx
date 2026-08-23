import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllSets } from "../api/client"
import type { Set } from "../types/set"

export function SetList() {
    const [sets, setSets] = useState<Set[]>([])

    useEffect(() => {
        getAllSets().then(data => {setSets(data)})
    }, [])

    console.log(sets)
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {sets.map((set) => (
                <Link key={set.id} to={`/sets/${set.id}`} className="text-center">
                    <img src={set.logo_url} alt={set.name} className="h-16 mx-auto object-contain mb-2"/>
                    <p className="text-sm">{set.name} - {set.abbreviation}</p>
                </Link>
            ))}
        </div>
    )
}