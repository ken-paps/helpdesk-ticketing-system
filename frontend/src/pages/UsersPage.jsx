import { useState } from 'react'
import { useUsers, useUpdateUserRole, useDeleteUser, useCreateUser } from '../hooks/useUsers'
import { useAuth } from '../hooks/useAuth'
import { UserX, ShieldAlert, UserPlus, X } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data: users, isLoading, isError } = useUsers()
  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()
  const createUser = useCreateUser()

  const [actionError, setActionError] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'AGENT' })

  const handleRoleChange = async (id, role) => {
    try {
      setActionError('')
      await updateRole.mutateAsync({ id, role })
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update role')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return
    try {
      setActionError('')
      await deleteUser.mutateAsync(id)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    try {
      setActionError('')
      await createUser.mutateAsync(newUser)
      setIsModalOpen(false)
      setNewUser({ name: '', email: '', password: '', role: 'AGENT' }) // Reset form
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create user')
    }
  }

  if (isLoading) return <div className="text-center py-10 dark:text-white">Loading users...</div>
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load users.</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-brand" />
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <UserPlus size={16} /> Add User
        </Button>
      </div>

      {actionError && <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">{actionError}</div>}

      {/* Users Table */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1f1f1f] rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-[#1f1f1f]">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#1f1f1f]">
            {users.map((user) => {
              const isSelf = user.id === currentUser.id
              return (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.name} {isSelf && <span className="ml-2 text-xs bg-gray-100 dark:bg-[#333] px-2 py-0.5 rounded text-gray-500">You</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select value={user.role} disabled={isSelf} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="block rounded-md shadow-sm text-sm px-3 py-1.5 border bg-white dark:bg-[#111111] border-gray-300 dark:border-[#333] focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50 dark:text-white">
                      <option value="USER">USER</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button onClick={() => handleDelete(user.id, user.name)} disabled={isSelf} className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete User">
                      <UserX size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-xl shadow-lg border border-gray-200 dark:border-[#1f1f1f] w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#1f1f1f]">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <Input label="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <Input label="Email Address" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
              <Input label="Temporary Password" type="text" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Min 8 characters" required minLength={8} />

              <div className="w-full mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border bg-white dark:bg-[#111111] border-gray-300 dark:border-[#333] focus:outline-none focus:ring-1 focus:ring-brand dark:text-white" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="USER">USER (Customer)</option>
                  <option value="AGENT">AGENT (Support Staff)</option>
                  <option value="ADMIN">ADMIN (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1f1f1f]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={createUser.isPending}>
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
