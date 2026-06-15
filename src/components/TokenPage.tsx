import { useParams, Navigate } from 'react-router-dom'
import { getTokenByAddress, formatPrice, GRADUATION_TARGET, type Token } from '../data/tokens'
import { ChartSection } from './PriceChart'
import TradePanel from './TradePanel'

function TokenLogo({ token }: { token: Token }) {
  if (token.logo) {
    return (
      <div className="token-header-logo" style={{ background: token.logoBg }}>
        <img src={token.logo} alt={token.ticker} />
      </div>
    )
  }
  return (
    <div className="token-header-logo" style={{ background: token.logoBg, color: '#fff' }}>
      {token.ticker.slice(0, 2)}
    </div>
  )
}

export default function TokenPage() {
  const { address } = useParams<{ address: string }>()
  const token = address ? getTokenByAddress(address) : undefined

  if (!token) return <Navigate to="/" replace />

  const shortAddr = `${token.address.slice(0, 6)}…${token.address.slice(-4)}`

  return (
    <div className="token-page">
      <div className="token-header">
        <div className="token-header-left">
          <TokenLogo token={token} />
          <div className="token-header-info">
            <h1>
              {token.ticker}
              <span className="token-header-badge">
                {token.status === 'listed' ? 'Listed' : 'Curve'}
              </span>
            </h1>
            <p>{token.trackInfo}</p>
            <div className="token-links">
              <a href={`https://x.com/search?q=${token.ticker}`} target="_blank" rel="noopener noreferrer">
                𝕏 ↗
              </a>
              <a href={`https://etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer">
                {shortAddr} explorer ↗
              </a>
            </div>
          </div>
        </div>

        <div className="token-stats-row">
          <div className="token-stat">
            <div className="value">{formatPrice(token.price)}</div>
            <div className="label">Price (USD/token)</div>
          </div>
          <div className="token-stat">
            <div className="value">—</div>
            <div className="label">{token.ticker} live</div>
          </div>
          <div className="token-stat">
            <div className="value accent">${token.raised.toLocaleString()}</div>
            <div className="label">Raised</div>
            <div className="sub">of ${GRADUATION_TARGET.toLocaleString()} to graduate</div>
          </div>
          <div className="token-stat">
            <div className="value">{token.age}</div>
            <div className="label">Age</div>
          </div>
        </div>
      </div>

      <div className="graduation-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', marginBottom: 24 }}>
        <div className="graduation-label">
          <span>Graduation progress</span>
          <span>{token.progress}%</span>
        </div>
        <div className="graduation-progress">
          <div className="graduation-fill" style={{ width: `${token.progress}%` }} />
        </div>
      </div>

      <div className="token-layout">
        <div>
          <ChartSection ticker={token.ticker} price={token.price} />

          <div className="trades-section">
            <div className="trades-title">Recent trades</div>
            {token.recentTrades.map((trade, i) => (
              <div key={i} className="trade-row">
                <span className={`trade-type ${trade.type}`}>{trade.type}</span>
                <span className="trade-wallet">{trade.wallet}</span>
                <span className="trade-amount">${trade.usd} · {trade.amount}</span>
                <span className="trade-time">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>

        <TradePanel token={token} />
      </div>
    </div>
  )
}
