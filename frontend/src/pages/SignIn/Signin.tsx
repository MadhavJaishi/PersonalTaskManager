import React, { useState } from 'react'
import { setUser } from '../../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useAuth } from '../../auth'
import { api } from '../../api-config/api'
const backendURL = import.meta.env.VITE_BACKEND_URL

const SignIn = () => {
  const { isLoggedIn, login, logout } = useAuth()
  const [step, setStep] = useState('request')
  const [formData, setFormData] = useState({
    email: '',
    otptoken: '',
  })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post(`${backendURL}/auth/send-otp`, {
        email: formData.email,
      })
      if (response.status === 200) {
        setStep('verify')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message
      alert(msg)
      setError('Authentication failed')
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post(
        `${backendURL}/auth/verify-otp`,
        { email: formData.email, otptoken: formData.otptoken },
        { withCredentials: true },
      )
      const response = await api.get(`${backendURL}/auth/me`, {
        withCredentials: true,
      })
      // Store user data to redux
      dispatch(setUser(response.data.user))
      login()
      navigate('/dashboard')
    } catch (err) {
      setError('Authentication failed')
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
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold">
              T
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">Welcome Back</h1>

            <p className="mt-2 text-slate-400">
              Sign in securely using email verification
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === 'request'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              1
            </div>

            <div className="w-12 h-px bg-slate-700" />

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === 'verify'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400'
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
              <label className="block text-sm text-slate-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={step === 'verify'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {step === 'verify' && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Verification Code
                </label>

                <input
                  type="text"
                  maxLength={6}
                  value={formData.otptoken}
                  onChange={(e) => handleChange('otptoken', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all"
            >
              {step === 'request'
                ? 'Send Verification Code'
                : 'Verify & Continue'}
            </button>

            {step === 'verify' && (
              <button
                type="button"
                onClick={requestOtp}
                className="w-full text-slate-400 hover:text-white text-sm"
              >
                Resend Code
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}

export default SignIn
