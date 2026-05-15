import { supabase } from './supabaseClient';

/**
 * Maps user concerns to product categories and keywords
 */
const CONCERN_MAP = {
  'Acne': { categories: ['Skincare', 'Cleansers'], keywords: ['salicylic', 'acne', 'blemish', 'pore', 'effaclar'] },
  'Aging': { categories: ['Anti-Aging', 'Hydration'], keywords: ['retinol', 'peptide', 'collagen', 'wrinkle', 'lift'] },
  'Dullness': { categories: ['Brightening', 'Hydration'], keywords: ['vitamin c', 'brighten', 'glow', 'radiance'] },
  'Redness': { categories: ['Repair', 'Hydration'], keywords: ['centella', 'cica', 'calm', 'soothe', 'panthenol'] },
  'Dehydration': { categories: ['Hydration'], keywords: ['hyaluronic', 'water', 'moistur', 'dewy'] }
};

/**
 * The Curator Engine
 * Takes user profile data and returns a structured routine
 */
export async function generateRecommendations(profile) {
  const { skin_type, concerns = [], lifestyle = [] } = profile;

  try {
    // 1. Fetch products that match the skin type (or all skin types)
    // We use a broader search first and then filter
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    // 2. Scoring System
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      const metadata = product.metadata || {};
      const productSkinType = (metadata.skin_type || '').toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      const productName = (product.name || '').toLowerCase();
      const productCategory = (product.category || '');

      // Skin Type Matching (Critical)
      // Oily -> Λιπαρή
      // Dry -> Ξηρή
      // Sensitive -> Ευαίσθητη
      // Combination -> Μικτή
      const skinTypeMap = {
        'Oily': ['λιπαρή', 'oily'],
        'Dry': ['ξηρή', 'dry'],
        'Sensitive': ['ευαίσθητη', 'sensitive'],
        'Combination': ['μικτή', 'combination']
      };

      const targetTerms = skinTypeMap[skin_type] || [];
      const isMatch = targetTerms.some(term => productSkinType.includes(term)) || productSkinType.includes('όλοι');
      
      if (!isMatch) return { ...product, score: -1 }; // Disqualify if doesn't match skin type at all

      score += 10; // Base score for correct skin type

      // Concern Matching
      concerns.forEach(concern => {
        const mapping = CONCERN_MAP[concern];
        if (!mapping) return;

        // Category match
        if (mapping.categories.includes(productCategory)) {
          score += 5;
        }

        // Keyword match
        mapping.keywords.forEach(keyword => {
          if (productDesc.includes(keyword) || productName.includes(keyword)) {
            score += 3;
          }
        });
      });

      // Lifestyle / Environmental adjustment
      if (lifestyle.includes('Urban Pollution') && (productDesc.includes('pollution') || productDesc.includes('antioxidant'))) {
        score += 4;
      }

      return { ...product, score };
    });

    // 3. Filter and Categorize
    const validProducts = scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    // Build a basic routine: Cleanser, Serum, Treatment/Moisturizer
    const routine = {
      cleanser: validProducts.find(p => p.category === 'Cleansers' || p.name.toLowerCase().includes('wash') || p.name.toLowerCase().includes('clean')),
      serum: validProducts.find(p => (p.name.toLowerCase().includes('serum') || p.name.toLowerCase().includes('booster')) && !p.name.toLowerCase().includes('eye')),
      treatment: validProducts.find(p => p.category === 'Anti-Aging' || p.category === 'Repair' || p.category === 'Brightening'),
      moisturizer: validProducts.find(p => p.name.toLowerCase().includes('cream') || p.name.toLowerCase().includes('waterbomb'))
    };

    // Fallback logic if any are missing
    if (!routine.cleanser) routine.cleanser = validProducts[0];
    if (!routine.serum) routine.serum = validProducts[1];
    if (!routine.moisturizer) routine.moisturizer = validProducts[2];

    return Object.entries(routine)
      .filter(([_, val]) => !!val)
      .map(([type, product]) => ({ ...product, routine_type: type }));

  } catch (err) {
    console.error('Curator error:', err);
    return [];
  }
}
