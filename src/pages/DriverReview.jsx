import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api, getToken } from '../api'
import { getFile, clearFiles } from '../fileStore'

const BLUE = '#0066FF'

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
    <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</span>
  </div>
)

const DocRow = ({ label, filename }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{filename}</p>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4FDB5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </div>
)

export default function DriverReview() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [submitting, setSubmitting] = useState(false)

  const { plateNumber, vehicleType, licenseFileName, idCardFileName } = state ?? {}
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('vehicleType', vehicleType)
      fd.append('plateNumber', plateNumber)
      const licenseFile = getFile('driversLicense')
      const idCardFile  = getFile('idCard')
      if (licenseFile) fd.append('driversLicense', licenseFile)
      if (idCardFile)  fd.append('idCard', idCardFile)
      await api.driverOnboard(fd, getToken())
      clearFiles()
      navigate('/driver-submitted', { state })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'white', padding: '56px 24px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Review & Submit</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Confirm your details before submitting</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 24px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Vehicle Details card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Vehicle Details</p>
            <button onClick={() => navigate('/driver-info', { state })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: BLUE, fontWeight: 600 }}>Edit</button>
          </div>
          <Row label="Plate Number" value={plateNumber || '—'} />
          <Row label="Vehicle Type" value={vehicleType || '—'} />
        </div>

        {/* Documents card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Documents</p>
            <button onClick={() => navigate('/driver-documents', { state })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: BLUE, fontWeight: 600 }}>Edit</button>
          </div>
          <DocRow label="Driver's License" filename={licenseFileName || '—'} />
          <DocRow label="OAU Staff / School ID" filename={idCardFileName || '—'} />
        </div>

        {/* Note */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
            Your application will be reviewed by OAU. You'll be notified once it's approved.
          </p>
        </div>
      </div>

      {/* Submit button — fixed bottom */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', padding: '16px 24px 32px', borderTop: '1px solid #f3f4f6' }}>
        {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: '0 0 12px' }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ width: '100%', height: 56, borderRadius: 999, background: submitting ? '#93c5fd' : BLUE, color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: submitting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0110 10"/>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  )
}
