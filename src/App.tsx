import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Site/Home';
import About from './pages/Site/About';
import Events from './pages/Site/Events';
import Donate from './pages/Site/Donate';
import Contact from './pages/Site/Contact';
import Login from './pages/System/Login';
import System from './pages/System/Event';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicRoute } from './components/layout/PublicRoute';

function AppContent() {
  const nonLayoutPages = ['/login', '/System', '/system'];

  const location = useLocation();
  const hideLayout = nonLayoutPages.includes(location.pathname);

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
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/System" element={<ProtectedRoute element={<System />} />} />

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