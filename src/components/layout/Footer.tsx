import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import { MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-light pt-12 pb-6">
    <div className="container-custom">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            
          <img src={logoImage} alt="Logo Espaço Vida"/>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Comunidade Terapêutica dedicada à reabilitação de dependentes
            químicos
          </p>
          <p className="text-xs text-gray-500">CNPJ: 12.704.001/0001-04</p>
        </div>
        <div>
          <h3 className="font-montserrat text-lg font-semibold mb-4 text-blue-trust">
            Links Rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-gray-600 hover:text-green-hope">
                Início
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="text-sm text-gray-600 hover:text-green-hope">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link to="/eventos" className="text-sm text-gray-600 hover:text-green-hope">
                Eventos
              </Link>
            </li>
            <li>
              <Link to="/doe" className="text-sm text-gray-600 hover:text-green-hope">
                Como Ajudar
              </Link>
            </li>
            <li>
              <Link to="/contato" className="text-sm text-gray-600 hover:text-green-hope">
                Contato
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-montserrat text-lg font-semibold mb-4 text-blue-trust">
            Contato
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-green-hope mr-2 mt-0.5" />
              <p className="text-sm text-gray-600">
                Rua Para, Vila Rosália, Limeira-SP
              </p>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 text-green-hope mr-2" />
              <p className="text-sm text-gray-600">(19) 98886-0447</p>              
            <p className="text-gray-600">(19) 3442-2361</p>          </div>
            <div className="flex items-center">
              <MailIcon className="w-5 h-5 text-green-hope mr-2" />
              <p className="text-sm text-gray-600">
                espacovidalimeira@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-montserrat text-lg font-semibold mb-4 text-blue-trust">
            Redes Sociais
          </h3>
          <div className="flex space-x-4">
            
            <a href="#" className="w-10 h-10 rounded-full bg-blue-trust flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
              </svg>
            </a>
            
            <a href="https://wa.me/5519981167773?text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%2C%20por%20favor.
" target="blank__" className="w-10 h-10 rounded-full bg-blue-trust flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .01 5.37.01 12c0 2.12.56 4.17 1.63 5.97L0 24l6.19-1.63A11.86 11.86 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82a9.8 9.8 0 01-5-1.37l-.36-.21-3.67.97.98-3.57-.24-.37A9.77 9.77 0 012.2 12c0-5.39 4.39-9.78 9.8-9.78 2.61 0 5.07 1.02 6.92 2.87A9.73 9.73 0 0121.8 12c0 5.39-4.39 9.82-9.8 9.82zm5.41-7.27c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.35-1.43-.87-.78-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.16-.24-.59-.48-.51-.65-.52-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-.99 2.44.03 1.44 1.05 2.83 1.2 3.02.15.19 2.06 3.14 5 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" />
              </svg>
            </a>

          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            © 2025 ONG Espaço Vida. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Projeto acadêmico SI406 – Atividades Práticas em IHC | SHA256:
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </p>
        </div>
      </div>
    </div>
  </footer>;
};
export default Footer;