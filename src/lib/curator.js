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

    // Build a unique routine
    const usedIds = new Set();
    const routineSlots = [
      { 
        key: 'cleanser', 
        filter: p => p.category === 'Cleansers' || p.name.toLowerCase().includes('wash') || p.name.toLowerCase().includes('clean') 
      },
      { 
        key: 'serum', 
        filter: p => (p.name.toLowerCase().includes('serum') || p.name.toLowerCase().includes('booster')) && !p.name.toLowerCase().includes('eye') 
      },
      { 
        key: 'treatment', 
        filter: p => ['Anti-Aging', 'Repair', 'Brightening'].includes(p.category) 
      },
      { 
        key: 'moisturizer', 
        filter: p => p.name.toLowerCase().includes('cream') || p.name.toLowerCase().includes('waterbomb') 
      }
    ];

    const finalRoutine = [];

    // First pass: Try to fill slots with matching unique products
    routineSlots.forEach(slot => {
      const match = validProducts.find(p => slot.filter(p) && !usedIds.has(p.id));
      if (match) {
        usedIds.add(match.id);
        finalRoutine.push({ ...match, routine_type: slot.key });
      }
    });

    // Second pass: If we don't have enough products (e.g. 3), fill with best remaining
    if (finalRoutine.length < 3) {
      validProducts.forEach(p => {
        if (finalRoutine.length < 3 && !usedIds.has(p.id)) {
          usedIds.add(p.id);
          finalRoutine.push({ ...p, routine_type: 'essential' });
        }
      });
    }

    return finalRoutine;

  } catch (err) {
    console.error('Curator error:', err);
    return [];
  }
}
