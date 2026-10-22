export default function Spinner() {
  return (
    <div className="flex justify-center py-20" role="status" aria-label="Loading photos">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
    </div>
  )
}
