import { useState, useEffect } from 'react'; 
import { 
    Calendar, 
    LogOut, 
    UserCircle, 
    UsersRound, 
    Menu, 
    X, 
    ChevronRight,
    Sparkles, // Adicionado para o logo "Espaço Vida"
    HelpCircle, // Adicionado para o botão de Ajuda
    Sun,        // Adicionado para o seletor de tema
    Moon        // Adicionado para o seletor de tema
} from 'lucide-react';

// Restaurando os imports que você usa
import { useLogoutUser } from '../hooks/userHooks/logoutUser.Hook';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    currentView: 'eventos' | 'usuarios' | 'perfil';
    onViewChange: (view: 'eventos' | 'usuarios' | 'perfil') => void;
    userName: string; // Adicionado para completar a interface da Sidebar
    userEmail: string; // Adicionado para completar a interface da Sidebar
}

export default function Sidebar({ currentView, onViewChange, userName, userEmail }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // Este é o estado que controla o tema
    const [theme, setTheme] = useState('light'); 
    
    // Esta é a função que aplica o tema ao HTML
    useEffect(() => {
        const root = window.document.documentElement; 
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const { logoutUser } = useLogoutUser();
    const navigate = useNavigate();

    const mainMenuItems = [
        { id: 'eventos', label: 'Eventos', icon: Calendar },
        { id: 'usuarios', label: 'Usuários', icon: UsersRound },
    ];

    // REMOVIDO o item 'perfil'. Acesso será via Header.
    const bottomMenuItems = [
        { id: 'ajuda', label: 'Ajuda', icon: HelpCircle },
    ];

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("isAuthenticated");
            navigate('/login');
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
        }
    };

    const NavButton = ({ item, isActive }: { item: { id: string, label: string, icon: any }, isActive: boolean }) => {
        const Icon = item.icon;
        return (
            <button
                key={item.id}
                onClick={() => {
                    if (item.id === 'ajuda') {
                        console.log("Clicou em Ajuda");
                    } else {
                        onViewChange(item.id as 'eventos' | 'usuarios' | 'perfil');
                    }
                    setIsMobileOpen(false);
                }}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group relative
                    ${isActive
                        ? 'bg-blue-600 text-white shadow-lg' // Estilo ATIVO (azul)
                        : 'text-gray-600 dark:text-dark-text-secondary hover:bg-blue-50 dark:hover:bg-dark-border' // Estilo INATIVO
                    }
                `}
            >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-dark-text-secondary group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                {isOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                )}
                {/* Tooltip para quando estiver fechado */}
                {!isOpen && (
                    <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {item.label}
                    </span>
                )}
            </button>
        );
    };

    return (
        <>
            {/* Botão Mobile (Hambúrguer) */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-dark-surface rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-all"
            >
                {isMobileOpen ? <X className="w-6 h-6 text-gray-800 dark:text-dark-text-primary" /> : <Menu className="w-6 h-6 text-gray-800 dark:text-dark-text-primary" />}
            </button>

            {/* Overlay Mobile */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen 
                    bg-white dark:bg-dark-surface 
                    border-r border-gray-200 dark:border-dark-border
                    transition-all duration-300 z-40 flex flex-col
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* 1. Header da Sidebar (Logo + Botão de Fechar) */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-dark-border h-20">
                    <div className={`flex items-center gap-3 overflow-hidden transition-all ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        <div className="p-2 bg-blue-100 rounded-lg">
                           <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-gray-800 dark:text-dark-text-primary font-bold text-xl truncate">Espaçovida</h2>
                    </div>
                    
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all"
                    >
                        <ChevronRight
                            className={`w-5 h-5 text-gray-500 dark:text-dark-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* 2. Conteúdo da Sidebar (Menus + Footer) */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                    
                    {/* 2a. Itens de Navegação Principais */}
                    <nav className="flex-1 p-4 space-y-2">
                        {mainMenuItems.map((item) => (
                            <NavButton 
                                key={item.id}
                                item={item} 
                                isActive={currentView === item.id} 
                            />
                        ))}
                    </nav>

                    {/* 2b. Itens Inferiores (Ajuda, Logout, Tema) */}
                    <div className="p-4 space-y-2 border-t border-gray-200 dark:border-dark-border">
                        {bottomMenuItems.map((item) => (
                             <NavButton 
                                 key={item.id}
                                 item={item} 
                                 isActive={currentView === item.id && item.id === 'perfil'} 
                             />
                        ))}

                        {/* Botão de Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group relative"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {isOpen && (
                                <span className="font-medium truncate">Logout</span>
                            )}
                            {/* Tooltip */}
                            {!isOpen && (
                                <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    Logout
                                </span>
                            )}
                        </button>
                        
                        {/* Wrapper para alinhamento do seletor de tema */}
                        <div className={`
                            w-full flex
                            ${isOpen ? 'justify-start' : 'justify-center'}
                        `}>
                            {/* Seletor de Tema (Estilo Toggle da Imagem) */}
                            {isOpen ? (
                                // SE A SIDEBAR ESTIVER ABERTA: Mostra o container pill-shaped com os dois botões
                                <div className={`
                                    bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full p-1.5 
                                    inline-flex items-center gap-1 transition-all
                                `}>
                                    {/* Botão Sol (Light) */}
                                    <button 
                                        onClick={() => setTheme('light')}
                                        className={`p-2 rounded-full transition-all ${ 
                                            theme === 'light' 
                                            ? 'bg-blue-600 text-white shadow'  
                                            : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border' 
                                        }`}
                                        aria-label="Mudar para tema claro"
                                    >
                                        <Sun className="w-5 h-5" />
                                    </button>
                                    
                                    {/* Botão Lua (Dark) */}
                                    <button 
                                        onClick={() => setTheme('dark')}
                                        className={`p-2 rounded-full transition-all ${ 
                                            theme === 'dark' 
                                            ? 'bg-blue-600 text-white shadow' 
                                            : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border'
                                        }`}
                                        aria-label="Mudar para tema escuro"
                                    >
                                        <Moon className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                // SE A SIDEBAR ESTIVER FECHADA: Mostra apenas o ícone ATIVO
                                <div 
                                    className="p-2 rounded-full bg-blue-600 text-white shadow" 
                                    aria-label={`Tema atual: ${theme === 'light' ? 'claro' : 'escuro'}`}
                                >
                                    {theme === 'light' ? (
                                        <Sun className="w-5 h-5" />
                                    ) : (
                                        <Moon className="w-5 h-5" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}