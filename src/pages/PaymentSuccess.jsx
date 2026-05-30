import { useNavigate, useLocation } from 'react-router-dom'
import avatarYusuf from '../assets/images/figma-avatar-yusuf.png'

const BLUE = '#0066FF'

const CONFETTI_PIECES = [
  { left: '8%',  top: '8%',  color: '#FF4B4B', w: 10, h: 18, rotate: -30 },
  { left: '20%', top: '5%',  color: '#FFD600', w: 8,  h: 8,  rotate: 45  },
  { left: '35%', top: '3%',  color: '#4B9BFF', w: 12, h: 6,  rotate: 20  },
  { left: '55%', top: '6%',  color: '#FF4B9B', w: 8,  h: 14, rotate: -45 },
  { left: '70%', top: '4%',  color: '#4BFF9B', w: 10, h: 6,  rotate: 60  },
  { left: '85%', top: '9%',  color: '#FF9B4B', w: 8,  h: 16, rotate: -20 },
  { left: '90%', top: '18%', color: '#4B9BFF', w: 10, h: 8,  rotate: 30  },
  { left: '5%',  top: '20%', color: '#9B4BFF', w: 8,  h: 12, rotate: 15  },
  { left: '15%', top: '32%', color: '#FFD600', w: 12, h: 6,  rotate: -60 },
  { left: '75%', top: '28%', color: '#FF4B4B', w: 8,  h: 14, rotate: 40  },
  { left: '92%', top: '35%', color: '#4BFF9B', w: 10, h: 8,  rotate: -15 },
  { left: '3%',  top: '42%', color: '#FF9B4B', w: 8,  h: 10, rotate: 55  },
  { left: '88%', top: '48%', color: '#9B4BFF', w: 10, h: 6,  rotate: -35 },
  { left: '12%', top: '55%', color: '#4B9BFF', w: 8,  h: 16, rotate: 25  },
  { left: '80%', top: '58%', color: '#FF4B4B', w: 12, h: 8,  rotate: -50 },
  { left: '25%', top: '14%', color: '#4BFF9B', w: 6,  h: 14, rotate: 70  },
  { left: '60%', top: '18%', color: '#FFD600', w: 10, h: 8,  rotate: -25 },
  { left: '45%', top: '22%', color: '#FF4B9B', w: 8,  h: 12, rotate: 45  },
]

const GreenBadge = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <path d="M40 4 L47 14 L59 10 L61 23 L73 27 L68 39 L76 49 L65 55 L65 68 L52 68 L44 77 L36 68 L23 68 L23 55 L12 49 L20 39 L15 27 L27 23 L29 10 L41 14 Z"
      fill="#22C55E"/>
    <path d="M27 40 L36 50 L54 30" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const isWithdrawal = state?.type === 'withdrawal'
  const isAddMoney  = state?.type === 'addMoney'
  const amount = state?.amount ?? '150'
  const driverName = state?.driverName ?? 'Yusuf'

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* CONFETTI */}
      {!isWithdrawal && !isAddMoney && CONFETTI_PIECES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.left, top: p.top,
          width: p.w, height: p.h,
          background: p.color,
          borderRadius: 2,
          transform: `rotate(${p.rotate}deg)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* BACK */}
      <div style={{ padding: '52px 20px 0', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 0', position: 'relative', zIndex: 1 }}>

        <GreenBadge />

        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 32 }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
            {isWithdrawal ? 'Withdrawal Successful 🎉' : isAddMoney ? 'Money Added! 🎉' : 'Money Sent! 🎉'}
          </p>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            {isWithdrawal
              ? 'Your funds are on the way to your bank account.'
              : isAddMoney
              ? 'Your wallet has been topped up successfully.'
              : 'Transaction complete'}
          </p>
        </div>

        {/* DETAIL CARD */}
        {isWithdrawal ? (
          <div style={{ width: '100%', background: '#F0F4FF', borderRadius: 16, padding: '20px' }}>
            {[
              { label: 'Amount', value: `₦${amount}` },
              { label: 'Time duration', value: '24h' },
              { label: 'Date', value: 'March 19th, 2026' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: 14, color: '#666' }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{value}</span>
              </div>
            ))}
          </div>
        ) : isAddMoney ? (
          <div style={{ width: '100%', background: '#F0FFF4', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#22C55E', margin: '0 0 8px' }}>₦{amount}</p>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Added to your wallet via Bank Transfer</p>
          </div>
        ) : (
          <div style={{ width: '100%', background: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <img src={avatarYusuf} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #BBF7D0' }} />
            <p style={{ fontSize: 15, color: '#333', margin: 0 }}>{driverName}'s Money Received! 👍</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: 0 }}>₦{amount}</p>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div style={{ padding: '24px 20px 40px', display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
        {!isWithdrawal && !isAddMoney && (
          <button
            onClick={() => navigate('/receipt', { state: { amount, driverName } })}
            style={{ flex: 1, height: 52, borderRadius: 999, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: BLUE }}
          >
            Share Receipt
          </button>
        )}
        <button
          onClick={() => navigate(isWithdrawal ? '/driver-dashboard' : '/dashboard')}
          style={{ flex: isWithdrawal || isAddMoney ? 1 : 'unset', width: isWithdrawal || isAddMoney ? undefined : 160, height: 52, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'white' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
