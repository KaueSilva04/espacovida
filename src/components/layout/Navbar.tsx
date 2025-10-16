import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import logoImage from '../../assets/logo.png';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navLinks = [{
    name: 'Início',
    path: '/'
  }, {
    name: 'Sobre Nós',
    path: '/sobre'
  }, {
    name: 'Eventos',
    path: '/eventos'
  }, {
    name: 'Doe',
    path: '/doe'
  }, {
    name: 'Contato',
    path: '/contato'
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            
            <img src={logoImage} alt="Logo Espaço Vida"/>
            
          </div>
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`font-montserrat text-sm font-medium transition-colors hover:text-green-hope ${isActive(link.path) ? 'text-green-hope' : 'text-gray-700'}`}>
              {link.name}
            </Link>)}
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <XIcon className="h-6 w-6 text-gray-700" /> : <MenuIcon className="h-6 w-6 text-gray-700" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`font-montserrat text-sm font-medium transition-colors hover:text-green-hope ${isActive(link.path) ? 'text-green-hope' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>)}
          </div>
        </div>}
    </nav>;
};
export default Navbar;