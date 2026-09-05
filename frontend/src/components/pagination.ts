/** Compact page list so mobile doesn't overflow (e.g. 1 … 8 9 10 … 24). */
export function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages = new Set<number>([1, total])
    for (let i = current - 1; i <= current + 1; i++) {
        if (i >= 1 && i <= total) pages.add(i)
    }

    const sorted = [...pages].sort((a, b) => a - b)
    const result: (number | "ellipsis")[] = []
    for (let i = 0; i < sorted.length; i++) {
        const n = sorted[i]!
        if (i > 0 && n - sorted[i - 1]! > 1) {
            result.push("ellipsis")
        }
        result.push(n)
    }
    return result
}
