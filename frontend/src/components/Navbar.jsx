import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ThemeToggle } from './ThemeToggle'
import { LogOut, Ticket } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Ticket className="text-brand" size={24} />
          HelpDesk
        </Link>

        <div className="flex items-center gap-6">
          {user?.role === 'ADMIN' && (
            <Link to="/users" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
              Manage Users
            </Link>
          )}

          <div className="flex items-center gap-4 border-l border-gray-200 dark:border-[#1f1f1f] pl-6">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {user?.name} <span className="text-xs bg-gray-100 dark:bg-[#1f1f1f] px-2 py-1 rounded ml-1">{user?.role}</span>
            </span>

            <ThemeToggle />

            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
