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
        <>
            {sets.map((set) => (
                <Link key={set.id} to={`/sets/${set.id}`}>
                    <p> {set.name} </p>
                </Link>
            ))}
        </>
    )
}