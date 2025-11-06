import s, { useState } from 'react';
import { BanknoteIcon, ShoppingBagIcon, HeartIcon, PhoneIcon } from 'lucide-react';
const Donate = () => {
  const [donationType, setDonationType] = useState('financial');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleCopyPixKey = () => {
    navigator.clipboard.writeText('12.704.001/0001-04');
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  return <div className="w-full">
      {/* Header Section */}
      <section className="bg-blue-trust text-white py-16">
        <div className="container-custom">
          <h1 className="font-montserrat text-4xl font-bold mb-4">
            Colabore / Doe
          </h1>
          <p className="text-xl max-w-3xl">
            Sua contribuição é fundamental para mantermos nosso trabalho de
            reabilitação e transformação de vidas.
          </p>
        </div>
      </section>
      {/* Donation Options Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-6">
                Apoie Essa Causa
              </h2>
              <p className="text-gray-600 mb-6">
                A ONG Espaço Vida é uma organização sem fins lucrativos que
                trabalha na reabilitação de dependentes químicos. Para
                continuarmos oferecendo tratamento de qualidade, precisamos do
                seu apoio.
              </p>
              <div className="bg-gray-light p-6 rounded-lg mb-8">
                <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                  Por que doar?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Sua doação ajuda a manter a estrutura física da comunidade
                      terapêutica
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Contribui para a alimentação e medicamentos dos internos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Possibilita a contratação de profissionais especializados
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-hope mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">
                      Financia atividades terapêuticas e de capacitação
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-trust text-white p-6 rounded-lg">
                <h3 className="font-montserrat text-xl font-semibold mb-4">
                  Dados Bancários
                </h3>
                <p className="mb-4">
                  Caso prefira fazer uma transferência ou depósito diretamente
                  em nossa conta:
                </p>
                <div className="space-y-2 mb-4">
                  <p>
                    <strong>Banco:</strong> Banco do Brasil
                  </p>
                  <p>
                    <strong>Agência:</strong> 1234-5
                  </p>
                  <p>
                    <strong>Conta:</strong> 12345-6
                  </p>
                  <p>
                    <strong>CNPJ:</strong> 12.704.001/0001-04
                  </p>
                  <p>
                    <strong>Favorecido:</strong> ONG Espaço Vida
                  </p>
                </div>
                <p className="text-sm">
                  Após realizar a transferência, envie o comprovante para nosso
                  e-mail:
                  <a href="mailto:espacovidalimeira@gmail.com" className="underline ml-1">
                    espacovidalimeira@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-light p-6 rounded-lg shadow-md">
                <div className="flex mb-6">
                  <button type="button" onClick={() => setDonationType('financial')} className={`flex-1 py-3 flex flex-col items-center justify-center rounded-l-md transition-colors ${donationType === 'financial' ? 'bg-blue-trust text-white' : 'bg-white text-gray-600'}`}>
                    <BanknoteIcon className="w-6 h-6 mb-1" />
                    <span>Financeira</span>
                  </button>
                  <button type="button" onClick={() => setDonationType('material')} className={`flex-1 py-3 flex flex-col items-center justify-center rounded-r-md transition-colors ${donationType === 'material' ? 'bg-blue-trust text-white' : 'bg-white text-gray-600'}`}>
                    <ShoppingBagIcon className="w-6 h-6 mb-1" />
                    <span>Material</span>
                  </button>
                </div>
                {donationType === 'financial' ? <div className="text-center">
                    <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                      Doação via PIX
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Escaneie o QR Code abaixo com o aplicativo do seu banco ou
                      copie a chave PIX para fazer sua doação:
                    </p>
                    <div className="bg-white p-6 rounded-lg mb-6 flex flex-col items-center">
                      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                        <img src="/qr-code-pix.png" alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                      </div>
                      <div className="w-full">
                        <p className="text-gray-700 font-medium mb-2">
                          Chave PIX (CNPJ):
                        </p>
                        <div className="flex items-center">
                          <input type="text" value="12.704.001/0001-04" readOnly className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 bg-gray-50" />
                          <button onClick={handleCopyPixKey} className="bg-blue-trust text-white py-2 px-3 rounded-r-md hover:bg-opacity-90">
                            Copiar
                          </button>
                        </div>
                      </div>
                      {showSuccessMessage && <div className="mt-4 p-3 bg-green-hope bg-opacity-10 text-green-hope rounded-md flex items-center">
                          <HeartIcon className="w-5 h-5 mr-2" />
                          <p>Chave PIX copiada com sucesso!</p>
                        </div>}
                    </div>
                    <div className="bg-blue-trust bg-opacity-10 p-4 rounded-md text-left">
                      <h4 className="font-montserrat font-medium text-blue-trust mb-2">
                        Instruções:
                      </h4>
                      <ol className="text-gray-600 text-sm space-y-2 list-decimal pl-4">
                        <li>Abra o aplicativo do seu banco</li>
                        <li>Acesse a área de PIX</li>
                        <li>Escaneie o QR Code ou cole a chave PIX</li>
                        <li>Informe o valor da doação</li>
                        <li>Conclua a transferência</li>
                      </ol>
                    </div>
                  </div> : <div>
                    <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                      Doação de Materiais
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Aceitamos doações de diversos itens que são essenciais
                      para o funcionamento da nossa comunidade terapêutica:
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-montserrat font-semibold text-blue-trust mb-2">
                          Alimentos
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Arroz, feijão, óleo, açúcar, café, leite em pó,
                          macarrão, enlatados e outros não perecíveis.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-montserrat font-semibold text-blue-trust mb-2">
                          Produtos de Higiene
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Sabonete, shampoo, pasta de dente, papel higiênico,
                          desodorante, lâminas de barbear.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-montserrat font-semibold text-blue-trust mb-2">
                          Roupas e Calçados
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Roupas masculinas e femininas em bom estado, calçados,
                          roupas de cama e banho.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-md">
                        <h4 className="font-montserrat font-semibold text-blue-trust mb-2">
                          Material para Atividades
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Livros, material esportivo, instrumentos musicais,
                          material para artesanato.
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-trust text-white p-4 rounded-md mb-6">
                      <h4 className="font-montserrat font-semibold mb-2">
                        Como entregar
                      </h4>
                      <p className="text-sm mb-2">
                        Você pode entregar suas doações diretamente em nossa
                        sede:
                      </p>
                      <p className="text-sm font-medium">
                        Rua Para, Vila Rosália, Limeira-SP
                      </p>
                      <p className="text-sm mt-2">
                        De segunda a sexta, das 8h às 17h.
                      </p>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <a href="tel:+5519988860447" className="btn-primary flex items-center justify-center">
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        Ligue para Agendar
                      </a>
                      <a href="https://wa.me/5519981167773" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-all hover:bg-opacity-90 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Donate;