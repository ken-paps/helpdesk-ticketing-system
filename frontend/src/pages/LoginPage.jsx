import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { ThemeToggle } from '../components/ThemeToggle'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1f1f1f] rounded-xl shadow-sm relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in to HelpDesk</h2>

        {error && <div className="mb-4 text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@helpdesk.dev" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
