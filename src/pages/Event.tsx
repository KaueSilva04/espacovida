import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, Edit2, Trash2, UserPlus, Search, Filter, X, CheckCircle } from 'lucide-react';

// --- 1. Importações do Hook e Interfaces ---
// Assumindo os caminhos corretos:
import { useCreateEvent } from '../hooks/eventHooks/createEvent.Hook';
import { createEvent, completeEvent } from '../interfaces/eventInterfaces/createEvent.Interface'; // Tipagem de envio
// Assumindo que a interface completeEvent está no mesmo arquivo para simplificar o import, ou em '../interfaces/eventInterfaces/completeEvent.Interface'
// Para este exemplo, vou usar a interface 'completeEvent' para tipar o que está no estado 'events'.

// --- 2. Definição das Interfaces do Componente ---

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// O tipo de evento usado no estado local (State do React)
interface EventState extends completeEvent {
  // O idevent é number, mas os IDs mockados são number
  id: number; 
  time: string; // Adicionado para manter a estrutura do seu estado mockado
  maxParticipants: number;
  participants: Participant[];
  status: 'upcoming' | 'completed' | 'cancelled' | string;
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
}

// Tipo para o estado selecionado (pode ser um EventState ou null)
type SelectedEvent = EventState | null;


export default function EventManagementSystem() {
  // --- 3. Inicialização do Hook ---
  const { isLoading: isCreating, error: createError, createEvent: createEventMutation } = useCreateEvent();

  const [events, setEvents] = useState<EventState[]>([
    {
      id: 1,
      title: 'Campanha de Arrecadação',
      description: 'Arrecadação de alimentos e roupas para famílias carentes',
      date: '2024-11-15',
      time: '14:00',
      location: 'Centro Comunitário',
      maxParticipants: 50,
      participants: [
        { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 98765-4322' }
      ],
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Workshop de Capacitação',
      description: 'Oficina de capacitação profissional para jovens',
      date: '2024-11-20',
      time: '09:00',
      location: 'Auditório Principal',
      maxParticipants: 30,
      participants: [
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 98765-4323' }
      ],
      status: 'upcoming'
    }
  ]);

  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>(null);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showParticipantModal, setShowParticipantModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [globalError, setGlobalError] = useState<string | null>(null);

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
    phone: ''
  });
  
  // --- 4. FUNÇÃO DE CRIAÇÃO ATUALIZADA (Usando o Hook) ---
  const handleCreateEvent = async () => {
    setGlobalError(null);
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    // Mapeia o EventFormState para o Payload de envio (createEvent)
    const payload: createEvent = {
        title: eventForm.title,
        description: eventForm.description,
        // Combina data e hora para atender à tipagem do backend (se necessário) ou envia separadamente
        date: `${eventForm.date}T${eventForm.time}:00.000Z`, 
        location: eventForm.location,
    };
    
    try {
        // Chamada de Mutação: O HOOK faz a requisição e o tratamento de status/envelope
        const newEventData = await createEventMutation(payload);

        // Atualiza o estado local do React com o evento retornado pela API (que tem o idevent)
        const newEvent: EventState = {
            ...newEventData,
            id: newEventData.idevent, // Usa o idevent como ID local
            time: eventForm.time, 
            maxParticipants: eventForm.maxParticipants,
            participants: [],
            status: 'upcoming'
        };

        setEvents([...events, newEvent]);
        setShowEventModal(false);
        resetEventForm();
    } catch (e) {
        // O erro já foi capturado e armazenado no estado 'createError' pelo hook,
        // mas setamos um erro global aqui para exibir no topo da página, se necessário.
        setGlobalError((e as Error).message);
    }
  };
  
  // FUNÇÕES DE MANIPULAÇÃO LOCAL (Tipadas)
  
  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
      setSelectedEvent(null);
    }
  };

  const handleAddParticipant = () => {
    if (!selectedEvent || !participantForm.name || !participantForm.email) {
      alert('Selecione um evento e preencha nome e email!');
      return;
    }

    if (selectedEvent.participants.length >= selectedEvent.maxParticipants) {
      alert('Evento já atingiu o número máximo de participantes!');
      return;
    }

    const newParticipant: Participant = {
      id: Date.now(),
      ...participantForm
    };

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
    setSelectedEvent(prev => prev ? { 
        ...prev, 
        participants: [...prev.participants, newParticipant] 
    } : null);
    setShowParticipantModal(false);
    resetParticipantForm();
  };

  const handleRemoveParticipant = (participantId: number) => {
    if (!selectedEvent) return;
    
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
      phone: ''
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
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
              className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  isCreating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
            >
              <Plus className="w-5 h-5" />
              {isCreating ? 'Aguarde...' : 'Novo Evento'}
            </button>
          </div>

          {/* Search and Filter */}
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
            {/* Adiciona o display de erro global */}
            {(globalError || createError) && (
                <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex-1 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>Erro na Operação: {globalError || createError}</span>
                </div>
            )}
          </div>
        </div>

        {/* Events List/Grid (Código de renderização não alterado, apenas tipado) */}
        {view === 'list' ? (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        {event.participants.length}/{event.maxParticipants}
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
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
        )}

        {/* Event Detail Modal (Simplificado o uso do SelectedEvent para ser tipado) */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                    <p className="text-green-50">{selectedEvent.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
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
                    onClick={() => setShowParticipantModal(true)}
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
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Criar Novo Evento</h2>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      resetEventForm();
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

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
                    className={`flex-1 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
                        isCreating 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    }`}
                  >
                    {isCreating ? 'Criando...' : 'Criar Evento'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Participant Modal (Não alterado, apenas tipado) */}
        {showParticipantModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Adicionar Participante</h2>
                  <button
                    onClick={() => {
                      setShowParticipantModal(false);
                      resetParticipantForm();
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
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
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddParticipant}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}