export default function PageHeader({title, subtitle, count}) {
    return (
        <div className="border-b border-gray-800 px-6 py-4 shrink-0">
            <div className="flex items-basline gap-3">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {count !== undefined && (
                    <span className="text-sm text-gray-500">{count.toLocaleString()} items</span>
                )}
            </div>
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
    )
}