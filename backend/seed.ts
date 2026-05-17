import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { categories, products } from './src/db/schema';
import * as schema from './src/db/schema';

const client = createClient({ url: 'file:./local.db' });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Seeding database...\n');

  // --- Categories ---
  console.log('📂 Inserting categories...');
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Electronics',    description: 'Gadgets, devices, and electronic components' },
      { name: 'Clothing',       description: 'Apparel, footwear, and accessories' },
      { name: 'Food & Grocery', description: 'Packaged food, snacks, and daily essentials' },
      { name: 'Stationery',     description: 'Pens, notebooks, and office supplies' },
      { name: 'Home & Kitchen', description: 'Appliances, cookware, and home decor' },
    ])
    .returning();

  const [electronics, clothing, food, stationery, home] = insertedCategories;
  console.log(`  ✅ ${insertedCategories.length} categories created\n`);

  // --- Products ---
  console.log('📦 Inserting products...');
  await db.insert(products).values([
    // Electronics
    { name: 'Wireless Earbuds Pro',     sku: 'ELEC-001', price: '2499.00', quantity: 45,  categoryId: electronics.id, description: 'Noise-cancelling earbuds with 30hr battery life' },
    { name: 'USB-C Hub 7-in-1',         sku: 'ELEC-002', price: '1299.00', quantity: 30,  categoryId: electronics.id, description: '4K HDMI, 3x USB-A, SD card, 100W PD charging' },
    { name: 'Mechanical Keyboard',      sku: 'ELEC-003', price: '3999.00', quantity: 12,  categoryId: electronics.id, description: 'TKL layout, Cherry MX Red switches, RGB backlit' },
    { name: 'Webcam 1080p',             sku: 'ELEC-004', price: '1799.00', quantity: 5,   categoryId: electronics.id, description: 'Full HD 60fps with built-in noise-cancelling mic' },
    { name: 'Laptop Stand Aluminium',   sku: 'ELEC-005', price: '899.00',  quantity: 0,   categoryId: electronics.id, description: 'Adjustable height, compatible with all laptops' },

    // Clothing
    { name: 'Classic White T-Shirt',    sku: 'CLO-001',  price: '399.00',  quantity: 120, categoryId: clothing.id,    description: '100% cotton, unisex, available S-XXL' },
    { name: 'Slim Fit Chinos',          sku: 'CLO-002',  price: '1199.00', quantity: 60,  categoryId: clothing.id,    description: 'Stretch fabric, khaki and olive variants' },
    { name: 'Running Shoes',            sku: 'CLO-003',  price: '2799.00', quantity: 3,   categoryId: clothing.id,    description: 'Lightweight mesh upper, cushioned sole' },
    { name: 'Hoodie - Navy Blue',       sku: 'CLO-004',  price: '899.00',  quantity: 75,  categoryId: clothing.id,    description: 'Fleece lined, kangaroo pocket, drawstring hood' },

    // Food & Grocery
    { name: 'Organic Green Tea (50 bags)', sku: 'FOOD-001', price: '249.00', quantity: 200, categoryId: food.id, description: 'Himalayan single-origin, zero additives' },
    { name: 'Mixed Nuts 500g',          sku: 'FOOD-002',  price: '599.00',  quantity: 85,  categoryId: food.id,        description: 'Cashews, almonds, walnuts, pistachios blend' },
    { name: 'Dark Chocolate 72%',       sku: 'FOOD-003',  price: '149.00',  quantity: 4,   categoryId: food.id,        description: 'Belgian single-origin, 72% cacao, 100g bar' },
    { name: 'Cold Brew Coffee Kit',     sku: 'FOOD-004',  price: '799.00',  quantity: 0,   categoryId: food.id,        description: 'Includes mason jar, filter, 250g ground coffee' },

    // Stationery
    { name: 'Dot Grid Notebook A5',     sku: 'STAT-001', price: '349.00',  quantity: 150, categoryId: stationery.id,  description: '200 pages, 100gsm paper, lay-flat binding' },
    { name: 'Gel Pen Set (10 pack)',    sku: 'STAT-002', price: '199.00',  quantity: 300, categoryId: stationery.id,  description: 'Smooth 0.5mm tip, 10 assorted colours' },
    { name: 'Desk Organiser',           sku: 'STAT-003', price: '699.00',  quantity: 2,   categoryId: stationery.id,  description: 'Bamboo wood, 5 compartments, pen holder' },
    { name: 'Sticky Notes Mega Pack',   sku: 'STAT-004', price: '129.00',  quantity: 500, categoryId: stationery.id,  description: '600 sheets, 6 neon colors, 3 sizes' },

    // Home & Kitchen
    { name: 'Pour Over Coffee Dripper', sku: 'HOME-001', price: '549.00',  quantity: 22,  categoryId: home.id,        description: 'Borosilicate glass, with stainless steel filter' },
    { name: 'Cast Iron Skillet 10"',    sku: 'HOME-002', price: '1499.00', quantity: 18,  categoryId: home.id,        description: 'Pre-seasoned, oven safe up to 260°C' },
    { name: 'Bamboo Cutting Board',     sku: 'HOME-003', price: '399.00',  quantity: 0,   categoryId: home.id,        description: 'Antimicrobial, juice groove, with handle' },
    { name: 'Insulated Water Bottle 1L',sku: 'HOME-004', price: '699.00',  quantity: 55,  categoryId: home.id,        description: 'Triple-wall vacuum, keeps cold 24hr / hot 12hr' },
  ]);

  console.log('  ✅ 21 products created\n');
  console.log('🎉 Seed complete! Open http://localhost:5173 to see your data.');
  client.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
