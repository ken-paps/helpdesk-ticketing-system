import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await api.get('/tickets')
      return data.tickets
    },
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTicket) => {
      const { data } = await api.post('/tickets', newTicket)
      return data.ticket
    },
    onSuccess: () => {
      // Refresh the ticket list automatically
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${id}`)
      return data.ticket
    },
    enabled: !!id,
  })
}

export function useAddComment(ticketId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content) => {
      const { data } = await api.post(`/tickets/${ticketId}/comments`, { content })
      return data.comment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
    },
  })
}

export function useUpdateTicket(ticketId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(`/tickets/${ticketId}`, updates)
      return data.ticket
    },
    onSuccess: () => {
      // Refresh both the single ticket view and the main dashboard list
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data } = await api.get('/users/agents')
      return data.agents
    },
  })
}
