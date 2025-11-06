import { useState, useEffect } from 'react';
// Removendo ListFilter e mantendo apenas as essenciais e RotateCcw
import { Calendar, Users, MapPin, Clock, Plus, Trash2, UserPlus, Search, X, RotateCcw } from 'lucide-react';
import ModalComponent from '../../components/Modal';
import Sidebar from '../../components/Sidebar';
import HeaderContainer from '../../components/layout/HeaderSystem';
import ProfileModal from '../../components/ProfileModal';
import UsuariosPage from './UserPage';

// Corrigindo os caminhos de importação (removendo .Hook)
import { useCreateEvent } from '../../hooks/eventHooks/createEvent.Hook';
import { useDeleteEvent } from '../../hooks/eventHooks/deleteEvent.Hook';
import { useGetAllEvent } from '../../hooks/eventHooks/getAllEvent.Hook';
import { useGetAllParticipantByEvent } from '../../hooks/eventHooks/getAllParticipantsByEvent.hook';
import { useDeleteParticipant } from '../../hooks/participantHooks/deleteParticipant.Hook';
import { createEvent } from '../../interfaces/eventInterfaces/createEvent.Interface';
import { useNewParticipant } from '../../hooks/participantHooks/newParticipant.Hook';
import { newParticipant as NewParticipantInterface } from '../../interfaces/participantInterfaces/newParticipant.Interface';
import { deleteParticipantInterface } from '../../interfaces/participantInterfaces/deleteParticipant.Interface';
import { uploadImageToCloudinary } from '../../services/upload/uploadToCloudinary.Service';
import EventComponent from '../../components/EventPageModals/EventComponent';
import completeParticipant from '../../interfaces/participantInterfaces/completeParticipant.Interface';
import EventState from '../../interfaces/FrontendInterfaces/EventPage/EventState.Interface';
import EventFormState from '../../interfaces/FrontendInterfaces/EventPage/EventFormState.Interface';
import ParticipantFormState from '../../interfaces/FrontendInterfaces/EventPage/ParticipantFormState.Interface';
import ProfileData from '../../interfaces/FrontendInterfaces/EventPage/ProfileData.Interface';


// --- Interfaces ---
type SelectedEvent = EventState | null;


// --- FUNÇÃO AUXILIAR PARA O NOVO FILTRO DE PRÓXIMO MÊS ---
const isUpcomingNextMonth = (eventDateStr: string): boolean => {
    const eventDate = new Date(eventDateStr);
    const now = new Date();

    // Obtém o mês seguinte
    const twoMonthsLater = new Date(now.getFullYear(), now.getMonth() + 2, 1);

    // O evento deve ser no futuro (a partir de amanhã) e antes do final do próximo mês.
    const isFuture = eventDate > now;
    const isBeforeTwoMonthsLater = eventDate < twoMonthsLater;

    return isFuture && isBeforeTwoMonthsLater;
};


export default function EventManagementSystem() {
    // --- Hooks de API ---
    const { isLoading: isCreating, error: createError, createEvent: createEventMutation } = useCreateEvent();
    const { deleteEvent: deleteEventMutation, isLoading: isDeleting, error: deleteError } = useDeleteEvent();
    const { getAllEvent: fetchEvents, data: fetchedEvents, isLoading: isFetching, error: fetchError } = useGetAllEvent();
    const { createParticipant: createParticipantMutation, loading: isAddingParticipant, error: addParticipantError } = useNewParticipant();
    const { getAllParticipantByEvent: getAllParticipantByEventMutation, isLoading: isGettingParticipantByEvent, error: getParticipantByEventError } = useGetAllParticipantByEvent();
    const { deleteParticipant: deleteParticipantMutation, isLoading: isDeletingParticipant, error: deleteParticipantError } = useDeleteParticipant();

    // --- Estados de Navegação ---
    const [currentView, setCurrentView] = useState<'eventos' | 'usuarios' | 'perfil'>('eventos');
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
                // Geralmente não aparece, mas para consistência
                return {
                    title: "Meu Perfil",
                    subtitle: "Ajuste suas informações de conta",
                };
            default:
                return {
                    title: "Dashboard",
                    subtitle: "Visão geral do sistema",
                };
        }
    };

    // --- Estados de Perfil ---
    const [profileData, setProfileData] = useState<ProfileData>({
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 98765-4321',
        endereco: 'São Paulo, SP',
        dataNascimento: '1990-01-15',
        cargo: 'Gerente de Eventos',
        departamento: 'Administração'
    });

    // --- Estados de Eventos ---
    const [events, setEvents] = useState<EventState[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>(null);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showParticipantModal, setShowParticipantModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeleteParticipantModal, setShowDeleteParticipantModal] = useState<boolean>(false);
    const [participantIdToRemove, setParticipantIdToRemove] = useState<number>(-1);
    const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

    // --- ESTADOS DE FILTRO (ATUALIZADOS) ---
    const [searchTerm, setSearchTerm] = useState<string>('');
    // 'all' mostra todos, 'upcoming' mostra próximos do mês, 'completed' mostra passados.
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    // Removido: filterCategory e filterValue

    // --- Estados de Upload ---
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // --- Formulários ---
    const [eventForm, setEventForm] = useState<EventFormState>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
    });

    const [participantForm, setParticipantForm] = useState<ParticipantFormState>({
        name: '',
        email: '',
        phone: '',
        eventId: null
    });

    // --- useEffect para buscar eventos ---
    useEffect(() => {
        if (shouldRefetch) {
            fetchEvents();
            setShouldRefetch(false);
        }
    }, [shouldRefetch, fetchEvents]);

    useEffect(() => {
        if (fetchedEvents) {
            const mappedEvents: EventState[] = fetchedEvents.map(event => ({
                ...event,
                id: event.idevent,
                // Garantindo que a hora seja exibida corretamente
                time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                participants: (event as EventState).participants || [],
                status: (event as EventState).status || (new Date(event.date) < new Date() ? 'completed' : 'upcoming') // Define status com base na data se não houver um no backend
            }));
            setEvents(mappedEvents);
        }
    }, [fetchedEvents]);

    // --- Handlers de Navegação ---
    const handleViewChange = (view: 'eventos' | 'usuarios' | 'perfil') => {
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


    const handleSaveProfile = async (data: ProfileData) => {
        console.log('Salvando perfil:', data);
        setProfileData(data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const headerContent = getHeaderContent(); // Chame a função para obter o conteúdo

    // --- Handlers de Eventos ---
    const handleCreateEvent = async () => {
        setGlobalError(null);

        if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        if (isCreating) return; // evita duplo clique
        setIsUploading(true);

        try {
            let uploadedUrl: string | null = null;
            let uploadedPublicId: string | null = null;


            if (imageFile) {
                console.log('Iniciando upload...');
                const uploadResult = await uploadImageToCloudinary(imageFile, setUploadProgress);
                uploadedUrl = uploadResult.secure_url;
                uploadedPublicId = uploadResult.public_id;
                console.log('Upload concluído:', uploadedUrl);
            }

            const payload: createEvent = {
                title: eventForm.title,
                description: eventForm.description,
                date: `${eventForm.date}T${eventForm.time}:00.000Z`,
                location: eventForm.location,
                coverImageUrl: uploadedUrl || null,
                imagePublicId: uploadedPublicId || null,
            };

            console.log('Enviando payload final:', payload);

            const newEventData = await createEventMutation(payload);

            const newEvent: EventState = {
                ...newEventData,
                id: newEventData.idevent,
                time: eventForm.time,
                participants: [],
                status: 'upcoming',
                coverImageUrl: uploadedUrl || undefined,
            };

            setEvents(prev => [...prev, newEvent]);
            setShowEventModal(false);
            resetEventForm();
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            setGlobalError(createError || (error instanceof Error ? error.message : 'Erro desconhecido'));
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            setImageFile(null);
        }
    };


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

    // --- Handlers de Participantes ---
    const openAddParticipantModal = async (event: EventState) => {
        setGlobalError(null);
        setParticipantForm(prev => ({ ...prev, eventId: event.id }));
        setSelectedEvent(event);
        setShowParticipantModal(true);
    };

    const handleAddParticipant = async () => {
        setGlobalError(null);
        if (!selectedEvent || !participantForm.name || !participantForm.email || participantForm.eventId === null) {
            setGlobalError('Selecione um evento e preencha nome e email!');
            return;
        }

        const payload: NewParticipantInterface = {
            name: participantForm.name,
            email: participantForm.email,
            phone: participantForm.phone,
            idEvent: selectedEvent.id
        };

        try {
            const newParticipantData = await createParticipantMutation(payload);

            if (!newParticipantData) {
                setGlobalError(addParticipantError || 'Falha desconhecida ao adicionar participante.');
                return;
            }

            const newParticipant: completeParticipant = {
                idparticipant: newParticipantData.idparticipant,
                name: newParticipantData.name,
                email: newParticipantData.email,
                phone: newParticipantData.phone,
                eventId: selectedEvent.id
            };

            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return { ...event, participants: [...event.participants, newParticipant] };
                }
                return event;
            });

            setEvents(updatedEvents);
            setSelectedEvent(prev => prev ? { ...prev, participants: [...prev.participants, newParticipant] } : null);
            setShowParticipantModal(false);
            resetParticipantForm();
        } catch (e) {
            setGlobalError(addParticipantError || (e instanceof Error ? e.message : 'Um erro ocorreu ao adicionar o participante.'));
        }
    };

    const handleRemoveParticipant = (participantId: number) => {
        if (!selectedEvent) return;

        const data: deleteParticipantInterface = {
            idparticipant: participantId,
            eventId: selectedEvent.id
        };

        try {
            const result = deleteParticipantMutation(data);

            if (!result) {
                throw new Error("Erro ao excluir participante");
            }

            if (deleteParticipantError) {
                throw new Error(`Erro ao excluir participante: ${deleteParticipantError}`);
            }

            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return { ...event, participants: event.participants.filter(p => p.idparticipant !== participantId) };
                }
                return event;
            });

            setEvents(updatedEvents);
            setSelectedEvent(prev => prev ? { ...prev, participants: prev.participants.filter(p => p.idparticipant !== participantId) } : null);
            setShowDeleteParticipantModal(false);
        } catch (e) {
            setGlobalError(addParticipantError || (e instanceof Error ? e.message : 'Um erro ocorreu ao adicionar o participante.'));
        }
    };

    const handleGetAllParticipantsByEvent = async (eventId: number, event: EventState) => {
        try {
            const participantsData = await getAllParticipantByEventMutation(eventId);
            const updatedEvent: EventState = { ...event, participants: participantsData };

            setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? updatedEvent : e));
            setSelectedEvent(updatedEvent);
        } catch (e) {
            setGlobalError('Falha ao tentar pegar participantes do evento: ' + getParticipantByEventError);
        }
    };

    // --- Reset Forms ---
    const resetEventForm = () => {
        setEventForm({ title: '', description: '', date: '', time: '', location: '' });
    };

    const resetParticipantForm = () => {
        setParticipantForm({ name: '', email: '', phone: '', eventId: null });
    };

    // --- FUNÇÃO DE RESET (FUNCIONAL) ---
    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setStartDate('');
        setEndDate('');
    };

    // --- Filtragem (LÓGICA CORRIGIDA E CENTRALIZADA) ---
    const filteredEvents = events.filter(event => {

        // 1. Filtro de Busca (Search Term)
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.description.toLowerCase().includes(lowerCaseSearchTerm) || // Adicionado descrição para melhor busca
            event.location.toLowerCase().includes(lowerCaseSearchTerm);

        // 2. Filtro de Status
        let matchesStatus = true;
        const eventDate = new Date(event.date);
        const now = new Date();
        const isPast = eventDate < now;

        if (filterStatus === 'upcoming') {
            // Próximos: Eventos no futuro (próximo mês)
            matchesStatus = isUpcomingNextMonth(event.date);
        } else if (filterStatus === 'completed') {
            // Concluídos: Eventos no passado
            matchesStatus = isPast;
        }
        // Se for 'all', matchesStatus = true (já inicializado)

        // 3. Filtro de Data (Funcional)
        // Convertendo strings de data para objetos Date para comparação
        const startDateObj = startDate ? new Date(startDate + "T00:00:00") : null;
        const endDateObj = endDate ? new Date(endDate + "T23:59:59") : null;

        const matchesStartDate = !startDateObj || eventDate >= startDateObj;
        const matchesEndDate = !endDateObj || eventDate <= endDateObj;

        // Apenas eventos que satisfazem TODOS os critérios são incluídos
        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    const currentGlobalError = fetchError || deleteError || createError || addParticipantError || globalError;
    const showLoading = isFetching && events.length === 0;

    return (
        // Fundo principal com dark mode
        <div className="flex min-h-screen bg-gradient-to-br dark:bg-gray-800">
            {/* Sidebar */}
            <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
                userName={profileData.nome}
                userEmail={profileData.email}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <HeaderContainer
                    pageTitle={headerContent.title}
                    pageSubtitle={headerContent.subtitle}
                    notificationCount={3}
                    onProfileClick={handleOpenProfileModal} // Passando o handler para o Header
                />
                {/* TELA DE EVENTOS */}
                {currentView === 'eventos' && (
                    <div className="max-w-7xl mx-auto">

                        {/* Card de Filtros/Busca (Layout Atualizado) */}
                        <div className="bbg-slate-100 dark:bg-dark-surface dark:bg-opacity-80 rounded-2xl shadow-lg p-6 mb-6 ">

                            {/* --- 1. LINHA PRINCIPAL (Busca e Novo Evento) --- */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                                {/* Barra de Busca (Estilo Clean Atualizado, largura reduzida) */}
                                <div className="relative w-full md:max-w-md">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar eventos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                                    />
                                </div>

                                {/* Botão Novo Evento */}
                                <button
                                    onClick={() => {
                                        setShowEventModal(true);
                                        setGlobalError(null);
                                    }}
                                    disabled={isCreating}
                                    className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${isCreating
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    <Plus className="w-5 h-5" />
                                    {isCreating ? 'Aguarde...' : 'Novo Evento'}
                                </button>
                            </div>
                            {/* --- FIM DA LINHA 1 --- */}

                            {/* --- 2. LINHA DE FILTROS (Data + Status + Reset) --- */}
                            <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 mt-4">
                                {/* Filtro de Data Início */}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    <span className="text-gray-700 dark:text-white text-sm">De:</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Filtro de Data Fim */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 dark:text-white text-sm">Até:</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Filtro de Status (Dropdown) */}
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all dark:bg-gray-800"
                                >
                                    <option value="all">Status (Todos)</option>
                                    <option value="upcoming">Próximo Mês</option>
                                    <option value="completed">Concluídos/Passados</option>
                                </select>

                                {/* Botão de Reset (NOVO e funcional) */}
                                <button
                                    onClick={handleResetFilters}
                                    className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 md:ml-auto flex items-center gap-1 mt-2 md:mt-0"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Resetar Filtros
                                </button>
                            </div>
                            {/* --- FIM DA LINHA 2 --- */}

                            {/* Erro global */}
                            {currentGlobalError && (
                                <div className="p-3 mt-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    <span>Erro na Operação: {currentGlobalError}</span>
                                </div>
                            )}
                        </div>

                        {/* Loading com dark mode */}
                        {showLoading && (
                            <div className="text-center p-8 text-lg text-gray-500 dark:text-gray-400">
                                <Clock className="w-6 h-6 inline mr-2 animate-spin" />
                                Carregando eventos...
                            </div>
                        )}

                        {/* Nenhum evento com dark mode */}
                        {!showLoading && events.length === 0 && !currentGlobalError ? (
                            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                                Nenhum evento encontrado.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Eventos Futuros */}
                                {filteredEvents.filter(e => new Date(e.date) >= new Date()).map(event => (
                                    <EventComponent // Este componente precisa ser atualizado internamente
                                        key={event.id}
                                        titulo={event.title}
                                        descricao={event.description}
                                        data={event.date}
                                        hora={event.time}
                                        localizacao={event.location}
                                        imageUrl={event.coverImageUrl || ''}
                                        deleteFunction={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEvent(event.id);
                                        }}
                                        clickFunction={() => {
                                            setSelectedEvent(event);
                                            handleGetAllParticipantsByEvent(event.id, event);
                                        }}
                                        passado={false}
                                    />
                                ))}
                                {(!showLoading && filterStatus != "upcoming" && filterStatus != "completed") &&
                                    <div className='flex justify-between h-[80px]'>
                                        <p className='mt-auto text-gray-500 dark:text-gray-400'>Eventos passados</p>
                                        <hr className='bg-gray-400 dark:bg-gray-600 mt-auto w-[1140px] h-[2px] mb-3'></hr>
                                    </div>
                                }

                                {/* Eventos Passados */}
                                {filteredEvents.filter(e => new Date(e.date) < new Date()).map(event => (
                                    <EventComponent // Este componente precisa ser atualizado internamente
                                        key={event.id}
                                        titulo={event.title}
                                        descricao={event.description}
                                        data={event.date}
                                        hora={event.time}
                                        localizacao={event.location}
                                        imageUrl={event.coverImageUrl || ''}
                                        deleteFunction={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEvent(event.id);
                                        }}
                                        clickFunction={() => {
                                            setSelectedEvent(event);
                                            handleGetAllParticipantsByEvent(event.id, event);
                                        }}
                                        passado={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {/* TELA DE USUÁRIOS */}
                {/* Este componente precisa ser atualizado internamente */}
                {currentView === 'usuarios' && <UsuariosPage />}
            </div>

            {/* Profile Modal */}
            {/* Este componente precisa ser atualizado internamente */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => {
                    setShowProfileModal(false);
                }}
                profileData={profileData}
                onSave={() => {handleSaveProfile}}
            />

            {/* Event Details Modal */}
            {/* Este componente (ModalComponent) precisa ser atualizado internamente */}
            {selectedEvent && (
                <ModalComponent Titulo={selectedEvent.title} OnClickClose={() => setSelectedEvent(null)} width='800px' height=''>
                    {/* Conteúdo do Modal com dark mode */}
                    <div className="p-6 bg-white dark:bg-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedEvent.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Card Data */}
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
                                    <p className="font-semibold dark:text-white">{new Date(selectedEvent.date).toLocaleDateString('pt-BR')}</p>
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

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Lista de Participantes</h3>
                            <button
                                onClick={() => openAddParticipantModal(selectedEvent)}
                                // Botão de gradiente
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {isGettingParticipantByEvent || isDeletingParticipant ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Carregando...</p>
                            ) : selectedEvent.participants.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum participante cadastrado</p>
                            ) : (
                                selectedEvent.participants.map(participant => (
                                    // Linha do participante com dark mode
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
                                            onClick={() => {
                                                setParticipantIdToRemove(participant.idparticipant);
                                                setShowDeleteParticipantModal(true);
                                            }}
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
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ModalComponent Titulo='Confirmação de Exclusão' OnClickClose={() => setShowDeleteModal(false)} width='500px' height=''>
                    <div className="p-6 space-y-4 bg-white dark:bg-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                            Tem certeza que deseja <strong className="font-bold text-red-600 dark:text-red-400">excluir</strong> este evento? Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setEventToDeleteId(null);
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
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

            {/* Create Event Modal */}
            {showEventModal && (
                <ModalComponent Titulo='Criar Novo Evento' OnClickClose={() => { setShowEventModal(false); resetEventForm(); }} width='800px' height=''>
                    <div className="p-6 space-y-4 bg-white dark:bg-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Título *</label>
                            <input
                                type="text"
                                value={eventForm.title}
                                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                placeholder="Nome do evento"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Descrição</label>
                            <textarea
                                value={eventForm.description}
                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                rows={3}
                                placeholder="Descrição do evento"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Data *</label>
                                <input
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Horário *</label>
                                <input
                                    type="time"
                                    value={eventForm.time}
                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Local *</label>
                            <input
                                type="text"
                                value={eventForm.location}
                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                placeholder="Endereço do evento"
                            />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                        />

                        {imageFile && (
                            <div className="mt-3">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Prévia da imagem"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                                />
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setShowEventModal(false);
                                    resetEventForm();
                                }}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateEvent}
                                disabled={isCreating || isUploading}
                                // Botão de gradiente
                                className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isCreating || isUploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                    }`}
                            >
                                {isCreating || isUploading ? 'Enviando...' : 'Criar Evento'}
                            </button>
                        </div>
                    </div>
                </ModalComponent>
            )}

            {/* Add Participant Modal */}
            {showParticipantModal && selectedEvent && (
                <ModalComponent
                    Titulo='Adicionar Participante'
                    OnClickClose={() => {
                        setShowParticipantModal(false);
                        resetParticipantForm();
                    }}
                    width='500px'
                    height=''
                >
                    <div className="p-6 space-y-4 bg-white dark:bg-gray-700">
                        {addParticipantError && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 flex items-center gap-2">
                                <X className="w-5 h-5" />
                                <span>Erro: {addParticipantError}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nome *</label>
                            <input
                                type="text"
                                value={participantForm.name}
                                onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                placeholder="Nome completo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email *</label>
                            <input
                                type="email"
                                value={participantForm.email}
                                onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={participantForm.phone}
                                onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-green-600 focus:outline-none transition-all"
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
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddParticipant}
                                disabled={isAddingParticipant}
                                // Botão de gradiente
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

            {/* Delete participant */}
            {showDeleteParticipantModal && (
                <ModalComponent Titulo='Confirmação de Exclusão' OnClickClose={() => setShowDeleteParticipantModal(false)} width='500px' height=''>
                    <div className="p-6 space-y-4 bg-white dark:bg-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                            Tem certeza que deseja <strong className="font-bold text-red-600 dark:text-red-400">excluir</strong> este participante? Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setShowDeleteParticipantModal(false);
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { handleRemoveParticipant(participantIdToRemove); }}
                                disabled={isDeletingParticipant}
                                className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${isDeletingParticipant
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
        </div>
    );
}