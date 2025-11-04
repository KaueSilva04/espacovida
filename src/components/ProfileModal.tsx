import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit2, X, AlertCircle } from 'lucide-react';
import ModalComponent from './Modal';

interface ProfileData {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    dataNascimento: string;
    cargo?: string;
    departamento?: string;
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileData: ProfileData;
    onSave?: (data: ProfileData) => void;
}

export default function ProfileModal({ isOpen, onClose, profileData, onSave }: ProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileData>(profileData);
    const [isSaving, setIsSaving] = useState(false);
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(formData);
            }
            setIsEditing(false);
            setShowUnsavedWarning(false);
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
        setShowUnsavedWarning(false);
    };

    const handleCloseAttempt = () => {
        if (isEditing) {
            setShowUnsavedWarning(true);
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        setFormData(profileData);
        setIsEditing(false);
        setShowUnsavedWarning(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalComponent
            Titulo="Meu Perfil"
            OnClickClose={handleCloseAttempt}
            width="550px"
            height=""
        >
            <div className="p-6">
                {/* Unsaved Changes Warning */}
                {showUnsavedWarning && (
                    <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg flex items-start gap-3 animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800">Alterações não salvas</p>
                            <p className="text-xs text-amber-700 mt-1">Você tem alterações pendentes. Deseja realmente fechar?</p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={confirmClose}
                                    className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-all"
                                >
                                    Sim, fechar
                                </button>
                                <button
                                    onClick={() => setShowUnsavedWarning(false)}
                                    className="px-3 py-1.5 text-xs border border-amber-600 text-amber-700 rounded hover:bg-amber-50 transition-all"
                                >
                                    Continuar editando
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{formData.nome}</h2>
                            <p className="text-sm text-gray-600">{formData.cargo || 'Usuário'}</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all shadow-lg"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </button>
                    )}
                </div>

                {/* Profile Form */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {/* Nome */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                            <User className="w-3.5 h-3.5 text-green-600" />
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                            <Mail className="w-3.5 h-3.5 text-green-600" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                            <Phone className="w-3.5 h-3.5 text-green-600" />
                            Telefone
                        </label>
                        <input
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                        />
                    </div>

                    {/* Grid para Cargo e Departamento */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Cargo
                            </label>
                            <input
                                type="text"
                                value={formData.cargo || ''}
                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                    isEditing
                                        ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                value={formData.departamento || ''}
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                    isEditing
                                        ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-green-600" />
                            Endereço
                        </label>
                        <input
                            type="text"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                        />
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-green-600" />
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            value={formData.dataNascimento}
                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                                isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-200">
                    {!isEditing ? (
                        <button
                            onClick={onClose}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white text-sm rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg"
                        >
                            <X className="w-4 h-4" />
                            Fechar
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex-1 flex items-center justify-center gap-2 text-white text-sm px-4 py-2.5 rounded-lg font-semibold shadow-lg transition-all ${
                                    isSaving
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </ModalComponent>
    );
}
