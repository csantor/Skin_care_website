import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product details:', err.message);
      setError('Product not found.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-on-surface-variant">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen text-center">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Product Not Found</h2>
        <p className="text-on-surface-variant mb-8">We couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate('/library')}>Back to Library</Button>
      </div>
    );
  }

  const productName = language === 'el' && product.metadata?.greek_title ? product.metadata.greek_title : product.name;
  const productDesc = product.description || t('library.defaultDesc');

  return (
    <div className="pt-28 pb-32 px-4 max-w-6xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-semibold text-sm tracking-wide uppercase">{t('productDetail.back')}</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Column: Image */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-surface-low to-white shadow-2xl">
            {product.metadata?.image_url ? (
              <img 
                src={product.metadata.image_url} 
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop';
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-primary/10 select-none">
                <span className="text-[12rem] font-extrabold italic opacity-20">
                  {product.brand?.[0] || 'BK'}
                </span>
              </div>
            )}
            
            {product.category && (
              <div className="absolute top-8 left-8 px-5 py-2.5 bg-white/90 backdrop-blur-md text-primary text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-lg z-10">
                {product.category}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4 opacity-80">
            {product.brand}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight mb-6">
            {productName}
          </h1>
          
          <div className="bg-surface-low rounded-[2rem] p-8 mb-8">
            <p className="text-lg text-on-surface-variant font-light leading-relaxed">
              {productDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-surface-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60 block mb-2">{t('productDetail.size')}</span>
              <span className="text-lg font-bold text-on-surface">
                {product.size_ml ? `${product.size_ml} ml` : 'N/A'}
              </span>
            </div>
            <div className="bg-surface-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60 block mb-2">{t('productDetail.skinType')}</span>
              <span className="text-lg font-bold text-on-surface truncate">
                {product.metadata?.skin_type || t('library.allSkinTypes')}
              </span>
            </div>
          </div>

          {/* Flags Section */}
          {(product.metadata?.vegan || product.metadata?.cruelty_free) && (
            <div className="flex gap-4 mb-8">
              {product.metadata.vegan && (
                <span className="px-4 py-1.5 bg-green-100 text-green-800 text-xs font-bold tracking-widest uppercase rounded-full">
                  Vegan
                </span>
              )}
              {product.metadata.cruelty_free && (
                <span className="px-4 py-1.5 bg-purple-100 text-purple-800 text-xs font-bold tracking-widest uppercase rounded-full">
                  Cruelty-Free
                </span>
              )}
            </div>
          )}

          {product.metadata?.ingredients && (
            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{t('productDetail.ingredients')}</h3>
              <p className="text-on-surface-variant leading-relaxed p-6 bg-surface-lowest rounded-3xl border border-outline-variant/10">
                {product.metadata.ingredients}
              </p>
            </div>
          )}

          <div className="flex gap-4">
             <Button variant="primary" className="flex-1 py-4 text-lg shadow-lg shadow-primary/30">
               {t('productDetail.addToRoutine')}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
