import { Loader2 } from 'lucide-react'

export function Button({ children, isLoading, className = '', ...props }) {
  return (
    <button disabled={isLoading} className={`inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
