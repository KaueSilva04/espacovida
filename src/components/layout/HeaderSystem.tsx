import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { userProfile } from '../../interfaces/userInterfaces/userProfile.Interface';
import { useRenderProfile } from '../../hooks/userHooks/renderUserProfile.Hook';
import ProfileModal from '../ProfileModal';

interface VisualUserProfile {
  firstName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface HeaderProps {
  user: VisualUserProfile;
  pageTitle: string;
  pageSubtitle: string;
  notificationCount: number;
  // AJUSTE: Adicionando a função de clique para abrir o modal
  onProfileClick: () => void;
}

// AJUSTE: Header agora recebe onProfileClick
const Header: React.FC<HeaderProps> = ({ user, pageTitle, pageSubtitle, notificationCount, onProfileClick }) => {
  return (
    // AJUSTE DE POSICIONAMENTO: Reduzido sm:pt-6 para sm:pt-3 e mb-6 para mb-4
    <header className="flex items-center justify-between w-full p-4 sm:pt-3 sm:pb-3 mb-4">

      {/* Lado Esquerdo: Título da Página */}
      <div>
        {/* Aumentando levemente o título e aplicando dark mode */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-dark-text-primary leading-tight">
          {pageTitle}
        </h1>
        {/* Ajustando subtítulo e aplicando dark mode */}
        <p className="text-base text-gray-500 dark:text-dark-text-secondary mt-1 hidden md:block">
          {pageSubtitle}
        </p>
      </div>

      {/* Lado Direito: Ícones e Perfil */}
      {/* O espaço horizontal foi mantido para não quebrar o alinhamento */}
      <div className="flex items-center space-x-3 sm:space-x-5">

        {/* REMOVIDO: Botão de Pesquisa */}

        <button
          aria-label="Notificações"
          // ÍCONE E BOTÃO AINDA MAIOR: w-14 h-14 (56px)
          className="relative flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
        >
          <Bell size={28} /> {/* TAMANHO DO ÍCONE: 28 */}
          {notificationCount > 0 && (
            <span
              // Mantido o tamanho do badge
              className="absolute top-0 right-0 w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white dark:border-dark-surface rounded-full flex items-center justify-center"
              aria-label={`${notificationCount} novas notificações`}
            >
              {notificationCount}
            </span>
          )}
        </button>

        {/* Perfil - AJUSTE: Adicionando o onClick aqui */}
        <div
          className="flex items-center space-x-0 cursor-pointer pl-2"
          onClick={onProfileClick}
        >
          <img
            // IMAGEM MAIOR: w-14 h-14
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-dark-border"
            src={user.avatarUrl}
            alt={`Foto de perfil de ${user.fullName}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/56x56/EAEAEA/B0B0B0?text=${user.firstName.charAt(0)}`;
            }}
          />
          <div className="hidden md:block pl-3 pr-2 py-2">
            {/* NOME MAIOR: text-xl */}
            <div className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary leading-tight">
              {user.fullName}
            </div>
            {/* EMAIL MAIOR: text-base no mobile/tablet, text-lg no desktop */}
            <div className="text-base lg:text-lg text-gray-500 dark:text-dark-text-secondary leading-tight">
              {user.email}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

interface HeaderContainerProps {
  pageTitle: string;
  pageSubtitle: string;
  notificationCount: number;
  onProfileClick?: () => void;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ pageTitle, pageSubtitle, notificationCount }) => {

  // Supondo que useRenderProfile retorna os dados de userProfile
  const { renderUser, loading, error } = useRenderProfile();

  // AJUSTE: Estado de visibilidade do modal (você já tinha isso, ótimo!)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AJUSTE: Função para fechar o modal (você já tinha isso, ótimo!)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // AJUSTE: Função para abrir o modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const [userData, setUserData] = useState<userProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await renderUser();

      setUserData(user);
    };

    fetchUser();

  }, []);


  // Aplicando dark mode nas mensagens de loading e erro (Removendo background, shadow e border-radius)
  if (loading) {
    return (
      // Removido background e sombra para manter a transparência
      <header className="flex items-center justify-between w-full p-4 sm:p-5 mb-4">
        <div><h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Carregando perfil...</h1></div>
      </header>
    );
  }

  if (error || !userData) {
    return (
      // Removido background e sombra para manter a transparência
      <header className="flex items-center justify-between w-full p-4 sm:p-5 mb-4">
        <div><h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">Erro ao carregar perfil.</h1></div>
        <p className="text-sm text-red-500 dark:text-red-300">{error || "Dados do usuário não disponíveis."}</p>
      </header>
    );
  }


  const adaptedUser: VisualUserProfile = {
    firstName: userData.username.split(' ')[0] || "Usuário",
    fullName: userData.username,
    // Assumindo que 'quention' é o campo que contém o e-mail ou identificador (verifique esta tipagem!)
    email: userData.quention,
    avatarUrl: `https://placehold.co/56x56/EAEAEA/B0B0B0?text=${userData.username.charAt(0)}` // Atualizado para 56x56
  };

  return (
    <>
      <Header
        user={adaptedUser}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        notificationCount={notificationCount}
        // AJUSTE: Passando a função de abrir o modal para o componente Header
        onProfileClick={handleOpenModal}
      />

      {/* AJUSTE: Renderização condicional do ProfileModal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default HeaderContainer;