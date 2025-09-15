export function parseLabels(raw: string): { text: string }[] {
  return splitLabels(raw).map(text => ({ text }))
}

export function formatLabels(labels: { text: string }[]): string {
  return labels.map(l => l.text).join('; ')
}

export function normalizeLabelsRaw(raw: string): string {
  const seen = new Set<string>()
  const parts = splitLabels(raw).filter(part => {
    const key = part.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return parts.join('; ')
}

export function splitLabels(raw: string): string[] {
  return raw
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
}
