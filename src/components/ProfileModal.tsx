import { User } from 'lucide-react';
import ModalComponent from './Modal';

interface ProfileData {
    username: string;
    question: string;
    adm: boolean;
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileData: ProfileData;
}

export default function ProfileModal({ isOpen, onClose, profileData }: ProfileModalProps) {
    if (!isOpen) return null;

    return (
        <ModalComponent
            Titulo="Meu Perfil"
            OnClickClose={onClose}
            width="400px"
            height=""
        >
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{profileData.username}</h2>
                        <p className="text-sm text-gray-600">{profileData.adm ? 'Administrador' : 'Usuário'}</p>
                    </div>
                </div>

                {/* Campos */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {/* Username */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={profileData.username}
                            disabled
                            className="w-full px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                    </div>
                    {/* Pergunta de Segurança */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1">Pergunta de Segurança</label>
                        <input
                            type="text"
                            value={profileData.question}
                            disabled
                            className="w-full px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 cursor-not-allowed"
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
                        <label className="text-sm font-medium text-gray-700">Administrador</label>
                    </div>
                </div>
                {/* Ação: Apenas Fechar */}
                <div className="flex mt-5 pt-5 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white text-sm rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </ModalComponent>
    );
}
