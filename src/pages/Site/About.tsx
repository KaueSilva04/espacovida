import React from 'react';
import { HeartIcon, UsersIcon, StarIcon, ActivityIcon, BrainIcon, SmileIcon } from 'lucide-react';
const About = () => {
  return <div className="w-full">
      {/* Header Section */}
      <section className="bg-blue-trust text-white py-16">
        <div className="container-custom">
          <h1 className="font-montserrat text-4xl font-bold mb-4">
            Sobre a ONG Espaço Vida
          </h1>
          <p className="text-xl max-w-3xl">
            Conheça nossa história, missão e como trabalhamos para transformar
            vidas através da reabilitação de dependentes químicos.
          </p>
        </div>
      </section>
      {/* Mission Vision Purpose Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-light rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-green-hope" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
                Nossa Missão
              </h3>
              <p className="text-gray-600">
                A reabilitação de pessoas dependentes de álcool e outras
                substâncias químicas, proporcionando tratamento digno e eficaz.
              </p>
            </div>
            <div className="bg-gray-light rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-green-hope" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
                Nossa Visão
              </h3>
              <p className="text-gray-600">
                Ser referência em tratamento e reabilitação de dependentes
                químicos, transformando vidas e fortalecendo famílias.
              </p>
            </div>
            <div className="bg-gray-light rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-green-hope" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-3">
                Nossos Valores
              </h3>
              <p className="text-gray-600">
                Respeito, dignidade, acolhimento, espiritualidade e compromisso
                com a recuperação integral do indivíduo.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-4">
                Objetivo como Comunidade Terapêutica
              </h2>
              <p className="text-gray-600 mb-4">
                O Espaço Vida é uma comunidade terapêutica que proporciona um
                tratamento legal, seguro e relevante aos internos. O tratamento
                é desenvolvido a partir do clássico triângulo da recuperação,
                oferecendo cuidados físicos, emocionais e espirituais.
              </p>
              <p className="text-gray-600 mb-6">
                Nossa metodologia se baseia na reclusão voluntária do dependente
                do meio social por um período de seis meses, proporcionando ao
                indivíduo condições de resgatar seus valores morais,
                comportamentais e espirituais.
              </p>
              <div className="bg-gray-light rounded-lg p-4">
                <h4 className="font-montserrat font-semibold text-blue-trust mb-2">
                  Nosso Compromisso
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Tratamento humanizado e personalizado
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Equipe multidisciplinar qualificada
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Acompanhamento pós-tratamento
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Suporte às famílias dos dependentes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg"></div>
              {/* New Triangle Recovery Section - Modern Version */}
              <div className="mt-6 bg-blue-trust rounded-lg p-6 text-white">
                <h3 className="font-montserrat text-xl font-semibold mb-4 text-center">
                  Triângulo da Recuperação
                </h3>
                <div className="relative py-10">
                  {/* Triangle Shape */}
                  <div className="relative mx-auto" style={{
                  width: '240px',
                  height: '220px'
                }}>
                    <div className="absolute w-full h-full">
                      <div className="absolute border-2 border-white opacity-80" style={{
                      width: '100%',
                      height: '100%',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0))'
                    }}></div>
                    </div>
                    {/* Spiritual - Top */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-1">
                        <SmileIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-montserrat font-medium text-sm">
                        Espiritual
                      </span>
                    </div>
                    {/* Physical - Bottom Left */}
                    <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-1">
                        <ActivityIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-montserrat font-medium text-sm">
                        Físico
                      </span>
                    </div>
                    {/* Emotional - Bottom Right */}
                    <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-1">
                        <BrainIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-montserrat font-medium text-sm">
                        Emocional
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center mt-8">
                  Nossa metodologia baseia-se no equilíbrio destes três pilares
                  fundamentais para uma recuperação completa e duradoura.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
                    <h4 className="font-montserrat text-sm font-medium mb-1">
                      Espiritual
                    </h4>
                    <p className="text-xs opacity-90">
                      Conexão com valores e propósito de vida
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
                    <h4 className="font-montserrat text-sm font-medium mb-1">
                      Físico
                    </h4>
                    <p className="text-xs opacity-90">
                      Cuidados com o corpo e saúde integral
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
                    <h4 className="font-montserrat text-sm font-medium mb-1">
                      Emocional
                    </h4>
                    <p className="text-xs opacity-90">
                      Desenvolvimento de inteligência emocional
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default About;