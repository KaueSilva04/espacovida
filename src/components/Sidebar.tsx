import { useState } from 'react';
import { Calendar, Users, UserCircle, UsersRound, Menu, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
    currentView: 'eventos' | 'participantes' | 'usuarios' | 'perfil';
    onViewChange: (view: 'eventos' | 'participantes' | 'usuarios' | 'perfil') => void;
    userName?: string;
    userEmail?: string;
}

export default function Sidebar({ currentView, onViewChange, userName = "Usuário", userEmail = "usuario@email.com" }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { id: 'perfil', label: 'Perfil', icon: UserCircle },
        { id: 'eventos', label: 'Eventos', icon: Calendar },
        { id: 'participantes', label: 'Participantes', icon: Users },
        { id: 'usuarios', label: 'Usuários', icon: UsersRound },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all"
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-green-600 to-green-800 
                    transition-all duration-300 z-40 flex flex-col shadow-2xl
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-green-500">
                    {isOpen && (
                        <h2 className="text-white font-bold text-xl">Sistema</h2>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden lg:block p-2 hover:bg-green-700 rounded-lg transition-all"
                    >
                        <ChevronRight
                            className={`w-5 h-5 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-green-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-6 h-6 text-green-600" />
                        </div>
                        {isOpen && (
                            <div className="overflow-hidden">
                                <p className="text-white font-semibold text-sm truncate">{userName}</p>
                                <p className="text-green-200 text-xs truncate">{userEmail}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onViewChange(item.id as 'eventos' | 'participantes' | 'usuarios' | 'perfil');
                                    setIsMobileOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-white text-green-600 shadow-lg'
                                        : 'text-white hover:bg-green-700'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-white'}`} />
                                {isOpen && (
                                    <span className="font-medium truncate">{item.label}</span>
                                )}
                                {!isOpen && (
                                    <span className="absolute left-20 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-green-500">
                    {isOpen && (
                        <p className="text-green-200 text-xs text-center">
                            © 2025 Sistema de Eventos
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
}
