import fs from 'fs';

// Configuration
const MARKDOWN_FILE = 'C:/Users/christodoulos.santor/.gemini/antigravity/brain/046d469e-ae5a-4821-be2d-4c47ecb01c4d/.system_generated/steps/100/content.md';

function parsePrice(priceStr) {
    if (!priceStr) return null;
    let cleaned = priceStr.replace(',', '.').replace(/[^\d.]/g, '');
    return parseFloat(cleaned);
}

async function extract() {
    console.log('Reading markdown file...');
    const content = fs.readFileSync(MARKDOWN_FILE, 'utf-8');

    // Find all prices in the file
    const priceRegex = /([\d,\.]+)\s*€/g;
    let match;
    const productsByUrl = new Map();

    while ((match = priceRegex.exec(content)) !== null) {
        const priceStr = match[1];
        const pricePos = match.index;
        const price = parsePrice(priceStr);
        if (price === 0) continue;

        // Look backwards for the nearest URL
        const lookBack = content.substring(Math.max(0, pricePos - 1000), pricePos);
        const urlMatches = [...lookBack.matchAll(/https:\/\/www\.lavieenrose\.com\.gr\/el\/([^\s\)\?\"\'\>]+)/g)];
        const urlMatch = urlMatches.pop();
        
        if (urlMatch) {
            const url = urlMatch[0];
            const slug = urlMatch[1];
            
            if (slug.includes('category/') || slug.includes('page/') || slug.includes('customer/') || slug.includes('cart') || slug.includes('contact') || slug === 'el') continue;

            const nameArea = content.substring(Math.max(0, pricePos - 500), Math.min(content.length, pricePos + 100));
            const nameMatch = nameArea.match(/\[([^\]<>]{3,100})\]/);
            let name = nameMatch ? nameMatch[1] : slug.replace(/-/g, ' ');
            name = name.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

            // Check if this price is a "Special Price" (Ειδική Τιμή)
            // Or if it's the second price in a "Original Special" sequence
            const immediateLookBack = content.substring(Math.max(0, pricePos - 50), pricePos);
            const isSpecial = /Ειδική\s*Τιμή/i.test(immediateLookBack) || (productsByUrl.has(url) && pricePos - productsByUrl.get(url).lastPos < 50);

            if (!productsByUrl.has(url) || isSpecial) {
                productsByUrl.set(url, {
                    name,
                    url,
                    price,
                    brand: 'La Vie en Rose',
                    size_ml: (name.match(/(\d+)\s*ml/i) || [])[1] || null,
                    lastPos: pricePos
                });
            }
        }
    }

    const finalProducts = Array.from(productsByUrl.values());
    console.log(`Extracted ${finalProducts.length} products.`);

    const sql = finalProducts.map(p => {
        const metadata = JSON.stringify({
            url: p.url,
            scraped_at: new Date().toISOString()
        }).replace(/'/g, "''");
        
        return `INSERT INTO public.products (name, brand, price, currency, size_ml, metadata) 
                VALUES ('${p.name.replace(/'/g, "''")}', '${p.brand}', ${p.price}, 'EUR', ${p.size_ml || 'NULL'}, '${metadata}')
                ON CONFLICT ((metadata->>'url')) DO UPDATE 
                SET price = EXCLUDED.price, 
                    metadata = EXCLUDED.metadata,
                    updated_at = NOW();`;
    }).join('\n');
    
    fs.writeFileSync('insert_products.sql', sql);
}

extract().catch(console.error);
