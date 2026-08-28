export type MonthPlan = { month: string; contribution: number; categories: { dining: number; shopping: number; travel: number } }

export type ConversationAnswers = {
  destination?: string
  travelDate?: string
  tripCost?: number
  existingSavings?: number
  commitments?: string[]
  commitmentDetails?: Record<string, { month: string; amount: number }>
  priority?: string
}

export type AuditAction = { label: string; timestamp: string }
export type PlanStatus = 'draft' | 'proposed' | 'pending-review' | 'approved'
export type JourneyState = {
  plan: MonthPlan[]
  status: PlanStatus
  reportGenerated: boolean
  recalibration: 'idle' | 'approved' | 'rejected'
  conversationAnswers: ConversationAnswers
  proposedPlan: MonthPlan[] | null
  approvedPlan: MonthPlan[] | null
  report: { generatedAt: string; updatedAt?: string } | null
  approvalTimestamp?: string
  updatedTimestamp?: string
  auditActions: AuditAction[]
}

export const GOAL_TOTAL = 3200
export const AVAILABLE_CASHFLOW = 2400
export const DEFAULT_TRIP_COST = 3500
export const DEFAULT_SAVINGS = 800

export const basePlan: MonthPlan[] = [
  { month: 'Sep', contribution: 900, categories: { dining: 420, shopping: 380, travel: 200 } },
  { month: 'Oct', contribution: 550, categories: { dining: 400, shopping: 350, travel: 180 } },
  { month: 'Nov', contribution: 1050, categories: { dining: 390, shopping: 330, travel: 160 } },
  { month: 'Dec', contribution: 200, categories: { dining: 450, shopping: 400, travel: 220 } },
]
export const resetPlan = () => basePlan.map((m) => ({ ...m, categories: { ...m.categories } }))
export const initialJourney: JourneyState = { plan: resetPlan(), status: 'draft', reportGenerated: false, recalibration: 'idle', conversationAnswers: {}, proposedPlan: null, approvedPlan: null, report: null, auditActions: [] }
export function totalContribution(plan: MonthPlan[]) { return plan.reduce((s, m) => s + m.contribution, 0) }
export function remainingGoal(plan: MonthPlan[], cost = DEFAULT_TRIP_COST, saved = DEFAULT_SAVINGS) { return Math.max(0, cost - saved - totalContribution(plan)) }
export function clonePlan(plan: MonthPlan[]) { return plan.map((m) => ({ ...m, categories: { ...m.categories } })) }
export function planValid(plan: MonthPlan[]) { return plan.every((m) => Object.values(m.categories).reduce((a, b) => a + b, 0) <= AVAILABLE_CASHFLOW && m.contribution >= 0) }
export function currency(value: number) { return `S$${value.toLocaleString('en-SG')}` }
export const planAssumptions = ['Existing bills and emergency savings remain protected', 'Monthly flexible cashflow available: S$2,400', 'FX rates may change before booking']
export const planRisks = ['October commitments may require a lower trip contribution', 'December timing leaves less room for delays']
export const planOpportunities = ['Lock a better SGD/JPY rate when it improves', 'Keep Dining within the agreed guardrail']
export function exportPlanText(plan: MonthPlan[], answers: ConversationAnswers = {}) { return ['OCBC Pulse Financial Plan', `Destination: ${answers.destination ?? 'Not set'}`, `Travel date: ${answers.travelDate ?? 'Not set'}`, `Trip cost: ${currency(answers.tripCost ?? DEFAULT_TRIP_COST)}`, `Existing savings: ${currency(answers.existingSavings ?? DEFAULT_SAVINGS)}`, '', ...plan.map((m) => `${m.month}: save ${currency(m.contribution)} · Dining ${currency(m.categories.dining)} · Shopping ${currency(m.categories.shopping)} · Travel ${currency(m.categories.travel)}`), '', `Remaining goal: ${currency(remainingGoal(plan, answers.tripCost, answers.existingSavings))}`].join('\n') }

export const addAudit = (actions: AuditAction[], label: string) => [...actions, { label, timestamp: new Date().toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' }) }]
export function makeDemoPlan(a: ConversationAnswers): MonthPlan[] { return resetPlan() }
export const commitmentLabel = (s: string) => s === 'Public holiday plans' ? 'Public holiday' : s === 'Family celebration' ? 'family celebration' : s
export function categoryTotal(plan: MonthPlan[], key: keyof MonthPlan['categories']) { return plan.reduce((s, m) => s + m.categories[key], 0) }
