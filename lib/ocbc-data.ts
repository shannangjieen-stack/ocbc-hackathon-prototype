export type SpendCategory = {
  key: string
  label: string
  image: string
  spent: number
  budget: number
  aiAllowance: number
}

export const categories: SpendCategory[] = [
  {
    key: 'dining',
    label: 'Dining',
    image: '/images/dining.png',
    spent: 340,
    budget: 500,
    aiAllowance: 160,
  },
  {
    key: 'travel',
    label: 'Travel',
    image: '/images/travel.png',
    spent: 1240,
    budget: 1200,
    aiAllowance: 0,
  },
  {
    key: 'shopping',
    label: 'Shopping',
    image: '/images/shopping.png',
    spent: 210,
    budget: 450,
    aiAllowance: 240,
  },
]

export const accounts = [
  {
    name: '360 Account',
    number: '•••• 4821',
    balance: 24580.42,
    type: 'Savings',
  },
  {
    name: 'FRANK Account',
    number: '•••• 9032',
    balance: 3120.9,
    type: 'Everyday',
  },
]

export const upcomingBills = [
  { name: 'City Electric', due: 'Due in 2 days', amount: 128.4 },
  { name: 'SingTel Fibre', due: 'Due in 5 days', amount: 49.9 },
  { name: 'Visa Card', due: 'Due in 9 days', amount: 842.0 },
]

export const currency = (n: number) =>
  new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export const currencyShort = (n: number) =>
  new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(n)
