import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/System/Sidebar';
import HeaderContainer from '../../components/layout/System/Header';
import UsuariosPage from './UserPage';

import EventSystemPage from './Event';
import Dashboard from './Dashboard';

export default function EventManagementSystem() {    // --- Estados de Navegação ---
    const [currentView, setCurrentView] = useState<'eventos' | 'usuarios' | 'perfil' | 'dashboard'>('dashboard');
    const [showProfileModal, setShowProfileModal] = useState(false);

    const getHeaderContent = () => {
        switch (currentView) {
            case 'eventos':
                return {
                    title: "Eventos",
                    subtitle: "Estes são seus insights mais recentes",
                };
            case 'usuarios':
                return {
                    title: "Usuários", // <-- TÍTULO MUDADO AQUI
                    subtitle: "Visualize e gerencie as contas de acesso ao sistema",
                };
            case 'perfil':
                return {
                    title: "Meu Perfil",
                    subtitle: "Ajuste suas informações de conta",
                };
            case 'dashboard':
                return {
                    title: "Home",
                    subtitle: "Visão geral do sistema",
                };
        }
    };

    // --- Handlers de Navegação ---
    const handleViewChange = (view: 'eventos' | 'usuarios' | 'perfil' | 'dashboard') => {
        // Se clicar em 'perfil' na Sidebar, abra o modal
        if (view === 'perfil') {
            setShowProfileModal(true);
            // Mantenha a view principal como 'eventos' ou 'usuarios' se você quiser que o conteúdo da página permaneça
        } else {
            setCurrentView(view);
            setShowProfileModal(false); // Garante que o modal feche se mudar para outra view principal
        }
    };

    // Handler específico para o HeaderContainer
    const handleOpenProfileModal = () => {
        setShowProfileModal(true);
    };


    const headerContent = getHeaderContent(); // Chame a função para obter o conteúdo


    return (
        <div className="flex min-h-screen bg-gradient-to-br dark:bg-gray-800">
            {/* Sidebar */}
            <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <HeaderContainer
                    pageTitle={headerContent.title}
                    pageSubtitle={headerContent.subtitle}
                    onProfileClick={handleOpenProfileModal} // Passando o handler para o Header
                />
                {/* TELA DE EVENTOS */}
                {currentView === 'eventos' && <EventSystemPage></EventSystemPage>}
                {currentView === 'usuarios' && <UsuariosPage />}
                {currentView === 'dashboard' && <Dashboard />}
            </div>
        </div>
    );
}