import { useState, useEffect } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { getCardPrices } from "../api/client"
import type { PriceSnapshot } from "../types/card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Collapses same-day snapshots (browser's local timezone) to one per
// variant per day. Later snapshots overwrite earlier ones for that day.
function dedupByLocalDate(prices: PriceSnapshot[]): PriceSnapshot[] {
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


function buildChartData(prices: PriceSnapshot[]) {
    const byDate: Record<string, Record<string, string | number>> = {}
    for (const price of prices) {
        const localDate = new Date(price.recorded_at).toLocaleDateString()
        if (!byDate[localDate]) byDate[localDate] = { date: localDate }
        byDate[localDate][sanitizeKey(price.variant)] = parseFloat(price.price)
    }
    return Object.values(byDate)
}

const themeColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function PriceChart({cardId}: {cardId: string}) {
    const [prices, setPrices] = useState<PriceSnapshot[]>([])

    useEffect(() => {
        getCardPrices(cardId).then(data => setPrices(data))
    }, [cardId])

    if (prices.length === 0) {
        return <p>Price history not found</p>
    }

    const deduped = dedupByLocalDate(prices)
    const chartData = buildChartData(deduped)
    const variants = [...new Set(deduped.map(p => p.variant))]

    const chartConfig = Object.fromEntries(
        variants.map((variant, i) => [
            sanitizeKey(variant),
            { label: variant, color: themeColors[i % themeColors.length] },
        ])
    ) satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>By variant, one snapshot per day</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-[1000px]">
                    <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {variants.map((variant) => {
                            const key = sanitizeKey(variant)
                            return (
                                <Line
                                    key={key}
                                    dataKey={key}
                                    type="natural"
                                    stroke={`var(--color-${key})`}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )
                        })}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}