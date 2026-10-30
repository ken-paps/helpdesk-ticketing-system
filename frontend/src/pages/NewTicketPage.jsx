import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTicket } from '../hooks/useTickets'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { ArrowLeft } from 'lucide-react'

export function NewTicketPage() {
  const navigate = useNavigate()
  const createTicket = useCreateTicket()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await createTicket.mutateAsync(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Tickets
      </button>

      <div className="bg-white dark:bg-[#111111] p-8 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
        <h1 className="text-2xl font-bold mb-6">Submit a New Ticket</h1>

        {error && <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Subject" placeholder="Brief summary of the issue" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />

          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select className="block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border bg-transparent border-gray-300 dark:border-[#333] focus:border-brand focus:ring-brand focus:outline-none focus:ring-1 dark:text-white dark:bg-[#111111]" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="w-full mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border bg-transparent border-gray-300 dark:border-[#333] focus:border-brand focus:ring-brand focus:outline-none focus:ring-1 dark:text-white" rows={5} placeholder="Please provide as much detail as possible..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={createTicket.isPending}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
