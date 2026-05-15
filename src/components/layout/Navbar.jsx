import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassContainer from '../common/GlassContainer';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <GlassContainer className="max-w-7xl mx-auto rounded-full flex items-center justify-between px-6 py-2 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white font-bold text-xs ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
            ΒΚ
          </div>
          <span className="font-manrope font-extrabold text-lg tracking-tight text-on-surface">
            {t('nav.heroTag').split(' ')[0]} <span className="text-primary font-medium italic">{t('nav.heroTag').split(' ')[2] || 'κρέμα'}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-on-surface-variant font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
          <Link to="/profile" className="text-on-surface-variant font-medium hover:text-primary transition-colors">{t('nav.profile')}</Link>
          <Link to="/history" className="text-on-surface-variant font-medium hover:text-primary transition-colors">{t('nav.history')}</Link>
          <Link to="/library" className="text-on-surface-variant font-medium hover:text-primary transition-colors">{t('nav.library')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to="/profile" className="hidden md:block text-xs font-bold text-on-surface-variant truncate max-w-[100px] hover:text-primary transition-colors">
                {user.email}
              </Link>
              <Button variant="tertiary" className="hidden sm:block" onClick={handleLogout}>{t('nav.logout')}</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="tertiary" className="hidden sm:block">{t('nav.login')}</Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" className="text-sm px-6 py-2 shadow-lg shadow-primary/20">{t('nav.getStarted')}</Button>
              </Link>
            </>
          )}
        </div>
      </GlassContainer>
    </header>
  );
};

export default Navbar;
