import { describe, expect, it } from "vitest"
import { groupSetsBySeries } from "./groupSetsBySeries"
import type { Set } from "../types/set"

function makeSet(id: number, series: string): Set {
    return { id, name: `Set ${id}`, series, release_date: "2020-01-01", total_cards: 0, external_id: String(id), logo_url: "", abbreviation: "" }
}

describe("groupSetsBySeries", () => {
    it("groups contiguous sets sharing a series", () => {
        const sets = [makeSet(1, "A"), makeSet(2, "A"), makeSet(3, "B")]
        const groups = groupSetsBySeries(sets)

        expect(groups).toHaveLength(2)
        expect(groups[0].series).toBe("A")
        expect(groups[0].sets.map(s => s.id)).toEqual([1, 2])
        expect(groups[1].series).toBe("B")
    })

    it("starts a new group when the same series reappears non-contiguously", () => {
        // Relies on the caller (backend ordering) keeping a series
        // contiguous -- a repeated, non-adjacent series produces two
        // separate groups rather than merging into one.
        const sets = [makeSet(1, "A"), makeSet(2, "B"), makeSet(3, "A")]
        const groups = groupSetsBySeries(sets)

        expect(groups).toHaveLength(3)
    })

    it("returns an empty list for no sets", () => {
        expect(groupSetsBySeries([])).toEqual([])
    })
})
