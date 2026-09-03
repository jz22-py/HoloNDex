import type { PriceSnapshot } from "../types/card"

// Collapses same-day snapshots (browser's local timezone) to one per
// variant per day. Later snapshots overwrite earlier ones for that day.
export function dedupByLocalDate(prices: PriceSnapshot[]): PriceSnapshot[] {
    const byKey: Record<string, PriceSnapshot> = {}
    for (const price of prices) {
        const localDate = new Date(price.recorded_at).toLocaleDateString()
        byKey[`${price.variant}-${localDate}`] = price
    }
    return Object.values(byKey)
}

export function sanitizeKey(variant: string): string {
    return variant.replace(/\s+/g, "_").toLowerCase()
}

export function buildChartData(prices: PriceSnapshot[]) {
    const byDate: Record<string, Record<string, string | number>> = {}
    for (const price of prices) {
        const localDate = new Date(price.recorded_at).toLocaleDateString()
        if (!byDate[localDate]) byDate[localDate] = { date: localDate }
        byDate[localDate][sanitizeKey(price.variant)] = parseFloat(price.price)
    }
    return Object.values(byDate)
}
