import { Link } from 'react-router-dom';
import { CalendarIcon, HeartIcon, UsersIcon } from 'lucide-react';
import { useGetPublicEvents } from '../../hooks/eventHooks/useGetPublicEvents.Hook';
const Home = () => {

  const { events, isLoading, error } = useGetPublicEvents();

  return <div className="w-full">
    {/* Hero Section */}
    <section className="relative bg-blue-trust text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative h-[80vh] flex items-center" style={{
        backgroundImage: 'url(https://static.wixstatic.com/media/ba4e6c_aa917cddc651445b89a18b61c4a5ab19~mv2.jpg/v1/fill/w_980,h_629,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ba4e6c_aa917cddc651445b89a18b61c4a5ab19~mv2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container-custom z-10">
          <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">
            ONG Espaço Vida Comunidade Terapêutica
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
            Tratamento seguro e digno para dependentes químicos
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/sobre" className="btn-primary">
              Conheça a ONG
            </Link>
            <Link to="/eventos" className="btn-outline bg-white bg-opacity-10 border-white text-white hover:bg-white hover:text-blue-trust">
              Agende um Evento
            </Link>
          </div>
        </div>
      </div>
    </section>
    {/* Features Section */}
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-2">
            Nossa Missão
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Proporcionamos tratamento e acolhimento para dependentes químicos,
            ajudando-os a reconstruir suas vidas com dignidade e propósito.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-light rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-green-hope" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
              Objetivo
            </h3>
            <p className="text-gray-600">
              Proporcionar um tratamento legal, seguro e relevante aos
              internos, com foco na recuperação física, emocional e
              espiritual.
            </p>
          </div>
          <div className="bg-gray-light rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-green-hope" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
              Área de Atuação
            </h3>
            <p className="text-gray-600">
              Tratamento de dependentes de álcool e outras substâncias
              químicas através de reclusão voluntária e acompanhamento
              especializado.
            </p>
          </div>
          <div className="bg-gray-light rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-green-hope" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
              Propósito Social
            </h3>
            <p className="text-gray-600">
              Resgatar valores morais, comportamentais e espirituais através
              de um programa de seis meses com acompanhamento profissional.
            </p>
          </div>
        </div>
      </div>
    </section>
    {/* Events Preview Section */}
    <section className="py-16 bg-gray-light">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-2">
              Próximos Eventos
            </h2>
            <p className="text-gray-600">
              Participe de nossas atividades e ajude a fazer a diferença.
            </p>
          </div>
          <Link to="/eventos" className="btn-primary mt-4 md:mt-0 inline-block">
            Ver Todos os Eventos
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? "Carregando próximos eventos..." :

            events.filter(event => new Date(event.date) > new Date()).
              sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).
              slice(0, 3).
              map((event, index) =>
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img className="h-48 w-full object-cover" src={event.coverImageUrl}></img>
                  <div className="p-6">
                    <div className="flex items-center text-green-hope mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">{
                        new Date(event.date).toLocaleDateString('pt-BR')
                      }</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {event.description}
                    </p>
                    <Link to="/eventos" className="text-blue-trust font-medium hover:underline flex items-center">
                      Participar
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>)}
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-16 bg-blue-trust text-white">
      <div className="container-custom text-center">
        <h2 className="font-montserrat text-3xl font-bold mb-4">
          Apoie Essa Causa
        </h2>
        <p className="max-w-2xl mx-auto mb-8">
          Juntos faremos a diferença. Você pode fazer parte desse projeto! A
          ONG Espaço Vida é uma organização sem fins lucrativos para
          reabilitação de dependentes químicos.
        </p>
        <Link to="/doe" className="btn-primary bg-white text-blue-trust hover:bg-opacity-90">
          Quero Ajudar
        </Link>
      </div>
    </section>
  </div>;
};
export default Home;