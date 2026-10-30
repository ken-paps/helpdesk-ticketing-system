import { Link } from 'react-router-dom'
import { TicketList } from '../components/TicketList'
import { Button } from '../components/Button'
import { Plus } from 'lucide-react'

export function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
        <Link to="/tickets/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} /> New Ticket
          </Button>
        </Link>
      </div>
      <TicketList />
    </div>
  )
}
