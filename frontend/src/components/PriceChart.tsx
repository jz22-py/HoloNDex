import { useState, useEffect, type CSSProperties } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { getCardPrices } from "../api/client"
import type { PriceSnapshot } from "../types/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

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

function sanitizeKey(variant: string): string {
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

const seriesColors = ["#1ed760", "#539df5", "#ffa42b", "#f3727f", "#b3b3b3"]

const chartVars = {
    "--background": "#1f1f1f",
    "--foreground": "#f7f8f8",
    "--border": "#2a2a2a",
    "--muted-foreground": "#b3b3b3",
} as CSSProperties

export function PriceChart({ cardId }: { cardId: string }) {
    const [prices, setPrices] = useState<PriceSnapshot[]>([])

    useEffect(() => {
        getCardPrices(cardId).then(data => setPrices(data))
    }, [cardId])

    if (prices.length === 0) {
        return <p className="text-sm text-[#b3b3b3]">Price history not found</p>
    }

    const deduped = dedupByLocalDate(prices)
    const chartData = buildChartData(deduped)
    const variants = [...new Set(deduped.map(p => p.variant))]

    const chartConfig = Object.fromEntries(
        variants.map((variant, i) => [
            sanitizeKey(variant),
            { label: variant, color: seriesColors[i % seriesColors.length] },
        ])
    ) satisfies ChartConfig

    return (
        <div className="rounded-3xl bg-[#181818] p-8" style={chartVars}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-[#f7f8f8]">Price History</h2>
                    <p className="mt-1 text-sm text-[#b3b3b3]">By variant, one snapshot per day</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {variants.map((variant, i) => (
                        <span key={variant} className="flex items-center gap-1.5 text-xs text-[#b3b3b3]">
                            <span
                                className="h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: seriesColors[i % seriesColors.length] }}
                            />
                            {variant}
                        </span>
                    ))}
                </div>
            </div>
            <ChartContainer config={chartConfig} className="mt-6 h-[280px] w-full">
                <AreaChart accessibilityLayer data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
                    <defs>
                        {variants.map((variant) => {
                            const key = sanitizeKey(variant)
                            return (
                                <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0} />
                                </linearGradient>
                            )
                        })}
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={56}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    {variants.map((variant) => {
                        const key = sanitizeKey(variant)
                        return (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                stroke={`var(--color-${key})`}
                                fill={`url(#fill-${key})`}
                                strokeWidth={2}
                            />
                        )
                    })}
                </AreaChart>
            </ChartContainer>
        </div>
    )
}