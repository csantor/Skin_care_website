import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/onboarding');
      } else {
        const { error } = await signUp({ email, password });
        if (error) throw error;
        // Depending on Supabase settings, email confirmation might be needed
        alert('Check your email for the confirmation link!');
      }
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
           SECURE ACCESS
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-4">
          Enter the <span className="text-primary italic font-medium">Vault.</span>
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed text-lg">
          {isLogin ? "Welcome back to your curated skincare journey." : "Begin your bespoke editorial skincare experience."}
        </p>
      </div>

      <Card tonal className="max-w-md mx-auto w-full p-10 space-y-8 shadow-2xl shadow-primary/5">
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
          
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-widest uppercase text-on-surface-variant" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-surface-low rounded-xl focus:bg-surface-lowest focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
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
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-primary hover:text-primary-container transition-colors italic hover:underline"
          >
            {isLogin ? 'Need an invitation? Sign up ⇢' : 'Already have access? Sign in ⇢'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
