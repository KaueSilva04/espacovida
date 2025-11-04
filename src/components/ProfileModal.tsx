import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit2, X } from 'lucide-react';
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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(formData);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
    };

    if (!isOpen) return null;

    return (
        <ModalComponent
            Titulo="Meu Perfil"
            OnClickClose={onClose}
            width="700px"
            height=""
        >
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{formData.nome}</h2>
                            <p className="text-gray-600">{formData.cargo || 'Usuário'}</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </button>
                    )}
                </div>

                {/* Profile Form */}
                <div className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 text-green-600" />
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 text-green-600" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            Telefone
                        </label>
                        <input
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    {/* Grid para Cargo e Departamento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cargo
                            </label>
                            <input
                                type="text"
                                value={formData.cargo || ''}
                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Departamento
                            </label>
                            <input
                                type="text"
                                value={formData.departamento || ''}
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                    ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Endereço
                        </label>
                        <input
                            type="text"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            value={formData.dataNascimento}
                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${isEditing
                                ? 'border-green-600 focus:border-green-600 focus:outline-none bg-white'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-4 mt-6 pt-6 border-t-2 border-gray-200">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                            <X className="w-5 h-5" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex-1 flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isSaving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                }`}
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                )}
            </div>
        </ModalComponent>
    );
}
