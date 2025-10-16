import React, { useState, lazy } from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, CheckCircleIcon } from 'lucide-react';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
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
    // In a real app, this would send the form data to a backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };
  return <div className="w-full">
    {/* Header Section */}
    <section className="bg-blue-trust text-white py-16">
      <div className="container-custom">
        <h1 className="font-montserrat text-4xl font-bold mb-4">Contato</h1>
        <p className="text-xl max-w-3xl">
          Entre em contato conosco para mais informações sobre nosso trabalho,
          como ajudar ou para agendar uma visita.
        </p>
      </div>
    </section>
    {/* Contact Information and Form Section */}
    <section className="py-16 bg-gray-light">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-6">
              Fale Conosco
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos disponíveis para esclarecer suas dúvidas, receber
              sugestões ou para qualquer outro tipo de contato. Preencha o
              formulário ao lado ou utilize um de nossos canais de
              atendimento.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-trust bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <MapPinIcon className="w-6 h-6 text-blue-trust" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-blue-trust mb-1">
                    Endereço
                  </h3>
                  <p className="text-gray-600">
                    Rua Para, Vila Rosália, Limeira-SP
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-trust bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <PhoneIcon className="w-6 h-6 text-blue-trust" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-blue-trust mb-1">
                    Telefone
                  </h3>
                  <p className="text-gray-600">(19) 3442-2361</p>
                  <p className="text-gray-600">(19) 98886-0447</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-trust bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <MailIcon className="w-6 h-6 text-blue-trust" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-blue-trust mb-1">
                    E-mail
                  </h3>
                  <p className="text-gray-600">espacovidalimeira@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-4">
                Redes Sociais
              </h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/ongespacovida
" target="blank__" className="w-12 h-12 rounded-full bg-blue-trust flex items-center justify-center text-white hover:bg-opacity-90 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>

                <a href="https://wa.me/5519981167773?text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%2C%20por%20favor.
" target="blank__" className="w-12 h-12 rounded-full bg-blue-trust flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .01 5.37.01 12c0 2.12.56 4.17 1.63 5.97L0 24l6.19-1.63A11.86 11.86 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82a9.8 9.8 0 01-5-1.37l-.36-.21-3.67.97.98-3.57-.24-.37A9.77 9.77 0 012.2 12c0-5.39 4.39-9.78 9.8-9.78 2.61 0 5.07 1.02 6.92 2.87A9.73 9.73 0 0121.8 12c0 5.39-4.39 9.82-9.8 9.82zm5.41-7.27c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.35-1.43-.87-.78-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.16-.24-.59-.48-.51-.65-.52-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-.99 2.44.03 1.44 1.05 2.83 1.2 3.02.15.19 2.06 3.14 5 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {!formSubmitted ? <form onSubmit={handleSubmit}>
                <h3 className="font-montserrat text-xl font-semibold text-blue-trust mb-6">
                  Envie-nos uma mensagem
                </h3>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Nome Completo*
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      E-mail*
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Telefone
                    </label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                    Assunto*
                  </label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                    Mensagem*
                  </label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-hope" required></textarea>
                </div>
                <button type="submit" className="w-full btn-primary">
                  Enviar Mensagem
                </button>
              </form> : <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-hope bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-hope" />
                </div>
                <h3 className="font-montserrat text-2xl font-semibold text-blue-trust mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-gray-600 mb-6">
                  Obrigado por entrar em contato. Responderemos o mais breve
                  possível.
                </p>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Map Section */}
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="font-montserrat text-3xl font-bold text-blue-trust mb-6 text-center">
          Como Chegar
        </h2>
        <div className="rounded-lg overflow-hidden shadow-md h-96">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.1369167562256!2d-47.40247232537587!3d-22.65174897937586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8807a8cd9a0ad%3A0xb0a0b0a0b0a0b0a0!2sVila%20Ros%C3%A1lia%2C%20Limeira%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1624548807842!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen="" loading="lazy" title="Localização da ONG Espaço Vida"></iframe>
        </div>
      </div>
    </section>
  </div>;
};
export default Contact;