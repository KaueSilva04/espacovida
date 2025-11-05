import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, Trash2, UserPlus, Search, X } from 'lucide-react';
import ModalComponent from '../components/Modal';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';
import UsuariosPage from '../pages/UsuariosPage';

import { useCreateEvent } from '../hooks/eventHooks/createEvent.Hook';
import { useDeleteEvent } from '../hooks/eventHooks/deleteEvent.Hook';
import { useGetAllEvent } from '../hooks/eventHooks/getAllEvent.Hook';
import { useGetAllParticipantByEvent } from '../hooks/eventHooks/getAllParticipantsByEvent.hook';
import { useDeleteParticipant } from '../hooks/participantHooks/deleteParticipant.Hook';
import { createEvent } from '../interfaces/eventInterfaces/createEvent.Interface';
import { completeEvent } from '../interfaces/eventInterfaces/completeEvent.Interface'
import { useNewParticipant } from '../hooks/participantHooks/newParticipant.Hook';
import { newParticipant as NewParticipantInterface } from '../interfaces/participantInterfaces/newParticipant.Interface';
import { deleteParticipantInterface } from '../interfaces/participantInterfaces/deleteParticipant.Interface';
import { uploadImageToCloudinary } from '../services/upload/uploadToCloudinary.Service';
import EventComponent from '../components/EventPageModals/EventComponent';
import completeParticipant from '../interfaces/participantInterfaces/completeParticipant.Interface';

// --- Interfaces ---
interface EventState extends completeEvent {
    coverImageUrl?: string;
    id: number;
    title: string;
    description: string
    time: string;
    participants: completeParticipant[];
    status: 'upcoming' | 'completed' | 'cancelled' | string;
    date: string;
    location: string
}

interface EventFormState {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
}

interface ParticipantFormState {
    name: string;
    email: string;
    phone: string;
    eventId: number | null;
}

interface ProfileData {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    dataNascimento: string;
    cargo?: string;
    departamento?: string;
}

type SelectedEvent = EventState | null;

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
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>(null);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showParticipantModal, setShowParticipantModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeleteParticipantModal, setShowDeleteParticipantModal] = useState<boolean>(false)
    const [participantIdToRemove, setParticipantIdToRemove] = useState<number>(-1)
    const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

    // --- Estados de Upload ---
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadedImage, setUploadedImage] = useState<{ url: string; publicId: string } | null>(null);
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
                time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                participants: (event as EventState).participants || [],
                status: (event as EventState).status || 'upcoming'
            }));
            setEvents(mappedEvents);
        }
    }, [fetchedEvents]);

    // --- Handlers de Navegação ---
    const handleViewChange = (view: 'eventos' | 'usuarios' | 'perfil') => {
        setCurrentView(view);
        if (view === 'perfil') {
            setShowProfileModal(true);
        }
    };

    const handleSaveProfile = async (data: ProfileData) => {
        console.log('Salvando perfil:', data);
        setProfileData(data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleUploadImage = async () => {
        if (!imageFile) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const result = await uploadImageToCloudinary(imageFile, setUploadProgress);

            setUploadedImage({
                url: result.secure_url,
                publicId: result.public_id,
            });
        } catch (error) {
            setGlobalError('Erro ao fazer upload da imagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        } finally {
            setIsUploading(false);
        }
    };

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
            const result = deleteParticipantMutation(data)

            if (!result) {
                throw new Error("Erro ao excluir participante")
            }

            if (deleteParticipantError) {
                throw new Error(`Erro ao excluir participante: ${deleteParticipantError}`)
            }

            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return { ...event, participants: event.participants.filter(p => p.idparticipant !== participantId) };
                }
                return event;
            });

            setEvents(updatedEvents);
            setSelectedEvent(prev => prev ? { ...prev, participants: prev.participants.filter(p => p.idparticipant !== participantId) } : null);
            setShowDeleteParticipantModal(false)
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

    // --- Filtragem ---
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const currentGlobalError = fetchError || deleteError || createError || addParticipantError || globalError;
    const showLoading = isFetching && events.length === 0;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-100">
            {/* Sidebar */}
            <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
                userName={profileData.nome}
                userEmail={profileData.email}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                {/* TELA DE EVENTOS */}
                {currentView === 'eventos' && (
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
                                        setGlobalError(null);
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
                            <div className="space-y-4">
                                {filteredEvents.filter(e => new Date(e.date) >= new Date()).map(event => (
                                    <EventComponent
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
                                {!showLoading &&
                                    <div className='flex justify-between h-[80px]'>
                                        <p className='mt-auto text-slate-400'>Eventos passados</p>
                                        <hr className='bg-slate-400 mt-auto w-[1140px] h-[2px] mb-3'></hr>
                                    </div>
                                }

                                {filteredEvents.filter(e => new Date(e.date) < new Date()).map(event => (
                                    <EventComponent
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
                {currentView === 'usuarios' && <UsuariosPage />}
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => {
                    setShowProfileModal(false);
                    setCurrentView('eventos');
                }}
                profileData={profileData}
                onSave={handleSaveProfile}
            />

            {/* Event Details Modal */}
            {selectedEvent && (
                <ModalComponent Titulo={selectedEvent.title} OnClickClose={() => setSelectedEvent(null)} width='800px' height=''>
                    <div className="p-6">
                        <p className="text-gray-700 mb-6">{selectedEvent.description}</p>
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
                                    <p className="font-semibold">{selectedEvent.participants.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Lista de Participantes</h3>
                            <button
                                onClick={() => openAddParticipantModal(selectedEvent)}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {isGettingParticipantByEvent || isDeletingParticipant ? (
                                <p className="text-gray-500 text-center py-8">Carregando...</p>
                            ) : selectedEvent.participants.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Nenhum participante cadastrado</p>
                            ) : (
                                selectedEvent.participants.map(participant => (
                                    <div
                                        key={participant.idparticipant}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">{participant.name}</p>
                                            <p className="text-sm text-gray-600">{participant.email}</p>
                                            <p className="text-sm text-gray-600">{participant.phone}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setParticipantIdToRemove(participant.idparticipant)
                                                setShowDeleteParticipantModal(true)
                                            }}
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ModalComponent Titulo='Confirmação de Exclusão' OnClickClose={() => setShowDeleteModal(false)} width='500px' height=''>
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

            {/* Create Event Modal */}
            {showEventModal && (
                <ModalComponent Titulo='Criar Novo Evento' OnClickClose={() => { setShowEventModal(false); resetEventForm() }} width='800px' height=''>
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

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                        />

                        {imageFile && (
                            <div className="mt-3">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Prévia da imagem"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                                />
                            </div>
                        )}

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
                                disabled={isCreating || isUploading}
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

            {/* Delete participant */}
            {showDeleteParticipantModal && (
                <ModalComponent Titulo='Confirmação de Exclusão' OnClickClose={() => setShowDeleteParticipantModal(false)} width='500px' height=''>
                    <div className="p-6 space-y-4">
                        <p className="text-gray-700">
                            Tem certeza que deseja <strong className="font-bold text-red-600">excluir</strong> este participante? Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setShowDeleteParticipantModal(false);
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { handleRemoveParticipant(participantIdToRemove) }}
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
