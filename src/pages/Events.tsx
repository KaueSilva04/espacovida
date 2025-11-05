import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';

import { useGetPublicEvents } from '../hooks/eventHooks/useGetPublicEvents.Hook';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80'
];

const EventCard = ({
  event,
  onParticipate
}) => {
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  return <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <div className="h-48 bg-cover bg-center" style={{
      backgroundImage: `url(${event.image})`
    }}></div>
    <div className="p-6">
      <div className="flex items-center text-green-hope mb-2">
        <CalendarIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">{formatDate(event.date)}</span>
      </div>
      <h3 className="font-montserrat text-xl font-semibold mb-2">
        {event.title}
      </h3>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{event.time}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{event.location}</span>
        </div>
      </div>
      <button onClick={() => onParticipate(event)} className="w-full btn-primary flex items-center justify-center">
        <UserIcon className="w-4 h-4 mr-2" />
        Participar
      </button>
    </div>
  </div>;
};
const RegistrationForm = ({
  event,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md">
      <div className="p-6">
        {!isSubmitted ? <>
          <h3 className="font-montserrat text-2xl font-semibold text-blue-trust mb-4">
            Participar do Evento
          </h3>
          <p className="text-gray-600 mb-6">
            Preencha o formulário abaixo para participar do evento:{' '}
            <strong>{event.title}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Nome Completo*
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                E-mail*
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                Telefone*
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
            </div>
            <div className="mb-6">
              <label htmlFor="comments" className="block text-gray-700 text-sm font-medium mb-2">
                Comentários ou Perguntas
              </label>
              <textarea id="comments" name="comments" value={formData.comments} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope"></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Confirmar Participação
              </button>
            </div>
          </form>
        </> : <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-hope" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="font-montserrat text-2xl font-semibold text-blue-trust mb-2">
            Inscrição Confirmada!
          </h3>
          <p className="text-gray-600 mb-6">
            Obrigado por se inscrever no evento. Enviaremos mais informações
            para o seu e-mail.
          </p>
          <button onClick={onClose} className="btn-primary">
            Fechar
          </button>
        </div>}
      </div>
    </div>
  </div>;
};
const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'calendar'

  const { events, isLoading, error } = useGetPublicEvents();

  const handleParticipate = event => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };
  const closeRegistrationForm = () => {
    setShowRegistrationForm(false);
  };
  return <div className="w-full">
    {/* Header Section */}
    <section className="bg-blue-trust text-white py-16">
      <div className="container-custom">
        <h1 className="font-montserrat text-4xl font-bold mb-4">Eventos</h1>
        <p className="text-xl max-w-3xl">
          Participe dos nossos eventos e ajude a promover a conscientização e
          o apoio à reabilitação de dependentes químicos.
        </p>
      </div>
    </section>
    {/* Events Section */}
    <section className="py-16 bg-gray-light">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-2">
              Próximos Eventos
            </h2>
            <p className="text-gray-600">
              Confira nossa agenda e participe das nossas atividades.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex bg-white rounded-md shadow-sm">
            <button onClick={() => setActiveView('list')} className={`px-4 py-2 ${activeView === 'list' ? 'bg-blue-trust text-white' : 'bg-white text-gray-600'} rounded-l-md`}>
              Lista
            </button>
            <button onClick={() => setActiveView('calendar')} className={`px-4 py-2 ${activeView === 'calendar' ? 'bg-blue-trust text-white' : 'bg-white text-gray-600'} rounded-r-md`}>
              Calendário
            </button>
          </div>
        </div>
        {activeView === 'list' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {isLoading ? (<p className="text-gray-500 text-center py-8 col-span-3">Carregando eventos...</p>) : error ? (<p className="text-red-600 text-center py-8 col-span-3">{error}</p>) : events.length === 0 ? (<p className="text-gray-500 text-center py-8 col-span-3">Nenhum evento encontrado.</p>) : (events.map((event, index) => { const defaultImage = DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]; const formattedEvent = { ...event, image: event.coverImageUrl || defaultImage, time: new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), }; return (<EventCard key={event.idevent} event={formattedEvent} onParticipate={handleParticipate} />); }))} </div>)}
        {activeView === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {(() => {
              const now = new Date();

              // Mês atual e próximo
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
                // número de dias do mês
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                return (
                  <div key={`${month}-${year}`} className="mb-10">
                    <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                      {monthNames[month]} {year}
                    </h3>
                    <div className="grid grid-cols-7 gap-1">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div
                          key={day}
                          className="text-center py-2 text-gray-500 font-medium"
                        >
                          {day}
                        </div>
                      ))}
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
                              ? 'bg-green-hope bg-opacity-10 text-green-hope font-medium cursor-pointer hover:bg-opacity-20'
                              : 'text-gray-700'
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
                              <div className="w-2 h-2 bg-green-hope rounded-full mx-auto mt-1"></div>
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
    {showRegistrationForm && selectedEvent && <RegistrationForm event={selectedEvent} onClose={closeRegistrationForm} />}
  </div>;
};
export default Events;