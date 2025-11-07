// EventDetailsModal.tsx
import React from 'react';
import { Calendar, Users, MapPin, Clock, Trash2, UserPlus, X } from 'lucide-react';
// Adapte o caminho abaixo para o seu componente Modal base
import ModalComponent from '../../Modal'; 
// Adapte os caminhos abaixo para suas interfaces/types
import EventState from '../../../interfaces/FrontendInterfaces/EventPage/EventState.Interface';

// --- Props do Componente ---
interface EventDetailsModalProps {
    selectedEvent: EventState;
    onClose: () => void;
    onOpenAddParticipantModal: (event: EventState) => void;
    onSetParticipantToRemove: (participantId: number) => void;
    onOpenDeleteParticipantModal: () => void;
    isGettingParticipantByEvent: boolean;
    isDeletingParticipant: boolean;
    globalError: string | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    selectedEvent,
    onClose,
    onOpenAddParticipantModal,
    onSetParticipantToRemove,
    onOpenDeleteParticipantModal,
    isGettingParticipantByEvent,
    isDeletingParticipant,
    globalError, // Mantendo o Global Error como prop, embora o componente pai o controle
}) => {

    const eventDateStr = new Date(selectedEvent.date).toLocaleDateString('pt-BR');

    // Função de clique para abrir a confirmação de exclusão do participante
    const handleDeleteParticipantClick = (participantId: number) => {
        onSetParticipantToRemove(participantId);
        onOpenDeleteParticipantModal();
    }

    return (
        // Utilizando o ModalComponent base
        <ModalComponent Titulo={selectedEvent.title} OnClickClose={onClose} width='800px' height=''>
            {/* Conteúdo do Modal com dark mode */}
            <div className="p-6 bg-white dark:bg-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedEvent.description}</p>
                
                {/* Erro de participante (Adicionei a exibição de erro aqui, se necessário) */}
                {globalError && (
                    <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        <span>{globalError}</span>
                    </div>
                )}
                
                {/* Detalhes do Evento em Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Card Data */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
                            <p className="font-semibold dark:text-white">{eventDateStr}</p>
                        </div>
                    </div>
                    {/* Card Horário */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Horário</p>
                            <p className="font-semibold dark:text-white">{selectedEvent.time}</p>
                        </div>
                    </div>
                    {/* Card Local */}
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Local</p>
                            <p className="font-semibold dark:text-white">{selectedEvent.location}</p>
                        </div>
                    </div>
                    {/* Card Participantes */}
                    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Participantes</p>
                            <p className="font-semibold dark:text-white">{selectedEvent.participants.length}</p>
                        </div>
                    </div>
                </div>

                {/* Seção de Participantes */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Lista de Participantes</h3>
                    <button
                        onClick={() => onOpenAddParticipantModal(selectedEvent)}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Adicionar
                    </button>
                </div>

                {/* Lista de Participantes */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {isGettingParticipantByEvent || isDeletingParticipant ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Carregando...</p>
                    ) : selectedEvent.participants.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum participante cadastrado</p>
                    ) : (
                        selectedEvent.participants.map(participant => (
                            <div
                                key={participant.idparticipant}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">{participant.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{participant.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{participant.phone}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteParticipantClick(participant.idparticipant)}
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ModalComponent>
    );
};

export default EventDetailsModal;