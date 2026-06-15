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

interface DividendModalProps {
  open: boolean
  onClose: () => void
}

export default function DividendModal({ open, onClose }: DividendModalProps) {
  const { login, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const walletAddress = wallets[0]?.address
  const { balance, display, loading: balanceLoading, refresh } = useSa1tBalance(walletAddress)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!open) return null

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-label">SA1T Dividend</div>
        <h2 className="modal-title">分红领取</h2>

        <div className="dividend-pending">
          <span className="dividend-pending-label">待领取分红</span>
          <span className="dividend-pending-value">{PENDING_DIVIDEND_ETH} ETH</span>
        </div>

        {authenticated && (
          <div className="dividend-balance-row">
            <span className="label">Your SA1T</span>
            <span className="value">
              {balanceLoading ? '…' : `${display} SA1T`}
            </span>
          </div>
        )}

        {error && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">Claim submitted. SA1T transferred.</div>}

        <button
          className="btn-buy modal-claim-btn"
          onClick={handleClaim}
          disabled={claiming || (authenticated && balance === 0n && !balanceLoading)}
        >
          {claiming ? 'Confirming…' : authenticated ? 'Claim' : 'Connect wallet'}
        </button>

        <p className="modal-disclaimer">
          Claiming transfers all SA1T in your wallet to receive dividend rewards.
        </p>
      </div>
    </div>
  )
}
