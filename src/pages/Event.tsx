import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, Trash2, UserPlus, Search, X } from 'lucide-react';
import ModalComponent from '../components/Modal';

import { useCreateEvent } from '../hooks/eventHooks/createEvent.Hook';
import { useDeleteEvent } from '../hooks/eventHooks/deleteEvent.Hook';
import { useGetAllEvent } from '../hooks/eventHooks/getAllEvent.Hook';
import { createEvent } from '../interfaces/eventInterfaces/createEvent.Interface';
import { completeEvent } from '../interfaces/eventInterfaces/completeEvent.Interface'
import { useNewParticipant } from '../hooks/participantHooks/newParticipant.Hook';
import { newParticipant as NewParticipantInterface } from '../interfaces/participantInterfaces/newParticipant.Interface';
import EventComponent from '../components/EventPageModals/EventComponent';

// --- 2. Definição das Interfaces do Componente ---
interface Participant {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface EventState extends completeEvent {
    // O idevent é number, mas os IDs mockados são number
    id: number;
    title: string;
    description: string
    time: string; // Adicionado para manter a estrutura do seu estado mockado
    maxParticipants: number;
    participants: Participant[];
    status: 'upcoming' | 'completed' | 'cancelled' | string;
    date: string;
    location: string
}

// O formulário de novo evento
interface EventFormState {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxParticipants: number;
}

interface ParticipantFormState {
    name: string;
    email: string;
    phone: string;
    eventId: number | null;
}

// Tipo para o estado selecionado (pode ser um EventState ou null)
type SelectedEvent = EventState | null;


export default function EventManagementSystem() {
    // --- 3. Inicialização dos Hooks ---
    const { isLoading: isCreating, error: createError, createEvent: createEventMutation } = useCreateEvent();

    // INICIALIZAÇÃO DO HOOK DE EXCLUSÃO (Para manter a funcionalidade anterior)
    const {
        deleteEvent: deleteEventMutation,
        isLoading: isDeleting,
        error: deleteError
    } = useDeleteEvent();

    // INICIALIZAÇÃO DO HOOK DE BUSCA DE EVENTOS
    const {
        getAllEvent: fetchEvents,
        data: fetchedEvents,
        isLoading: isFetching,
        error: fetchError
    } = useGetAllEvent();

    // NOVO: INICIALIZAÇÃO DO HOOK DE ADIÇÃO DE PARTICIPANTE
    const {
        createParticipant: createParticipantMutation,
        loading: isAddingParticipant,
        error: addParticipantError
    } = useNewParticipant();
    // ------------------------------------

    // A lista de eventos agora começa vazia e será preenchida pelo useEffect/Hook.
    const [events, setEvents] = useState<EventState[]>([]);

    const [view, setView] = useState<'list' | 'grid'>('list');
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>(null);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showParticipantModal, setShowParticipantModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // Modal de exclusão
    const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null); // ID para exclusão
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [globalError, setGlobalError] = useState<string | null>(null); // Erros de formulário/gerais
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);


    useEffect(() => {
        if (shouldRefetch) {
            // Chama a função para iniciar a busca. Ela atualizará 'fetchedEvents'.
            fetchEvents();
            setShouldRefetch(false); // Evita o refetch automático até ser acionado novamente
        }
    }, [shouldRefetch, fetchEvents]);

    useEffect(() => {
        if (fetchedEvents) {
            // Mapeia para garantir a estrutura correta (se houver campos adicionais necessários no estado local)
            const mappedEvents: EventState[] = fetchedEvents.map(event => ({
                ...event,
                // Garantindo que 'id' e 'time' estejam presentes conforme o EventState local
                id: event.idevent, // Usa idevent como ID local
                time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                participants: (event as EventState).participants || [],
                maxParticipants: (event as EventState).maxParticipants || 100, // Valor padrão se não vier da API
                status: (event as EventState).status || 'upcoming'
            }));

            setEvents(mappedEvents);
        }
    }, [fetchedEvents]); // Depende do estado de dados do hook


    const [eventForm, setEventForm] = useState<EventFormState>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: 0
    });

    const [participantForm, setParticipantForm] = useState<ParticipantFormState>({
        name: '',
        email: '',
        phone: '',
        eventId: null
    });

    // --- FUNÇÃO DE CRIAÇÃO (Inclusão de evento na lista local após sucesso da API) ---
    const handleCreateEvent = async () => {
        setGlobalError(null);
        if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        const payload: createEvent = {
            title: eventForm.title,
            description: eventForm.description,
            // Seu backend espera o formato ISO com timezone (Z), então a concatenação é crucial.
            date: `${eventForm.date}T${eventForm.time}:00.000Z`,
            location: eventForm.location,
        };

        try {
            const newEventData = await createEventMutation(payload);

            const newEvent: EventState = {
                ...newEventData,
                id: newEventData.idevent,
                time: eventForm.time,
                maxParticipants: eventForm.maxParticipants,
                participants: [],
                status: 'upcoming'
            };

            setEvents(prevEvents => [...prevEvents, newEvent]);
            setShowEventModal(false);
            resetEventForm();
        } catch (e) {
            setGlobalError(createError || (e as Error).message);
        }
    };


    // --- FUNÇÕES DE MANIPULAÇÃO LOCAL ---
    const handleDeleteEvent = (eventId: number) => {
        setGlobalError(null);
        setEventToDeleteId(eventId);
        setShowDeleteModal(true);
    };

    const confirmDeleteEvent = async () => {
        if (eventToDeleteId !== null) {
            setGlobalError(null);
            try {
                await deleteEventMutation(eventToDeleteId);

                setEvents(events.filter(e => e.id !== eventToDeleteId));

                if (selectedEvent && selectedEvent.id === eventToDeleteId) {
                    setSelectedEvent(null);
                }

                setEventToDeleteId(null);
                setShowDeleteModal(false);

            } catch (e) {
                setGlobalError('Falha ao excluir evento: ' + deleteError);
            }
        }
    };


    const openAddParticipantModal = (event: EventState) => {
        setGlobalError(null);
        setParticipantForm(prev => ({
            ...prev,
            eventId: event.id
        }));
        setSelectedEvent(event);
        setShowParticipantModal(true);
    };

    // FUNÇÃO DE ADIÇÃO DE PARTICIPANTE (AGORA CHAMA O HOOK/API)
    const handleAddParticipant = async () => {
        setGlobalError(null); // Limpa erros anteriores
        if (!selectedEvent || !participantForm.name || !participantForm.email || participantForm.eventId === null) {
            setGlobalError('Selecione um evento e preencha nome e email!');
            return;
        }

        if (selectedEvent.participants.length >= selectedEvent.maxParticipants) {
            setGlobalError('Evento já atingiu o número máximo de participantes!');
            return;
        }

        // Prepara o payload para a API
        const payload: NewParticipantInterface = {
            name: participantForm.name,
            email: participantForm.email,
            phone: participantForm.phone,
            idEvent: selectedEvent.id
        };

        try {
            // CHAMA A API PARA CRIAR O PARTICIPANTE
            const newParticipantData = await createParticipantMutation(payload);

            if (!newParticipantData) {
                setGlobalError(addParticipantError || 'Falha desconhecida ao adicionar participante.');
                return;
            }

            // O retorno da API (newParticipantData) deve ser um 'returnParticipant' com um ID.
            const newParticipant: Participant = {
                id: newParticipantData.idparticipant, // Assumindo que o ID do participante retornado se chama idParticipant
                name: newParticipantData.name,
                email: newParticipantData.email,
                phone: newParticipantData.phone,
            };

            // 1. Atualiza a lista principal de eventos
            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return {
                        ...event,
                        participants: [...event.participants, newParticipant]
                    };
                }
                return event;
            });

            setEvents(updatedEvents);

            // 2. Atualiza o evento selecionado (para o modal de detalhes)
            setSelectedEvent(prev => prev ? {
                ...prev,
                participants: [...prev.participants, newParticipant]
            } : null);

            // 3. Fecha o modal e limpa o formulário
            setShowParticipantModal(false);
            resetParticipantForm();

        } catch (e) {
            // Se houver erro, exibe o erro retornado pelo hook
            setGlobalError(addParticipantError || (e instanceof Error ? e.message : 'Um erro ocorreu ao adicionar o participante.'));
        }
    };

    const handleRemoveParticipant = (participantId: number) => {
        if (!selectedEvent) return;

        // Mantido o código original para remoção local, já que não há serviço de remoção fornecido.
        if (window.confirm('Remover este participante?')) {
            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return {
                        ...event,
                        participants: event.participants.filter(p => p.id !== participantId)
                    };
                }
                return event;
            });

            setEvents(updatedEvents);
            setSelectedEvent(prev => prev ? {
                ...prev,
                participants: prev.participants.filter(p => p.id !== participantId)
            } : null);
        }
    };

    const resetEventForm = () => {
        setEventForm({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            maxParticipants: 0
        });
    };

    const resetParticipantForm = () => {
        setParticipantForm({
            name: '',
            email: '',
            phone: '',
            eventId: null // Limpa o ID do evento também
        });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const currentGlobalError = fetchError || deleteError || createError || addParticipantError || globalError;
    const showLoading = isFetching && events.length === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Eventos</h1>
                            <p className="text-gray-600">Organize e acompanhe seus eventos e participantes</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowEventModal(true);
                                setGlobalError(null); // Limpa erro ao abrir o modal
                            }}
                            disabled={isCreating}
                            className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${isCreating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                }`}
                        >
                            <Plus className="w-5 h-5" />
                            {isCreating ? 'Aguarde...' : 'Novo Evento'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                        <div className="flex-1 relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                            />
                        </div>

                        {currentGlobalError && (
                            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex-1 flex items-center gap-2">
                                <X className="w-5 h-5" />
                                <span>Erro na Operação: {currentGlobalError}</span>
                            </div>
                        )}
                    </div>
                </div>

                {showLoading && (
                    <div className="text-center p-8 text-lg text-gray-500">
                        <Clock className="w-6 h-6 inline mr-2 animate-spin" />
                        Carregando eventos...
                    </div>
                )}

                {!showLoading && events.length === 0 && !currentGlobalError ? (
                    <div className="text-center p-8 text-gray-500">
                        Nenhum evento encontrado.
                    </div>
                ) : (
                    // Conteúdo de Lista ou Grid
                    view === 'list' ? (
                        <div className="space-y-4">
                            {filteredEvents.map(event => (
                                <EventComponent
                                    key={event.id}
                                    titulo={event.title}
                                    descricao={event.description}
                                    data={event.date}
                                    hora={event.time}
                                    localizacao={event.location}
                                    numParticipante={event.participants.length}
                                    maxParticipante={event.maxParticipants}
                                    deleteFunction={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEvent(event.id);
                                    }}
                                    clickFunction={() => {
                                        setSelectedEvent(event)
                                    }}
                                >
                                </EventComponent>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            {new Date(event.date).toLocaleDateString('pt-BR')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-purple-600" />
                                            {event.participants.length}/{event.maxParticipants} participantes
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {selectedEvent && (
                    <ModalComponent Titulo={selectedEvent.title} OnClickClose={() => setSelectedEvent(null)} width='800px' height=''>
                        <div className="p-6 w-">
                            <p className="text-green-50">{selectedEvent.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Data</p>
                                        <p className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Horário</p>
                                        <p className="font-semibold">{selectedEvent.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                                    <MapPin className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Local</p>
                                        <p className="font-semibold">{selectedEvent.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Participantes</p>
                                        <p className="font-semibold">{selectedEvent.participants.length}/{selectedEvent.maxParticipants}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Lista de Participantes</h3>
                                <button
                                    onClick={() => openAddParticipantModal(selectedEvent)} // CHAMA A NOVA FUNÇÃO
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Adicionar
                                </button>
                            </div>

                            <div className="space-y-3">
                                {selectedEvent.participants.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Nenhum participante cadastrado</p>
                                ) : (
                                    selectedEvent.participants.map(participant => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">{participant.name}</p>
                                                <p className="text-sm text-gray-600">{participant.email}</p>
                                                <p className="text-sm text-gray-600">{participant.phone}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveParticipant(participant.id)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </ModalComponent>
                )}

                {showDeleteModal && (
                    <ModalComponent Titulo='Confirmação de Exclusão' OnClickClose={() => setShowDeleteModal(false)} width='2xl' height=''>
                        <div className="p-6 space-y-4">
                            <p className="text-gray-700">
                                Tem certeza que deseja <strong className="font-bold text-red-600">excluir</strong> este evento? Esta ação não pode ser desfeita.
                            </p>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setEventToDeleteId(null);
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteEvent}
                                    disabled={isDeleting}
                                    className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isDeleting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                                </button>
                            </div>
                        </div>
                    </ModalComponent>
                )}

                {showEventModal && (
                    <ModalComponent Titulo='Criar Novo Evento' OnClickClose={() => { setShowEventModal(false); resetEventForm() }} width='800px' height='800px'>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                                <input
                                    type="text"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="Nome do evento"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                <textarea
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    rows={3}
                                    placeholder="Descrição do evento"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                                    <input
                                        type="date"
                                        value={eventForm.date}
                                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Horário *</label>
                                    <input
                                        type="time"
                                        value={eventForm.time}
                                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Local *</label>
                                <input
                                    type="text"
                                    value={eventForm.location}
                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="Endereço do evento"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Participantes *</label>
                                <input
                                    type="number"
                                    value={eventForm.maxParticipants}
                                    onChange={(e) => setEventForm({ ...eventForm, maxParticipants: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="0"
                                    min={1}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setShowEventModal(false);
                                        resetEventForm();
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateEvent}
                                    disabled={isCreating}
                                    className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isCreating
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                        }`}
                                >
                                    {isCreating ? 'Criando...' : 'Criar Evento'}
                                </button>
                            </div>
                        </div>
                    </ModalComponent>
                )}

                {showParticipantModal && selectedEvent && (
                    <ModalComponent
                        Titulo='Adicionar Participante'
                        OnClickClose={() => {
                            setShowParticipantModal(false);
                            resetParticipantForm();
                        }
                        }
                        width='500px'
                        height=''
                    >
                        <div className="p-6 space-y-4">
                            {addParticipantError && (
                                <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    <span>Erro: {addParticipantError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                <input
                                    type="text"
                                    value={participantForm.name}
                                    onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={participantForm.email}
                                    onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                <input
                                    type="tel"
                                    value={participantForm.phone}
                                    onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setShowParticipantModal(false);
                                        resetParticipantForm();
                                    }}
                                    disabled={isAddingParticipant}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddParticipant}
                                    disabled={isAddingParticipant}
                                    className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isAddingParticipant
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                        }`}
                                >
                                    {isAddingParticipant ? 'Adicionando...' : 'Adicionar'}
                                </button>
                            </div>
                        </div>
                    </ModalComponent>
                )}
            </div>
        </div>
    );
}