import { useMemo, useState } from 'react'

interface PriceChartProps {
  price: number
  activeTf: string
}

function PriceChart({ price, activeTf }: PriceChartProps) {
  const points = useMemo(() => {
    const data: number[] = []
    let p = price * 0.92
    for (let i = 0; i < 80; i++) {
      p += (Math.random() - 0.48) * price * 0.02
      p = Math.max(price * 0.85, Math.min(price * 1.08, p))
      data.push(p)
    }
    data[data.length - 1] = price
    return data
  }, [price, activeTf])

  const min = Math.min(...points) * 0.999
  const max = Math.max(...points) * 1.001
  const w = 800
  const h = 360

  const toX = (i: number) => (i / (points.length - 1)) * w
  const toY = (v: number) => h - ((v - min) / (max - min)) * h

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p)}`).join(' ')
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`

  const yLabels = [max, (max + min) / 2, min]

  return (
    <div className="chart-area">
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={0}
            y1={h * f}
            x2={w}
            y2={h * f}
            stroke="#1a1a1a"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="rgba(0, 255, 200, 0.06)" />
        <path d={linePath} fill="none" stroke="#00ffc8" strokeWidth="1.5" />
        {yLabels.map((v, i) => (
          <text
            key={i}
            x={w - 4}
            y={toY(v) - 4}
            fill="#444"
            fontSize="10"
            fontFamily="IBM Plex Mono, monospace"
            textAnchor="end"
          >
            ${v.toExponential(2)}
          </text>
        ))}
      </svg>
      <div className="chart-tv-logo">TV</div>
    </div>
  )
}

export function ChartSection({ ticker, price }: { ticker: string; price: number }) {
  const [activeTf, setActiveTf] = useState('5m')
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']

  return (
    <div className="chart-section">
      <div className="chart-header">
        <span className="chart-title">{ticker} · USD price</span>
        <div className="chart-timeframes">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`tf-btn ${activeTf === tf ? 'active' : ''}`}
              onClick={() => setActiveTf(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <PriceChart price={price} activeTf={activeTf} />
    </div>
  )
}
