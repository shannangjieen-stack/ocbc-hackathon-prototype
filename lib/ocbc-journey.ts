export type MonthPlan = { month: string; contribution: number; categories: { dining: number; shopping: number; travel: number } }

export const basePlan: MonthPlan[] = [
  { month: 'Sep', contribution: 700, categories: { dining: 420, shopping: 380, travel: 200 } },
  { month: 'Oct', contribution: 850, categories: { dining: 400, shopping: 350, travel: 180 } },
  { month: 'Nov', contribution: 950, categories: { dining: 390, shopping: 330, travel: 160 } },
  { month: 'Dec', contribution: 700, categories: { dining: 450, shopping: 400, travel: 220 } },
]

export const GOAL_TOTAL = 3200
export const AVAILABLE_CASHFLOW = 2400

export function totalContribution(plan: MonthPlan[]) {
  return plan.reduce((sum, month) => sum + month.contribution, 0)
}

export function remainingGoal(plan: MonthPlan[]) {
  return Math.max(0, GOAL_TOTAL - totalContribution(plan))
}

export function categoryTotal(plan: MonthPlan[], key: keyof MonthPlan['categories']) {
  return plan.reduce((sum, month) => sum + month.categories[key], 0)
}

export function clonePlan(plan: MonthPlan[]) {
  return plan.map((month) => ({ ...month, categories: { ...month.categories } }))
}

export const resetPlan = () => clonePlan(basePlan)

export const planAssumptions = [
  'Trip target: S$3,200 for four days in Japan',
  'Monthly flexible cashflow available: S$2,400',
  'Existing bills, emergency savings, and investments remain protected',
]

export const planRisks = ['December has higher discretionary spending', 'FX rates may move before booking']
export const planOpportunities = ['Lock a better FX rate when SGD/JPY improves', 'Use the Dining guardrail to protect the December contribution']

export type PlanStatus = 'draft' | 'approved' | 'saved'

export type JourneyState = {
  plan: MonthPlan[]
  status: PlanStatus
  reportGenerated: boolean
  recalibration: 'idle' | 'approved' | 'rejected'
}

export const initialJourney: JourneyState = {
  plan: resetPlan(),
  status: 'draft',
  reportGenerated: false,
  recalibration: 'idle',
}

export function planValid(plan: MonthPlan[]) {
  return plan.every((month) => {
    const categories = Object.values(month.categories).reduce((a, b) => a + b, 0)
    return month.contribution >= 0 && categories <= AVAILABLE_CASHFLOW
  })
}

export function currency(value: number) {
  return `S$${value.toLocaleString('en-SG')}`
}

export function exportPlanText(plan: MonthPlan[]) {
  return ['OCBC Pulse Japan Trip Plan', '', ...plan.map((m) => `${m.month}: save ${currency(m.contribution)} · Dining ${currency(m.categories.dining)} · Shopping ${currency(m.categories.shopping)} · Travel ${currency(m.categories.travel)}`), '', `Remaining goal: ${currency(remainingGoal(plan))}`].join('\n')
}
