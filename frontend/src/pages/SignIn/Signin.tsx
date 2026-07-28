import React, { useState } from 'react'
import { setUser } from '../../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useAuth } from '../../auth'
import { api } from '../../api-config/api'

const SignIn = () => {
  const { isLoggedIn, login } = useAuth()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [formData, setFormData] = useState({
    email: '',
    otptoken: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.email.trim()) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/send-otp', {
        email: formData.email.trim(),
      })
      if (response.data?.ok || response.status === 200) {
        setStep('verify')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Authentication failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.otptoken || !formData.otptoken.trim()) {
      setError('Please enter the verification code sent to your email.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/verify-otp', {
        email: formData.email.trim(),
        otptoken: formData.otptoken.trim(),
      })

      const response = await api.get('/auth/me')
      const userObj = response.data?.user || { email: formData.email, username: formData.email.split('@')[0] }

      localStorage.setItem('user', JSON.stringify(userObj))
      dispatch(setUser(userObj))
      login()
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Invalid verification code'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/30">
              C
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">ClearTrack</h1>

            <p className="mt-2 text-slate-400 text-sm">
              Sign in securely using email verification code
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'request'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </div>

            <div className="w-12 h-px bg-slate-700" />

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'verify'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              2
            </div>
          </div>

          <form
            onSubmit={(e) => {
              step === 'request' ? requestOtp(e) : verifyOtp(e)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={step === 'verify'}
                placeholder="name@example.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {step === 'verify' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Verification Code
                </label>

                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.otptoken}
                  onChange={(e) => handleChange('otptoken', e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-3 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Processing...'
                : step === 'request'
                ? 'Send Verification Code'
                : 'Verify & Continue'}
            </button>

            {step === 'verify' && (
              <button
                type="button"
                onClick={() => setStep('request')}
                className="w-full text-slate-400 hover:text-white text-xs text-center py-1 transition cursor-pointer"
              >
                Change Email / Resend Code
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}

export default SignIn
