export function Input({ label, error, ...props }) {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border bg-transparent ${error ? 'border-red-500' : 'border-gray-300 dark:border-[#333] focus:border-brand focus:ring-brand'} focus:outline-none focus:ring-1 dark:text-white`} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
