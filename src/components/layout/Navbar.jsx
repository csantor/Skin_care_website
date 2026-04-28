import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassContainer from '../common/GlassContainer';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
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
            ΒΡΕΣ <span className="text-primary font-medium italic">κρέμα</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-on-surface-variant font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/profile" className="text-on-surface-variant font-medium hover:text-primary transition-colors">Skin Profile</Link>
          <Link to="/history" className="text-on-surface-variant font-medium hover:text-primary transition-colors">History</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:block text-xs font-bold text-on-surface-variant truncate max-w-[100px]">
                {user.email}
              </span>
              <Button variant="tertiary" className="hidden sm:block" onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="tertiary" className="hidden sm:block">Log In</Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" className="text-sm px-6 py-2 shadow-lg shadow-primary/20">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </GlassContainer>
    </header>
  );
};

export default Navbar;
