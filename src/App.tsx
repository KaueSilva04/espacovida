import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Event from './pages/Event';

function AppContent() {
  const nonLayoutPages = ['/login', '/event']

  const location = useLocation();
  const hideLayout = nonLayoutPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/doe" element={<Donate />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event" element={<Event />} />
          <Route
            path="*"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">404 - Página não encontrada</h1>
                <p>Ops — a página que você procura não existe.</p>
              </div>
            }
          />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}