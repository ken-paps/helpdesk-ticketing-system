import { Link } from 'react-router-dom'
import { useTickets } from '../hooks/useTickets'
import { StatusBadge, PriorityBadge } from './Badge'
import { MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function TicketList() {
  const { data: tickets, isLoading, isError } = useTickets()

  if (isLoading) return <div className="text-center py-10 dark:text-white">Loading tickets...</div>
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load tickets.</div>
  if (!tickets || tickets.length === 0) {
    return <div className="text-center py-10 text-gray-500 border border-gray-200 dark:border-[#1f1f1f] rounded-xl">No tickets found.</div>
  }

  return (
    <div className="border border-gray-200 dark:border-[#1f1f1f] rounded-xl overflow-hidden bg-white dark:bg-[#111111]">
      <ul className="divide-y divide-gray-200 dark:divide-[#1f1f1f]">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
            <Link to={`/tickets/${ticket.id}`} className="block p-4 sm:px-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-brand truncate pr-4">{ticket.subject}</p>
                <div className="flex gap-2 shrink-0">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                  <span>
                    Created by <span className="font-medium text-gray-900 dark:text-gray-200">{ticket.creator.name}</span>
                  </span>
                  <span>Opened {formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{ticket._count?.comments || 0}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
