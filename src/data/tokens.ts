export interface Token {
  id: number
  address: string
  ticker: string
  name: string
  subtitle: string
  price: number
  status: 'curve' | 'listed'
  progress: number
  age: string
  raised: number
  logo: string
  logoBg: string
  trackInfo: string
  recentTrades: { type: 'buy' | 'sell'; wallet: string; usd: number; amount: string; time: string }[]
}

export const GRADUATION_TARGET = 10000
export const PAYMENT_ADDRESS = '0x9014c3e900A57e2C6082917Fc8EF779bC25433EA' as const

export const tokens: Token[] = [
  {
    id: 1,
    address: '0xdd09a34A4D55a6bb880a49614b1DD1d0a6C3fDf2',
    ticker: 'NVDA',
    name: 'NVDA',
    subtitle: 'NVIDIA',
    price: 0.00000515,
    status: 'curve',
    progress: 92,
    age: '4h',
    raised: 9200,
    logo: 'https://logo.clearbit.com/nvidia.com',
    logoBg: '#76b900',
    trackInfo: 'NVIDIA · tracks NVDA — NVIDIA Corp.',
    recentTrades: [{ type: 'buy', wallet: '0xA5Bf…665d', usd: 30, amount: '5.9M NVDA', time: '4h' }],
  },
  {
    id: 2,
    address: '0x8f3Cf7ad23D3DbDddDE1c054F46B8D1a356a2b8b',
    ticker: 'MCHI',
    name: 'MCHI',
    subtitle: 'MCHI',
    price: 0.000005,
    status: 'curve',
    progress: 75,
    age: '10h',
    raised: 7500,
    logo: '',
    logoBg: '#1a1a1a',
    trackInfo: 'MCHI · tracks MCHI ETF',
    recentTrades: [{ type: 'buy', wallet: '0x3C2a…91Fe', usd: 50, amount: '10M MCHI', time: '8h' }],
  },
  {
    id: 3,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    ticker: 'AAPL',
    name: 'AAPL',
    subtitle: 'Apple',
    price: 0.00000559,
    status: 'curve',
    progress: 88,
    age: '15h',
    raised: 8800,
    logo: 'https://logo.clearbit.com/apple.com',
    logoBg: '#000000',
    trackInfo: 'Apple · tracks AAPL — Apple Inc.',
    recentTrades: [{ type: 'buy', wallet: '0x7B4e…22Ac', usd: 100, amount: '17.9M AAPL', time: '12h' }],
  },
  {
    id: 4,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    ticker: 'TSLA',
    name: 'TSLA',
    subtitle: 'Tesla',
    price: 0.00000559,
    status: 'curve',
    progress: 85,
    age: '15h',
    raised: 8500,
    logo: 'https://logo.clearbit.com/tesla.com',
    logoBg: '#cc0000',
    trackInfo: 'Tesla · tracks TSLA — Tesla Inc.',
    recentTrades: [{ type: 'buy', wallet: '0x9F1c…44Bd', usd: 75, amount: '13.4M TSLA', time: '14h' }],
  },
  {
    id: 5,
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    ticker: 'DOGBRO',
    name: 'DOGBRO',
    subtitle: '狗哥sato',
    price: 0.00000507,
    status: 'curve',
    progress: 35,
    age: '1d',
    raised: 3500,
    logo: '',
    logoBg: '#f7931a',
    trackInfo: 'DOGBRO · community token',
    recentTrades: [{ type: 'buy', wallet: '0x2D8a…77Ef', usd: 20, amount: '3.9M DOGBRO', time: '20h' }],
  },
  {
    id: 6,
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    ticker: 'QQQQ',
    name: 'QQQQ',
    subtitle: '企鹅TENCENT',
    price: 0.000005,
    status: 'curve',
    progress: 70,
    age: '1d',
    raised: 7000,
    logo: 'https://logo.clearbit.com/tencent.com',
    logoBg: '#006eff',
    trackInfo: 'QQQQ · tracks TENCENT — Tencent Holdings',
    recentTrades: [{ type: 'buy', wallet: '0x5E6b…33Cc', usd: 45, amount: '9M QQQQ', time: '18h' }],
  },
  {
    id: 7,
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    ticker: 'SPCX',
    name: 'SpaceX',
    subtitle: 'SpaceX',
    price: 0.00004541,
    status: 'listed',
    progress: 98,
    age: '1d',
    raised: 9800,
    logo: '',
    logoBg: '#ffffff',
    trackInfo: 'SpaceX · tracks SPCX — Space Exploration',
    recentTrades: [{ type: 'buy', wallet: '0x1A2b…99Dd', usd: 500, amount: '11M SPCX', time: '6h' }],
  },
  {
    id: 8,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    ticker: 'CSI300',
    name: 'CSI300',
    subtitle: 'CSI300',
    price: 0.0000051,
    status: 'curve',
    progress: 45,
    age: '1d',
    raised: 4500,
    logo: '',
    logoBg: '#e60012',
    trackInfo: 'CSI300 · tracks CSI 300 Index',
    recentTrades: [{ type: 'buy', wallet: '0x4C7d…55Aa', usd: 25, amount: '4.9M CSI300', time: '22h' }],
  },
  {
    id: 9,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ticker: 'RAM',
    name: 'RAM',
    subtitle: 'RAM COIN NVDA',
    price: 0.00000546,
    status: 'curve',
    progress: 65,
    age: '2d',
    raised: 6500,
    logo: '',
    logoBg: '#333333',
    trackInfo: 'RAM · tracks NVDA derivative',
    recentTrades: [{ type: 'buy', wallet: '0x8D3e…11Ff', usd: 40, amount: '7.3M RAM', time: '1d' }],
  },
]

export function getTokenByAddress(address: string): Token | undefined {
  return tokens.find((t) => t.address.toLowerCase() === address.toLowerCase())
}

export function formatPrice(price: number): string {
  if (price >= 0.00001) return `$${price.toFixed(8).replace(/\.?0+$/, '')}`
  return `$${price.toFixed(8)}`
}

export function formatProgress(n: number): string {
  return `${n}%`
}
