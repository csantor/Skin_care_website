const fs = require('fs');
const path = require('path');

// Configuration
const CSV_FILE = 'Caudalie Vinopure Serum Προσώπου 30ml _ Skroutz.gr(1).csv';
const OUTPUT_SQL = 'import_products.sql';

function parseCSV(content) {
  const lines = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentField.trim());
        if (currentRow.length > 1 || currentRow[0] !== '') {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  // Add the last field if file doesn't end with newline
  if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      lines.push(currentRow);
  }
  return lines;
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim().replace(/'/g, "''");
}

function extractBrand(title) {
  if (!title) return 'Unknown';
  // Common multi-word brands
  const multiWordBrands = ['Beauty of Joseon', 'La Vie En Rose', 'The Ordinary', 'La Roche-Posay'];
  for (const b of multiWordBrands) {
    if (title.startsWith(b)) return b;
  }
  return title.split(' ')[0];
}

function parseVolume(volumeStr) {
  if (!volumeStr) return null;
  const match = volumeStr.match(/(\d+)\s*ml/i);
  return match ? parseInt(match[1]) : null;
}

function mapCategory(usage) {
  if (!usage) return 'General';
  const u = usage.toLowerCase();
  if (u.includes('ενυδάτωση') || u.includes('hydration')) return 'Hydration';
  if (u.includes('αντιγήρανση') || u.includes('anti-aging')) return 'Anti-Aging';
  if (u.includes('λάμψη') || u.includes('brighten')) return 'Brightening';
  if (u.includes('επανόρθωση') || u.includes('repair')) return 'Repair';
  if (u.includes('καθαρισμ') || u.includes('cleanse')) return 'Cleansers';
  return 'Skincare';
}

function run() {
  const fullPath = path.join(process.cwd(), CSV_FILE);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const rows = parseCSV(content);
  
  // Headers: ProductTitle(0), Title(1), Description(2), UseArea(3), Usage(4), Drastic Ingredient(5), SkinType(6), ... Volume(10), Vegan(11), Cruelty-free(12), Image_URL(13)
  const products = rows.slice(1).map(row => {
    const name = cleanText(row[0]);
    if (!name) return null;

    const brand = extractBrand(name);
    const description = cleanText(row[2]);
    const size_ml = parseVolume(row[10]);
    const category = mapCategory(row[4]);
    const targetArea = cleanText(row[3]).includes('Πρόσωπο') ? '{face}' : '{body}';
    
    const metadata = {
      greek_title: cleanText(row[1]),
      ingredients: cleanText(row[5]),
      skin_type: cleanText(row[6]),
      vegan: cleanText(row[11]) === 'Ναι',
      cruelty_free: cleanText(row[12]) === 'Ναι',
      image_url: cleanText(row[13]),
      source: 'Skroutz CSV'
    };

    return {
      name,
      brand,
      description,
      size_ml,
      category,
      targetArea,
      metadata: JSON.stringify(metadata)
    };
  }).filter(p => p !== null);

  console.log(`Parsed ${products.length} products.`);

  let sql = 'INSERT INTO public.products (name, brand, description, size_ml, category, target_area, metadata)\nVALUES\n';
  
  const valueChunks = products.map(p => 
    `('${p.name}', '${p.brand}', '${p.description}', ${p.size_ml || 'NULL'}, '${p.category}', '${p.targetArea}', '${p.metadata}')`
  );

  // We'll write in chunks of 100 to avoid massive SQL strings
  const CHUNK_SIZE = 100;
  let finalSql = '';
  
  for (let i = 0; i < valueChunks.length; i += CHUNK_SIZE) {
    const chunk = valueChunks.slice(i, i + CHUNK_SIZE);
    finalSql += `INSERT INTO public.products (name, brand, description, size_ml, category, target_area, metadata)\nVALUES\n` + 
                chunk.join(',\n') + 
                ` ON CONFLICT (name) DO UPDATE SET \n` +
                ` brand = EXCLUDED.brand, description = EXCLUDED.description, size_ml = EXCLUDED.size_ml, \n` +
                ` category = EXCLUDED.category, target_area = EXCLUDED.target_area, metadata = EXCLUDED.metadata;\n\n`;
  }

  fs.writeFileSync(OUTPUT_SQL, finalSql);
  console.log(`SQL script generated: ${OUTPUT_SQL}`);
}

run();
