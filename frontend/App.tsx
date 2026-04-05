
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Experience from './pages/Experience';
import Method from './pages/Method';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Services from './pages/Services';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import AIChatWidget from './components/AIChatWidget';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex transition-colors duration-700 ease-in-out">
          <Sidebar />

          <div className="flex-1 flex flex-col items-center overflow-x-hidden">
            <div className="w-full lg:max-w-7xl md:max-w-3xl min-h-screen bg-background-light dark:bg-background-dark shadow-2xl relative flex flex-col transition-all duration-700 ease-in-out md:border-x lg:border-l-0 border-slate-200 dark:border-slate-800">

              <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

              <Routes>
                <Route path="/" element={<Home onOpenMenu={toggleMenu} />} />
                <Route path="/services" element={<Services onOpenMenu={toggleMenu} />} />
                <Route path="/experience" element={<Experience onOpenMenu={toggleMenu} />} />
                <Route path="/method" element={<Method onOpenMenu={toggleMenu} />} />
                <Route path="/about" element={<About onOpenMenu={toggleMenu} />} />
                <Route path="/projects" element={<Projects onOpenMenu={toggleMenu} />} />
                <Route path="/contact" element={<Contact onOpenMenu={toggleMenu} />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </div>
          </div>
        </div>
        <AIChatWidget />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
