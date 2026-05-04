// Convert dimensions to cubic yards
export function calcCubicYards(lengthFt, widthFt, thicknessIn) {
  const l = parseFloat(lengthFt) || 0
  const w = parseFloat(widthFt) || 0
  const t = parseFloat(thicknessIn) || 0
  return (l * w * (t / 12)) / 27
}

export function calcWallCubicYards(lengthFt, heightFt, thicknessIn) {
  return calcCubicYards(lengthFt, heightFt, thicknessIn)
}

export function round2(n) {
  return Math.round(n * 100) / 100
}

export function currency(n) {
  return '$' + (parseFloat(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
