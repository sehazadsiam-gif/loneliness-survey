export const REVERSE_SCORED = new Set([1, 5, 6, 9, 10, 15, 16, 19, 20])

export function scoreAnswer(questionNumber: number, rawValue: number): number {
  if (REVERSE_SCORED.has(questionNumber)) return 5 - rawValue
  return rawValue
}

export function calculateTotalScore(answers: Record<number, number>): number {
  let total = 0
  for (let q = 1; q <= 20; q++) {
    total += scoreAnswer(q, answers[q] ?? 1)
  }
  return total
}

export function getLonelinessLevel(score: number): {
  level: string; label: string; description: string; color: string
} {
  if (score <= 34) return {
    level: 'low', label: 'Low Loneliness',
    description: 'You generally feel socially connected and supported.',
    color: '#4caf50'
  }
  if (score <= 49) return {
    level: 'moderate', label: 'Moderate Loneliness',
    description: 'You sometimes feel isolated; improving social interaction may help.',
    color: '#ff9800'
  }
  if (score <= 64) return {
    level: 'high', label: 'High Loneliness',
    description: 'You frequently feel lonely; this may be affecting your well-being.',
    color: '#f44336'
  }
  return {
    level: 'very_high', label: 'Very High Loneliness',
    description: 'You often feel isolated and disconnected; support and intervention may be helpful.',
    color: '#9c27b0'
  }
}
