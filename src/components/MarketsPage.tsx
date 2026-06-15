import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokens, formatPrice, type Token } from '../data/tokens'

type SortKey = 'newest' | 'marketcap' | 'raised' | 'oldest'
type FilterKey = 'all' | 'curve' | 'listed'

function TokenLogo({ token }: { token: Token }) {
  if (token.logo) {
    return (
      <div className="token-logo" style={{ background: token.logoBg }}>
        <img src={token.logo} alt={token.ticker} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>
    )
  }
  return (
    <div className="token-logo" style={{ background: token.logoBg, color: '#fff' }}>
      {token.ticker.slice(0, 2)}
    </div>
  )
}

export default function MarketsPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState<SortKey>('newest')
  const [filter, setFilter] = useState<FilterKey>('all')

  const listedCount = tokens.filter((t) => t.status === 'listed').length

  const filtered = useMemo(() => {
    let list = [...tokens]
    if (filter === 'curve') list = list.filter((t) => t.status === 'curve')
    if (filter === 'listed') list = list.filter((t) => t.status === 'listed')

    switch (sort) {
      case 'marketcap':
        list.sort((a, b) => b.price - a.price)
        break
      case 'raised':
        list.sort((a, b) => b.progress - a.progress)
        break
      case 'oldest':
        list.reverse()
        break
      default:
        break
    }
    return list
  }, [sort, filter])

  return (
    <div className="markets-page">
      <div className="markets-hero">
        <div>
          <div className="markets-label">Tokenized equities — live on the curve</div>
          <h1 className="markets-title">markets</h1>
        </div>
        <div className="markets-stats">
          <div>
            <div className="stat-value">{tokens.length}</div>
            <div className="stat-label">Markets</div>
          </div>
          <div>
            <div className="stat-value accent">{listedCount}</div>
            <div className="stat-label">Listed</div>
          </div>
        </div>
      </div>

      <div className="markets-controls">
        <div className="sort-group">
          <span className="sort-label">Sort</span>
          {(['newest', 'marketcap', 'raised', 'oldest'] as SortKey[]).map((key) => (
            <button
              key={key}
              className={`sort-btn ${sort === key ? 'active' : ''}`}
              onClick={() => setSort(key)}
            >
              {key === 'marketcap' ? 'Market cap' : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="filter-group">
          {(['all', 'curve', 'listed'] as FilterKey[]).map((key) => (
            <button
              key={key}
              className={`filter-btn ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {key === 'all' ? 'All' : key === 'curve' ? 'On curve' : 'Listed'}
            </button>
          ))}
        </div>
      </div>

      <div className="markets-table">
        <div className="table-header">
          <span>#</span>
          <span>Token</span>
          <span>Ticker</span>
          <span>Price</span>
          <span>Status</span>
          <span>Progress</span>
          <span style={{ textAlign: 'right' }}>Age</span>
        </div>

        {filtered.map((token, i) => (
          <div
            key={token.address}
            className="table-row"
            onClick={() => navigate(`/t/${token.address}`)}
          >
            <span className="row-index">{String(i + 1).padStart(2, '0')}</span>
            <div className="token-cell">
              <TokenLogo token={token} />
              <div>
                <div className="token-name">{token.name}</div>
                <div className="token-sub">{token.subtitle}</div>
              </div>
            </div>
            <span className="cell-ticker">{token.ticker}</span>
            <span className="cell-price">{formatPrice(token.price)}</span>
            <span>
              <span className={`status-badge ${token.status === 'listed' ? 'listed' : ''}`}>
                {token.status === 'listed' ? 'Listed' : 'Curve'}
              </span>
            </span>
            <div className="progress-cell">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${token.progress}%` }} />
              </div>
              <span className="progress-text">{token.progress}%</span>
            </div>
            <span className="cell-age">{token.age}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
