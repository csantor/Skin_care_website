import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import ProductHistory from './pages/ProductHistory';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  return (
      <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <ProductHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="/library" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>

          {/* Editorial Footer */}
          <footer className="mt-24 py-12 px-4 bg-surface-low border-none">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-manrope font-extrabold text-xl tracking-tighter">
                  SKIN <span className="text-primary font-medium italic">advisor</span>
                </span>
                <p className="text-on-surface-variant text-sm italic" dangerouslySetInnerHTML={{ __html: t('footer.copy') }}></p>
              </div>

              <div className="flex gap-12">
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-primary">{t('footer.science')}</h4>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="hover:text-primary cursor-pointer transition-colors">Test</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">AI Diagnostics</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Clinical Trials</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-primary">{t('footer.journal')}</h4>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="hover:text-primary cursor-pointer transition-colors">Morning Clarity</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">The Glass Texture</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Bespoke Rituals</li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
      </AuthProvider>
  );
}

export default App;
