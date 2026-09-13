const colors = {
    blue:   'bg-blue-900/50 text-blue-300 border-blue-800',
    teal:   'bg-teal-900/50 text-teal-300 border-teal-800',
    green:  'bg-green-900/50 text-green-300 border-green-800',
    purple: 'bg-purple-900/50 text-purple-300 border-purple-800',
    amber:  'bg-amber-900/50 text-amber-300 border-amber-800',
    rose:   'bg-rose-900/50 text-rose-300 border-rose-800',
    red:    'bg-red-900/50 text-red-300 border-red-800',
    gray:   'bg-gray-800 text-gray-300 border-gray-700',

}

export default function Badge({label, color = 'gray'}) {
    return (
        <span className={`inline-block text-xs px-2 py-0.5 rounded border ${colors[color] || colors.gray}`}>
            {label}
        </span>
    )
}