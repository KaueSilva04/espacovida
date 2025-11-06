import { User, Loader2, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // Importando hooks do React
// 1. Importe a interface
import { userProfile } from '../interfaces/userInterfaces/userProfile.Interface';
// 2. Importe o hook de carregar dados
import { useRenderProfile } from '../hooks/userHooks/renderUserProfile.Hook';
import ProfileData from '../interfaces/FrontendInterfaces/EventPage/ProfileData.Interface';


interface ModalComponentProps {
    Titulo: string;
    OnClickClose: () => void;
    width?: string;
    height?: string;
    children: React.ReactNode;
}


function ModalComponent({
    Titulo,
    OnClickClose,
    width = "500px",
    height,
    children
}: ModalComponentProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-dark-surface rounded-lg shadow-2xl overflow-hidden flex flex-col"
                style={{
                    width: width,
                    height: height || 'auto',
                    maxHeight: '90vh',
                    zIndex: 60,
                    backdropFilter: 'blur(5px)', // Filtro de desfoque no fundo
                }}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">{Titulo}</h3>
                    <button
                        onClick={OnClickClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-dark-text-secondary dark:hover:text-dark-text-primary transition-colors rounded-full p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>


                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface ProfileModalProps {
    isOpen: boolean;
    profileData: ProfileData;
    onClose: () => void;
    onSave: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {

    const { renderUser, loading, error } = useRenderProfile();

    const [profileData, setProfileData] = useState<userProfile | null>(null);


    useEffect(() => {
        const loadProfile = async () => {
            const data = await renderUser();
            setProfileData(data);
        };

        if (isOpen) {
            setProfileData(null);
            loadProfile();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ModalComponent
            Titulo="Meu Perfil"
            OnClickClose={onClose}
            width="400px"
            height=""
        >
            <div className="p-6 bg-white dark:bg-dark-surface ">

                {/* 7. Use o estado 'loading' do hook */}
                {loading && (
                    <div className="text-center p-8 text-gray-500 dark:text-dark-text-secondary">
                        <Loader2 className="inline-block animate-spin h-8 w-8 text-green-600 mb-4" />
                        <p>Carregando perfil...</p>
                    </div>
                )}

                {/* 8. Adicione um tratamento de erro */}
                {error && (
                    <div className="text-center p-8 text-red-600 dark:text-red-400">
                        <p className='font-semibold mb-2'>Ocorreu um erro:</p>
                        <p className='text-sm'>{error}</p>
                    </div>
                )}

                {/* 9. Mostre os dados apenas se não estiver carregando, não houver erro, e os dados existirem */}
                {!loading && !error && profileData && (
                    <>
                        {/* Profile Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-dark-border">
                            <div className="
                            w-16 h-16 rounded-full flex items-center justify-center shadow-lg
                            bg-gradient-to-br from-green-500 to-green-700 
                            dark:bg-none dark:bg-dark-header
                        ">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{profileData.username}</h2>
                                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{profileData.adm ? 'Administrador' : 'Usuário'}</p>
                            </div>
                        </div>

                        {/* Campos */}
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-rounded-full
                        scrollbar-thumb-gray-300
                        hover:scrollbar-thumb-gray-400
                        active:scrollbar-thumb-green-500
                        dark:scrollbar-thumb-dark-border
                        dark:hover:scrollbar-thumb-dark-text-secondary
                        dark:active:scrollbar-thumb-green-600 ">

                            {/* Username */}
                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Username</label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    disabled
                                    className="w-full px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-secondary cursor-not-allowed"
                                />
                            </div>
                            {/* Pergunta de Segurança */}
                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Pergunta de Segurança</label>
                                <input
                                    type="text"
                                    value={profileData.question}
                                    disabled
                                    className="w-full px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-secondary cursor-not-allowed"
                                />
                            </div>
                            {/* Administrador */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileData.adm}
                                    disabled
                                    className="h-4 w-4 text-green-600"
                                />
                                <label className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">Administrador</label>
                            </div>
                        </div>
                    </>
                )}

                {/* Ação: Apenas Fechar (fora do condicional) */}
                <div className="flex mt-5 pt-5 border-t border-gray-200 dark:border-dark-border">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white text-sm rounded-lg font-semibold hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all shadow-lg"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </ModalComponent>
    );
}