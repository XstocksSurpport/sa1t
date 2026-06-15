import { useEffect, useState } from 'react'

// COINBASE:ETHUSD — same feed as TradingView https://www.tradingview.com/chart/?symbol=COINBASE%3AETHUSD
const COINBASE_ETH_USD = 'https://api.exchange.coinbase.com/products/ETH-USD/ticker'
const REFRESH_MS = 30_000

export function useEthPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPrice() {
      try {
        const res = await fetch(COINBASE_ETH_USD)
        if (!res.ok) throw new Error('Price fetch failed')
        const data = (await res.json()) as { price: string }
        const next = parseFloat(data.price)
        if (!cancelled && Number.isFinite(next) && next > 0) {
          setPrice(next)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Unable to load ETH price')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPrice()
    const id = setInterval(fetchPrice, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { price, loading, error }
}

export function usdToEth(usd: number, ethPriceUsd: number): string {
  const eth = usd / ethPriceUsd
  if (eth >= 1) return eth.toFixed(4)
  if (eth >= 0.01) return eth.toFixed(6)
  return eth.toFixed(8)
}
