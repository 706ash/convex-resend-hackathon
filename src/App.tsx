import React from 'react';
import { Navigation } from './components/layout/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import { Dashboard } from './components/pages/Dashboard';
import { ToastProvider } from './components/ui/Toast';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'dashboard'>('home');

  if (currentPage === 'dashboard') {
    return (
      <>
        <div className="min-h-screen bg-slate-900">
          <Navigation onNavigate={setCurrentPage} />
          <Dashboard />
        </div>
        <ToastProvider />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900">
        <Navigation onNavigate={setCurrentPage} />
        <HeroSection />
      </div>
      <ToastProvider />
    </>
  );
}

export default App;