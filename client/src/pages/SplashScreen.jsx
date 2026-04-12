import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('enter') // enter -> hold -> exit

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('hold'), 100)
    const timer2 = setTimeout(() => setPhase('exit'), 2200)
    const timer3 = setTimeout(() => navigate('/home', { replace: true }), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [navigate])

  return (
    <div className={`splash-screen ${phase}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <div className="splash-icon-wrapper">
            <FileText className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="splash-title">
          Resume<span className="gradient-text">AI</span>
        </h1>
        <p className="splash-subtitle">AI-Powered Resume Builder</p>
        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="splash-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="splash-particle" style={{ '--delay': `${i * 0.3}s`, '--x': `${15 + i * 14}%` }} />
        ))}
      </div>
    </div>
  )
}