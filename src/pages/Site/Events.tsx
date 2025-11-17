import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { useNewParticipant } from '../../hooks/participantHooks/newParticipant.Hook';
import { useGetPublicEvents } from '../../hooks/eventHooks/useGetPublicEvents.Hook';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80'
];

const EventCard = ({ event, onParticipate }) => {
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    // Card com fundo e sombra atualizados para dark mode
    <div className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:shadow-black/20">
      <div className="h-48 bg-cover bg-center" style={{
        backgroundImage: `url(${event.image})`
      }}></div>
      <div className="p-6">
        <div className="flex items-center text-green-hope dark:text-green-400 mb-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{formatDate(event.date)}</span>
        </div>
        <h3 className="font-montserrat text-xl font-semibold mb-2 text-gray-900 dark:text-dark-text-primary">
          {event.title}
        </h3>
        {/* Texto secundário atualizado */}
        <p className="text-gray-600 dark:text-dark-text-secondary mb-4">{event.description}</p>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-500 dark:text-dark-text-secondary">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-dark-text-secondary">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>
        <button
          onClick={() => onParticipate(event)}
          className="w-full btn-primary flex items-center justify-center" // Mantive 'btn-primary'
        >
          <UserIcon className="w-4 h-4 mr-2" />
          Participar
        </button>
      </div>
    </div>
  );
};

const RegistrationForm = ({ event, onClose }) => {
  // ... (toda a lógica de state e validação permanece a mesma) ...
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const { createParticipant, loading, error } = useNewParticipant();

  // Função de validação de email
  const validateEmail = (email: any) => {
    if (!email || email.trim() === '') {
      return 'E-mail é obrigatório';
    }

    if (email.length > 100) {
      return 'E-mail deve ter no máximo 100 caracteres';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'E-mail inválido';
    }

    return '';
  };

  // Função de validação de telefone (formato brasileiro)
  const validatePhone = (phone: any) => {
    if (!phone || phone.trim() === '') {
      return 'Telefone é obrigatório';
    }

    const phoneNumbers = phone.replace(/\D/g, '');

    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      return 'Telefone deve ter 10 ou 11 dígitos';
    }

    const phoneRegex = /^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\s?)?\d{4}[-\s]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return 'Formato de telefone inválido. Use: (XX) XXXXX-XXXX';
    }

    return '';
  };

  // Função de validação de nome
  const validateName = (name: string) => {
    if (!name || name.trim() === '') {
      return 'Nome é obrigatório';
    }

    if (name.length < 3) {
      return 'Nome deve ter no mínimo 3 caracteres';
    }

    if (name.length > 100) {
      return 'Nome deve ter no máximo 100 caracteres';
    }

    return '';
  };

  // Formatar telefone enquanto digita
  const formatPhone = (value: any) => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const formattedValue = name === 'phone' ? formatPhone(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);

    setValidationErrors({
      name: nameError,
      email: emailError,
      phone: phoneError
    });

    return !nameError && !emailError && !phoneError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Criar objeto com os dados no formato da interface newParticipant
    const participantData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\D/g, ''), // Envia apenas números
      idEvent: event.idevent || event.id // Suporta ambos os formatos
    };

    const result = await createParticipant(participantData);

    if (result) {
      setIsSubmitted(true);
    }
  };

  return (
    // Fundo do Modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Container do Modal */}
      <div className="bg-white dark:bg-dark-surface rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {!isSubmitted ? (
            <>
              {/* Título do Modal */}
              <h3 className="font-montserrat text-2xl font-semibold text-blue-trust mb-4">
                Participar do Evento
              </h3>
              {/* Texto secundário */}
              <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
                Preencha o formulário abaixo para participar do evento:{' '}
                <strong className="text-gray-700 dark:text-dark-text-primary">{event.title}</strong>
              </p>

              {/* Mensagem de Erro */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Campo Nome */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-dark-text-primary text-sm font-medium mb-2"
                  >
                    Nome Completo*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // Input com dark mode
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-dark-bg dark:text-dark-text-primary ${validationErrors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-dark-border focus:ring-green-hope'
                      }`}
                    disabled={loading}
                    maxLength={100}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                    {formData.name.length}/100 caracteres
                  </p>
                </div>

                {/* Campo Email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-dark-text-primary text-sm font-medium mb-2"
                  >
                    E-mail*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // Input com dark mode
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-dark-bg dark:text-dark-text-primary ${validationErrors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-dark-border focus:ring-green-hope'
                      }`}
                    disabled={loading}
                    maxLength={100}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.email}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                    {formData.email.length}/100 caracteres
                  </p>
                </div>

                {/* Campo Telefone */}
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 dark:text-dark-text-primary text-sm font-medium mb-2"
                  >
                    Telefone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="(11) 98765-4321"
                    // Input com dark mode
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-dark-bg dark:text-dark-text-primary ${validationErrors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-dark-border focus:ring-green-hope'
                      }`}
                    disabled={loading}
                    maxLength={15}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.phone}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                    Formato: (XX) XXXXX-XXXX
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  {/* Botão Cancelar */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 dark:text-dark-text-secondary hover:text-gray-800 dark:hover:text-dark-text-primary transition-colors"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  {/* Botão Primário (usa sua classe global) */}
                  <button
                    type="submit"
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Confirmar Participação'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Tela de Sucesso
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-hope bg-opacity-10 dark:bg-green-hope/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-hope dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="font-montserrat text-2xl font-semibold text-blue-trust mb-2">
                Inscrição Confirmada!
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
                Obrigado por se inscrever no evento. Enviaremos mais informações
                para o seu e-mail.
              </p>
              <button onClick={onClose} className="btn-primary">
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [activeView, setActiveView] = useState('list');

  const { events, isLoading, error } = useGetPublicEvents();

  const handleParticipate = event => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false);
  };

  return (
    // Fundo da página
    <div className="w-full bg-white dark:bg-dark-bg">
      {/* Header Section (Já tem fundo escuro, então está OK) */}
      <section className="bg-blue-trust text-white py-16">
        <div className="container-custom">
          <h1 className="font-montserrat text-4xl font-bold mb-4">Eventos</h1>
          <p className="text-xl max-w-3xl">
            Participe dos nossos eventos e ajude a promover a conscientização e
            o apoio à reabilitação de dependentes químicos.
          </p>
        </div>
      </section>

      {/* Events Section - Fundo principal da seção */}
      <section className="py-16 bg-gray-light dark:bg-dark-bg">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-2">
                Próximos Eventos
              </h2>
              {/* Texto secundário */}
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Confira nossa agenda e participe das nossas atividades.
              </p>
            </div>
            {/* Seletor de View (Lista/Calendário) */}
            <div className="mt-4 md:mt-0 flex bg-white dark:bg-dark-surface rounded-md shadow-sm">
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 ${activeView === 'list'
                    ? 'bg-blue-trust text-white'
                    : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary'
                  } rounded-l-md`}
              >
                Lista
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`px-4 py-2 ${activeView === 'calendar'
                    ? 'bg-blue-trust text-white'
                    : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary'
                  } rounded-r-md`}
              >
                Calendário
              </button>
            </div>
          </div>

          {activeView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8 col-span-3">Carregando eventos...</p>
              ) : error ? (
                <p className="text-red-600 dark:text-red-400 text-center py-8 col-span-3">{error}</p>
              ) : events.length === 0 ? (
                <p className="text-gray-500 dark:text-dark-text-secondary text-center py-8 col-span-3">Nenhum evento encontrado.</p>
              ) : (
                events.filter(event => new Date(event.date) > new Date()).
                sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).
                map((event, index) => {
                  const defaultImage = DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
                  const formattedEvent = {
                    ...event,
                    image: event.coverImageUrl || defaultImage,
                    time: new Date(event.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                  };
                  return (
                    <EventCard
                      key={event.idevent}
                      event={formattedEvent}
                      onParticipate={handleParticipate}
                    />
                  );
                })
              )}
            </div>
          )}

          {activeView === 'calendar' && (
            // Fundo do Calendário
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              {(() => {
                const now = new Date();
                const months = [
                  { month: now.getMonth(), year: now.getFullYear() },
                  {
                    month: now.getMonth() === 11 ? 0 : now.getMonth() + 1,
                    year: now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(),
                  },
                ];

                const monthNames = [
                  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                ];

                return months.map(({ month, year }) => {
                  const daysInMonth = new Date(year, month + 1, 0).getDate();

                  return (
                    <div key={`${month}-${year}`} className="mb-10">
                      <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                        {monthNames[month]} {year}
                      </h3>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Dias da semana */}
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                          <div
                            key={day}
                            className="text-center py-2 text-gray-500 dark:text-dark-text-secondary font-medium"
                          >
                            {day}
                          </div>
                        ))}
                        {/* Dias do mês */}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                          const hasEvent = events.some((event) => {
                            const eventDate = new Date(event.date);
                            return (
                              eventDate.getDate() === day &&
                              eventDate.getMonth() === month &&
                              eventDate.getFullYear() === year
                            );
                          });

                          return (
                            <div
                              key={day}
                              className={`text-center py-3 rounded-md ${hasEvent
                                  ? 'bg-green-hope bg-opacity-10 dark:bg-green-hope/20 text-green-hope dark:text-green-400 font-medium cursor-pointer hover:bg-opacity-20 dark:hover:bg-green-hope/30'
                                  : 'text-gray-700 dark:text-dark-text-primary'
                                }`}
                              onClick={() => {
                                if (hasEvent) {
                                  const event = events.find((e) => {
                                    const eventDate = new Date(e.date);
                                    return (
                                      eventDate.getDate() === day &&
                                      eventDate.getMonth() === month &&
                                      eventDate.getFullYear() === year
                                    );
                                  });
                                  handleParticipate(event);
                                }
                              }}
                            >
                              {day}
                              {hasEvent && (
                                <div className="w-2 h-2 bg-green-hope dark:bg-green-400 rounded-full mx-auto mt-1"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Event Registration Modal */}
      {showRegistrationForm && selectedEvent && (
        <RegistrationForm event={selectedEvent} onClose={closeRegistrationForm} />
      )}
    </div>
  );
};

export default Events;