import { NavLink } from 'react-router-dom'
import { useDDRStore } from '../../store/useDDRStore'

const navItems = [
    { to: '/',                label: 'Overview',         icon: '⬡' },
    { to: '/tables',          label: 'Tables',           icon: '▦' },
    { to: '/scripts',         label: 'Scripts',          icon: '▶' },
    { to: '/layouts',         label: 'Layouts',          icon: '▭' },
    { to: '/relationships',   label: 'Relationships',    icon: '⟷' },
    { to: '/valuelists',      label: 'Value Lists',      icon: '≡' },
    { to: '/customfunctions', label: 'Custom Functions', icon: 'ƒ' },
    { to: '/security',        label: 'Security',         icon: '⚿' },
    { to: '/issues',          label: 'Issues',           icon: '⚠' },

]

export default function AppLayout({ children }) {
    const {data, fileName, reset} = useDDRStore()
    const isSaveAsXml = data?.meta?.format === 'saveAsXml'

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 font-mono overflow-hidden">
            <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Solution</p>
                    <p className="text-sm text-white font-semibold truncate" title={data?.meta?.fileName || fileName}>
                        {data?.meta?.fileName || fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-gray-500">FM {data?.meta?.fmVersion}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isSaveAsXml ? 'bg-purple-900/40 text-purple-300' : 'bg-blue-900/40 text-blue-300'}`}>
                            {isSaveAsXml ? 'Save As XML' : 'DDR'}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 py-2 overflow-y-auto">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({isActive}) => 
                                `flex items-center gap-3 px-4 text-sm transition-colors ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                            }
                        >
                            <span className="text-base w-4 text-center">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-gray-800">
                    <button onClick={ reset } className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors text-left">
                        ← Load different file
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    )
}