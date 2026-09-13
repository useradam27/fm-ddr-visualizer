export default function EmptyState({message = 'No data to display'}) {
    return (
        <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
            {message}
        </div>
    )
}