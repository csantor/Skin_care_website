import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/common/Button';
import { useLanguage } from '../context/LanguageContext';

const Catalog = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', label: t('library.categories.all'), icon: '◈' },
    { name: 'Hydration', label: t('library.categories.hydration'), keywords: ['hydra', 'moistur', 'dew', 'rose', 'olive'] },
    { name: 'Anti-Aging', label: t('library.categories.antiAging'), keywords: ['anti-aging', 'wrinkle', 'reishi', 'platinum', 'gold', 'caviar', 'orchid'] },
    { name: 'Brightening', label: t('library.categories.brightening'), keywords: ['brighten', 'vitamin c', 'rubini', 'gold'] },
    { name: 'Repair', label: t('library.categories.repair'), keywords: ['barrier', 'repair', 'tiger grass', 'kombucha'] },
    { name: 'Cleansers', label: t('library.categories.cleansers'), keywords: ['cleanser', 'wash', 'gel'] }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.metadata?.greek_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    
    // Prioritize database category, fallback to keyword matching
    const matchesCategory = product.category === activeCategory || 
      categories.find(c => c.name === activeCategory)?.keywords?.some(keyword => 
        product.name?.toLowerCase().includes(keyword) || 
        product.description?.toLowerCase().includes(keyword)
      );
    
    return matchesSearch && matchesCategory;
  });

  const { language } = useLanguage();

  return (
    <div className="pt-28 pb-32 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight">
              {t('library.title')} <span className="text-primary italic font-medium">{t('library.titleSpan')}</span>
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-lg">
              {t('library.desc')}
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
              <span className="text-xl">⌕</span>
            </div>
            <input
              type="text"
              placeholder={t('library.searchPlaceholder')}
              className="w-full h-14 pl-12 pr-4 bg-surface-lowest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-on-surface-variant/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs - Organic Asymmetry */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === category.name
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-surface-lowest/50 border border-outline-variant/20 text-on-surface-variant hover:bg-white hover:shadow-md'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-surface-lowest rounded-[2rem] aspect-[4/5]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group relative flex flex-col bg-surface-lowest rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-surface-low to-white">
                {product.metadata?.image_url ? (
                  <img 
                    src={product.metadata.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/10 select-none">
                    <span className="text-9xl font-extrabold italic opacity-20">
                      {product.brand?.[0] || 'BK'}
                    </span>
                  </div>
                )}
                
                {/* Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold tracking-[0.1em] rounded-full shadow-sm z-10">
                   {product.category || 'PREMIUM'}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2 opacity-70">
                  {product.brand}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors min-h-[3.5rem] line-clamp-2">
                  {language === 'el' && product.metadata?.greek_title ? product.metadata.greek_title : product.name}
                </h3>
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-6 font-light leading-relaxed min-h-[4.5rem]">
                  {product.description || t('library.defaultDesc')}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block mb-1">
                      {product.size_ml ? `${product.size_ml}ml` : t('library.scientificFormula')}
                    </span>
                    <span className="text-sm font-bold text-on-surface truncate max-w-[150px] block">
                      {product.metadata?.skin_type || t('library.allSkinTypes')}
                    </span>
                  </div>
                  <button className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-low text-on-surface hover:bg-primary hover:text-white transition-all duration-300 shadow-sm group/btn">
                    <span className="text-xl group-hover/btn:scale-110 transition-transform">ⓘ</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-surface-low rounded-3xl">
          <p className="text-on-surface-variant text-lg">{t('library.noResults')}</p>
          <Button variant="tertiary" className="mt-4" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>{t('library.clearFilters')}</Button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
