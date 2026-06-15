import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { parseEther, toHex } from 'viem'
import { PAYMENT_ADDRESS, type Token } from '../data/tokens'
import { useEthPrice, usdToEth } from '../hooks/useEthPrice'

const PRESETS = [10, 50, 100, 500]

interface TradePanelProps {
  token: Token
}

export default function TradePanel({ token: _token }: TradePanelProps) {
  const { login, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const { price: ethPrice, loading: priceLoading, error: priceError } = useEthPrice()
  const [amount, setAmount] = useState('')
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const applyPreset = (usd: number) => {
    if (!ethPrice) {
      setError('ETH price loading, try again')
      return
    }
    setAmount(usdToEth(usd, ethPrice))
    setError('')
  }

  const handleBuy = async () => {
    if (!authenticated) {
      login()
      return
    }

    const ethAmount = parseFloat(amount)
    if (!ethAmount || ethAmount <= 0) {
      setError('Enter a valid amount')
      return
    }

    const wallet = wallets[0]
    if (!wallet) {
      setError('No wallet connected')
      return
    }

    setLoading(true)
    setError('')

    try {
      await wallet.switchChain(1)

      const provider = await wallet.getEthereumProvider()
      const value = toHex(parseEther(ethAmount.toString()))

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: wallet.address,
          to: PAYMENT_ADDRESS,
          value,
        }],
      })

      setAmount('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="trade-panel">
      <div className="trade-tabs">
        <button
          className={`trade-tab ${tab === 'buy' ? 'active' : ''}`}
          onClick={() => setTab('buy')}
        >
          Buy
        </button>
        <button
          className={`trade-tab ${tab === 'sell' ? 'active' : ''}`}
          onClick={() => setTab('sell')}
        >
          Sell
        </button>
      </div>

      <div className="trade-input-label">
        You pay (ETH)
        {ethPrice != null && (
          <span className="eth-price-tag">
            1 ETH ≈ ${ethPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} · COINBASE:ETHUSD
          </span>
        )}
      </div>
      <div className="trade-input-wrap">
        <input
          className="trade-input"
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError('') }}
          step="any"
          min="0"
        />
      </div>

      <div className="trade-presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            className="preset-btn"
            onClick={() => applyPreset(p)}
            disabled={priceLoading || !ethPrice}
          >
            ${p}
          </button>
        ))}
      </div>

      {priceError && (
        <div style={{ color: '#ff4444', fontSize: 12, marginBottom: 12 }}>{priceError}</div>
      )}

      <div className="trade-fees">
        <div className="fee-row">
          <span className="label">Slippage</span>
          <span className="value">1.0%</span>
        </div>
        <div className="fee-row">
          <span className="label">Protocol fee</span>
          <span className="value">0.50%</span>
        </div>
        <div className="fee-row">
          <span className="label">Creator fee</span>
          <span className="value">0.50%</span>
        </div>
      </div>

      {error && (
        <div style={{ color: '#ff4444', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}

      <button
        className="btn-buy"
        onClick={handleBuy}
        disabled={loading || tab === 'sell'}
      >
        {loading ? 'Confirming…' : authenticated ? 'Buy' : 'Connect wallet'}
      </button>

      <p className="trade-disclaimer">
        1% fee (0.5% protocol / 0.5% creator). Price tracks the stock × curve demand. Graduates at $10k raised.
      </p>
    </div>
  )
}
