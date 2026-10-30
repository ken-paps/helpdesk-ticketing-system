import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTicket, useAddComment, useUpdateTicket, useAgents } from '../hooks/useTickets'
import { StatusBadge, PriorityBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../hooks/useAuth'

export function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ticket, isLoading, isError } = useTicket(id)
  const addComment = useAddComment(id)
  const [commentText, setCommentText] = useState('')
  const { user } = useAuth()
  const updateTicket = useUpdateTicket(id)
  const { data: agents } = useAgents()
  const isStaff = user?.role === 'AGENT' || user?.role === 'ADMIN'

  if (isLoading) return <div className="text-center py-10 dark:text-white">Loading ticket...</div>
  if (isError || !ticket) return <div className="text-center py-10 text-red-500">Ticket not found.</div>

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      await addComment.mutateAsync(commentText)
      setCommentText('')
    } catch (error) {
      alert('Failed to add comment')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white">
        <ArrowLeft size={16} className="mr-1" /> Back to Tickets
      </button>

      {/* Ticket Header */}
      <div className="bg-white dark:bg-[#111111] p-8 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <div className="flex gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-[#1f1f1f]">
          <p>
            Opened by <span className="font-medium text-gray-900 dark:text-gray-200">{ticket.creator.name}</span> on {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
          </p>
          {ticket.assignee && (
            <p>
              Assigned to <span className="font-medium text-gray-900 dark:text-gray-200">{ticket.assignee.name}</span>
            </p>
          )}
        </div>

        {/* Staff Controls Panel */}
        {isStaff && (
          <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <select value={ticket.status} onChange={(e) => updateTicket.mutate({ status: e.target.value })} className="block rounded-md shadow-sm sm:text-sm px-3 py-1.5 border bg-white dark:bg-[#111111] border-gray-300 dark:border-[#333] focus:outline-none focus:ring-1 focus:ring-brand dark:text-white">
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignee:</label>
              <select
                value={ticket.assigneeId || ''}
                onChange={(e) => {
                  const val = e.target.value
                  updateTicket.mutate({ assigneeId: val ? Number(val) : null })
                }}
                className="block rounded-md shadow-sm sm:text-sm px-3 py-1.5 border bg-white dark:bg-[#111111] border-gray-300 dark:border-[#333] focus:outline-none focus:ring-1 focus:ring-brand dark:text-white"
              >
                <option value="">Unassigned</option>
                {agents?.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-[#111111] p-8 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
        <h3 className="text-lg font-bold mb-6">Comments ({ticket.comments?.length || 0})</h3>

        <div className="space-y-6 mb-8">
          {ticket.comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1f1f1f] flex items-center justify-center text-gray-500">
                  <UserIcon size={20} />
                </div>
              </div>
              <div className="grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                  {comment.author.role !== 'USER' && <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded font-semibold uppercase tracking-wider">{comment.author.role}</span>}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
          {(!ticket.comments || ticket.comments.length === 0) && <p className="text-sm text-gray-500 italic">No comments yet.</p>}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="flex gap-4 items-end">
          <div className="grow">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={2} placeholder="Write a reply..." className="block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border bg-transparent border-gray-300 dark:border-[#333] focus:border-brand focus:ring-brand focus:outline-none focus:ring-1 dark:text-white" required />
          </div>
          <Button type="submit" isLoading={addComment.isPending} className="mb-0.5">
            <Send size={16} className="mr-2" /> Reply
          </Button>
        </form>
      </div>
    </div>
  )
}
