import { useNavigate } from 'react-router-dom'

export default function CheckEmail() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', padding: '56px 32px 40px', alignItems: 'center' }}>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Icon */}
        <div style={{ width: 96, height: 96, borderRadius: 24, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#1A6BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: '#60a5fa', border: '2px solid white' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: 12 }}>Check your email</h1>
        <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
          We have sent a password recovery key to your email
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => navigate('/create-password')} style={{ width: '100%', height: 56, borderRadius: 999, background: '#1A6BFF', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
          Open email app
        </button>
        <button onClick={() => navigate('/login')} style={{ width: '100%', height: 56, borderRadius: 999, background: 'transparent', color: '#4b5563', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
          Skip, I'll confirm later
        </button>
      </div>

      <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
        Didn't receive the email? Check your spam folder, or{' '}
        <span onClick={() => navigate('/login')} style={{ color: '#1A6BFF', cursor: 'pointer' }}>try using your phone number</span>
      </p>
    </div>
  )
}
