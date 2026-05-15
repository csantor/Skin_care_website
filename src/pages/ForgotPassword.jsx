import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6">
           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
           PASSWORD RECOVERY
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-4">
          Reset your <span className="text-primary italic font-medium">Access.</span>
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed text-lg">
          Enter your email address and we'll send you a link to regain entry to your vault.
        </p>
      </div>

      <Card tonal className="max-w-md mx-auto w-full p-10 space-y-8 shadow-2xl shadow-primary/5">
        {!resetSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold tracking-widest uppercase text-on-surface-variant" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-surface-low rounded-xl focus:bg-surface-lowest focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="curator@example.com"
              />
            </div>

            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Email Dispatched</h3>
              <p className="text-on-surface-variant text-sm">
                If an account exists for <span className="text-primary font-bold">{email}</span>, you will receive reset instructions shortly.
              </p>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link 
            to="/login"
            className="text-sm font-bold text-primary hover:text-primary-container transition-colors italic hover:underline"
          >
            ⇠ Return to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
