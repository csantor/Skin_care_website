import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center text-white text-xl animate-spin">
          ◈
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6">
           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
           YOUR PROFILE
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4">
          Bespoke <span className="text-primary italic font-medium">Curation.</span>
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed text-lg">
          Your personal skin diagnostics and curated morning ritual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Diagnostics Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card tonal className="p-8 space-y-6">
            <h3 className="font-bold text-xl tracking-tight">Diagnostics</h3>
            
            {!profile ? (
              <div className="space-y-4 text-center py-6">
                <p className="text-on-surface-variant text-sm">You haven't completed your skin profile yet.</p>
                <Button variant="primary" onClick={() => navigate('/onboarding')} className="w-full">
                  Start Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Skin Type</h4>
                  <p className="font-medium text-on-surface">{profile.skin_type || 'Unspecified'}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Concerns</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.concerns && profile.concerns.length > 0 ? (
                      profile.concerns.map(c => (
                        <span key={c} className="px-3 py-1 bg-surface-lowest rounded-full text-xs font-bold">{c}</span>
                      ))
                    ) : (
                      <span className="text-on-surface-variant text-sm">None selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Environment</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.lifestyle && profile.lifestyle.length > 0 ? (
                      profile.lifestyle.map(l => (
                        <span key={l} className="px-3 py-1 bg-surface-lowest rounded-full text-xs font-bold">{l}</span>
                      ))
                    ) : (
                      <span className="text-on-surface-variant text-sm">None selected</span>
                    )}
                  </div>
                </div>
                
                <Button variant="tertiary" onClick={() => navigate('/onboarding')} className="w-full mt-4">
                  Retake Analysis
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Saved Routine */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-none bg-surface-lowest h-full">
            <h3 className="font-bold text-2xl tracking-tight mb-8">Curated Ritual</h3>
            
            {!profile?.saved_routine || profile.saved_routine.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-on-surface-variant text-4xl mb-2">✧</div>
                <p className="text-on-surface-variant">Your ritual awaits synthesis.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.saved_routine.map((product, idx) => (
                  <div key={product.id || idx} className="flex gap-6 p-4 rounded-2xl hover:bg-surface-low transition-colors group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-low flex-shrink-0">
                      <img 
                        src={product.metadata?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{product.routine_type}</span>
                        <span className="text-xs font-bold text-on-surface-variant">Step 0{idx + 1}</span>
                      </div>
                      <h4 className="font-bold text-lg leading-tight mb-1">{product.name}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{product.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
