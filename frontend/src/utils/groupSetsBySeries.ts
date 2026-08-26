import type { Set } from "../types/set"

export function groupSetsBySeries(sets: Set[]): { series: string; sets: Set[] }[] {
  const groups: { series: string; sets: Set[] }[] = [];

  for (const currentSet of sets) {
    const lastGroup = groups[groups.length - 1];

    if (!lastGroup || lastGroup.series !== currentSet.series) {
      groups.push({
        series: currentSet.series,
        sets: [currentSet]
      });
    } else {
      lastGroup.sets.push(currentSet);
    }
  }

  return groups;
}