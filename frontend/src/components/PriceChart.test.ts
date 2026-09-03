import { describe, expect, it } from "vitest"
import { buildChartData, dedupByLocalDate } from "./priceChartData"
import type { PriceSnapshot } from "../types/card"

function snapshot(variant: string, price: string, recorded_at: string): PriceSnapshot {
    return { variant, price, recorded_at }
}

describe("dedupByLocalDate", () => {
    it("collapses same-day, same-variant snapshots to the later one", () => {
        // Midday UTC on both, so this holds regardless of the runner's
        // local timezone (unlike times near a day boundary).
        const prices = [
            snapshot("Normal", "1.00", "2024-01-01T12:00:00Z"),
            snapshot("Normal", "2.00", "2024-01-01T14:00:00Z"),
        ]
        const result = dedupByLocalDate(prices)

        expect(result).toHaveLength(1)
        expect(result[0].price).toBe("2.00")
    })

    it("keeps different variants on the same day separate", () => {
        const prices = [
            snapshot("Normal", "1.00", "2024-01-01T01:00:00Z"),
            snapshot("Holofoil", "5.00", "2024-01-01T01:00:00Z"),
        ]
        expect(dedupByLocalDate(prices)).toHaveLength(2)
    })

    it("keeps the same variant on different days separate", () => {
        const prices = [
            snapshot("Normal", "1.00", "2024-01-01T01:00:00Z"),
            snapshot("Normal", "2.00", "2024-01-02T01:00:00Z"),
        ]
        expect(dedupByLocalDate(prices)).toHaveLength(2)
    })
})

describe("buildChartData", () => {
    it("groups variants into one row per date, keyed by sanitized variant name", () => {
        const prices = [
            snapshot("Reverse Holofoil", "3.50", "2024-01-01T01:00:00Z"),
        ]
        const [row] = buildChartData(prices)

        expect(row.reverse_holofoil).toBe(3.5)
    })
})
