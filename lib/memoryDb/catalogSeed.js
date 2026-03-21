/**
 * In-memory catalog seed — no DB. Loaded once per server runtime.
 * SKU, CASE/PC (or none), beverage-aware pricing copy, category from CATEGORIES.
 */
import { CATEGORIES } from "@/lib/constants";

export const SIZE_CASE_PC = [
  { value: "case", label: "CASE" },
  { value: "pc", label: "PC" },
];

const IMAGES = {
  meat: [
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=640&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=640&q=80",
    "https://images.unsplash.com/photo-1602470520998-f4a60889a0e5?w=640&q=80",
    "https://images.unsplash.com/photo-1558030006-450675393462?w=640&q=80",
  ],
  seafood: [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=640&q=80",
    "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=640&q=80",
  ],
  dairy: [
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=640&q=80",
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=640&q=80",
  ],
  cheese: [
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=640&q=80",
    "https://images.unsplash.com/photo-1452195100486-5cc5c45b4543?w=640&q=80",
  ],
  oil: [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=640&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=80",
  ],
  bake: [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=80",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=640&q=80",
  ],
  produce: [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=640&q=80",
    "https://images.unsplash.com/photo-1540420773420-3362872f4999?w=640&q=80",
  ],
  frozen: [
    "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=640&q=80",
    "https://images.unsplash.com/photo-1497534547325-281cb4009e56?w=640&q=80",
  ],
  pantry: [
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&q=80",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=640&q=80",
  ],
  beverage: [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=640&q=80",
    "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=640&q=80",
  ],
  meal: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=640&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&q=80",
  ],
  supplies: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=640&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=640&q=80",
  ],
};

const TITLES = {
  "whats-new": [
    "Prime Ribeye Steaks, 4 × 12oz",
    "Boneless Pork Loin, 2 × 5lb",
    "Wild Salmon Fillet, 3lb",
    "Heirloom Tomato Case",
  ],
  "meat-poultry": [
    "Angus Ground Beef, 80/20 — 10lb case",
    "Whole Chicken, air-chilled — 6ct",
    "Lamb Rack Frenched, 2 racks",
    "Duck Breast, Maple Leaf — 4ct",
  ],
  "dairy-eggs": [
    "Whole Milk 1gal — 4 per case",
    "Heavy Cream 32oz — 12ct",
    "Large Eggs, AA — 15dz case",
    "Unsalted Butter 1lb — 36ct",
  ],
  "cheese-charcuterie": [
    "Parmigiano Reggiano wedge, 8oz",
    "Prosciutto di Parma, sliced 3oz",
    "Aged Cheddar block, 5lb",
    "Salami Napoli chub, 3lb",
  ],
  "oils-vinegars": [
    "Extra Virgin Olive Oil 3L tin",
    "Aged Balsamic 500ml — 12 per case",
    "Grapeseed Oil 1gal — 4ct",
    "Red Wine Vinegar 750ml — 12ct",
  ],
  "baking-pastry": [
    "Bread Flour 25lb bag",
    "European Butter sheets, 20lb",
    "Dark Chocolate callets, 5kg",
    "Vanilla extract 32oz — 6ct",
  ],
  produce: [
    "Romaine Hearts — 24ct case",
    "Fingerling Potatoes, 10lb",
    "Brussels Sprouts, 5lb",
    "Baby Carrots, foodservice bag",
  ],
  frozen: [
    "Peas & Carrots blend, 12 × 2lb",
    "Mixed Berries IQF, 5lb",
    "French Fries 3/8\", 6 × 5lb",
    "Spinach chopped, 4 × 2.5lb",
  ],
  seafood: [
    "Atlantic Cod Loins, 10lb case",
    "Shrimp 16/20 peeled, 5lb",
    "Scallops U-10 dry, 2lb",
    "Tuna steak #1, 4 × 2lb",
  ],
  pantry: [
    "Tomato paste #10, 6 per case",
    "Sparkling water 500ml — 24ct",
    "Cola 12oz cans — 24pk",
    "Chicken base 1lb — 12 jars",
  ],
  supplies: [
    "Gloves nitrile L — 10 boxes/cs",
    "Parchment full sheet — 1000/cs",
    "Takeout containers 9x9 — 200/cs",
    "Chef knife 10\" — each",
  ],
  "family-meal-specials": [
    "Sunday Roast bundle — serves 6",
    "Taco night kit — 8 servings",
    "BBQ rib pack — 3 racks",
    "Breakfast bundle — 12 servings",
  ],
};

function imagePoolForCategory(slug, isBeverage) {
  if (isBeverage) return IMAGES.beverage;
  if (slug === "whats-new" || slug === "meat-poultry" || slug === "family-meal-specials")
    return IMAGES.meat;
  if (slug === "seafood") return IMAGES.seafood;
  if (slug === "dairy-eggs") return IMAGES.dairy;
  if (slug === "cheese-charcuterie") return IMAGES.cheese;
  if (slug === "oils-vinegars") return IMAGES.oil;
  if (slug === "baking-pastry") return IMAGES.bake;
  if (slug === "produce") return IMAGES.produce;
  if (slug === "frozen") return IMAGES.frozen;
  if (slug === "pantry") return IMAGES.pantry;
  if (slug === "supplies") return IMAGES.supplies;
  return IMAGES.meat;
}

function skuCode(slug, index) {
  const part = slug
    .replace(/[^a-z]/gi, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  return `JS-${part}-${String(index + 1).padStart(4, "0")}`;
}

/**
 * @param {boolean} isBeverage
 * @param {boolean} hasCasePc
 */
function pricingFor(isBeverage, hasCasePc, seed) {
  const s = seed % 7;
  if (!hasCasePc) {
    const price = 12.99 + s * 3.5;
    return {
      price: Math.round(price * 100) / 100,
      unitPrice: isBeverage ? "/ bottle" : "/ lb",
      netWeight: isBeverage ? "Single unit" : "Net Weight: sold by weight",
      priceBySize: undefined,
      sizeOptions: [],
      defaultSize: "case",
    };
  }

  if (isBeverage) {
    const caseP = 28.99 + s * 2;
    const pcP = 1.29 + (s % 3) * 0.15;
    return {
      price: Math.round(caseP * 100) / 100,
      unitPrice: "/ case",
      netWeight: "24 × 12 fl oz per case",
      sizeOptions: SIZE_CASE_PC,
      defaultSize: "case",
      priceBySize: {
        case: {
          price: Math.round(caseP * 100) / 100,
          unitPrice: "/ case (~$" + (caseP / 24).toFixed(2) + " / bottle)",
          netWeight: "24 bottles per case",
        },
        pc: {
          price: Math.round(pcP * 100) / 100,
          unitPrice: "/ bottle (12 fl oz)",
          netWeight: "1 bottle",
        },
      },
    };
  }

  const caseP = 48.99 + s * 8;
  const pcP = 12.49 + s * 1.2;
  return {
    price: Math.round(caseP * 100) / 100,
    unitPrice: "/ case avg lb price",
    netWeight: "4 × 15 lb per case (60 lb total)",
    sizeOptions: SIZE_CASE_PC,
    defaultSize: "case",
    priceBySize: {
      case: {
        price: Math.round(caseP * 100) / 100,
        unitPrice: "/ " + (caseP / 60).toFixed(3) + " lb (case)",
        netWeight: "60 lb case (4 × 15 lb)",
      },
      pc: {
        price: Math.round(pcP * 100) / 100,
        unitPrice: "/ " + (pcP / 15).toFixed(3) + " lb (one 15 lb piece)",
        netWeight: "15 lb — 1 piece from case",
      },
    },
  };
}

export function buildCatalogProducts() {
  const out = [];

  for (const cat of CATEGORIES) {
    const slug = cat.slug;
    const titles = TITLES[slug] ?? [`${cat.name} Item ${1}`, `${cat.name} Item 2`];
    const count = Math.min(4, titles.length);

    for (let i = 0; i < count; i++) {
      const title = titles[i] ?? `${cat.name} selection ${i + 1}`;
      const pSlug = `${slug}-${i + 1}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

      const isBeverage =
        (slug === "pantry" && (i === 1 || i === 2)) ||
        (slug === "oils-vinegars" && i === 3);

      const hasCasePc = slug !== "supplies" || i < 3;

      const pool = imagePoolForCategory(slug, isBeverage);
      const useImage = (slug === "supplies" && i === 3) ? "" : pool[i % pool.length];

      const pricing = pricingFor(isBeverage, hasCasePc, i + slug.length);

      out.push({
        id: `cat-${pSlug}`,
        sku: skuCode(slug, out.length),
        slug: pSlug,
        title,
        categorySlug: slug,
        categoryLabel: cat.name,
        vendor: isBeverage ? "BEVCO DISTRIBUTING" : "JULIUS SILVERT",
        isBeverage,
        imageSrc: useImage,
        imageAlt: title,
        footerMode: "quantity",
        ...pricing,
      });
    }
  }

  return out;
}
