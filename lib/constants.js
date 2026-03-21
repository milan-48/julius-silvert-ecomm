/**
 * Static data for Julius Silvert e-commerce store
 */

export const SITE_CONFIG = {
  name: "Julius Silvert",
  estYear: "1915",
};

export const ANNOUNCEMENT = {
  greeting: "Hi! Milan Hasmukhbhai Patel",
  message: "Let us know if you need help with your order.",
  helpLink: "#",
  orderGuideLink: "#",
};

/**
 * Category IA + drawer copy from your legacy screenshots.
 * Top-level `label` = bar (our theme); column links/headings = screenshot wording.
 */
export const NAV_LINKS = [
  { id: "whats-new", label: "What's New", href: "/whats-new" },
  {
    id: "meat-poultry",
    label: "Meat & Poultry",
    href: "/meat-poultry",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Carved Meat Co.", href: "/meat-poultry/carved-meat-co" },
            { label: "Beef", href: "/meat-poultry/beef" },
            { label: "Wagyu", href: "/meat-poultry/wagyu" },
            { label: "Burgers & Grinds", href: "/meat-poultry/burgers-grinds" },
            { label: "Hot Dogs & Sausage", href: "/meat-poultry/hot-dogs-sausage" },
            { label: "Deli", href: "/meat-poultry/deli" },
          ],
        },
        {
          links: [
            { label: "Bacon", href: "/meat-poultry/bacon" },
            { label: "Chicken", href: "/meat-poultry/chicken" },
            { label: "Duck, Foie Gras & Pâté", href: "/meat-poultry/duck-foie-pate" },
            { label: "Game", href: "/meat-poultry/game" },
            { label: "Lamb", href: "/meat-poultry/lamb" },
            { label: "Pork", href: "/meat-poultry/pork" },
          ],
        },
        {
          links: [
            { label: "Turkey", href: "/meat-poultry/turkey" },
            { label: "Veal", href: "/meat-poultry/veal" },
            { label: "Charcuterie & Salumi", href: "/meat-poultry/charcuterie-salumi" },
            { label: "Plant Based Meat", href: "/meat-poultry/plant-based" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL MEAT & POULTRY", href: "/meat-poultry" },
    },
  },
  {
    id: "dairy-eggs",
    label: "Dairy & Eggs",
    href: "/dairy-eggs",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Butter", href: "/dairy-eggs/butter" },
            { label: "Eggs", href: "/dairy-eggs/eggs" },
            { label: "Milk & Cream", href: "/dairy-eggs/milk-cream" },
            { label: "Dairy Alternatives", href: "/dairy-eggs/alternatives" },
            { label: "Yogurt & Sour Cream", href: "/dairy-eggs/yogurt-sour-cream" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL DAIRY & EGGS", href: "/dairy-eggs" },
    },
  },
  {
    id: "cheese-charcuterie",
    label: "Cheese & Charcuterie",
    href: "/cheese-charcuterie",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Blue", href: "/cheese-charcuterie/blue" },
            { label: "Brie & Triple Crème", href: "/cheese-charcuterie/brie-triple-creme" },
            { label: "Cheddars & Jacks", href: "/cheese-charcuterie/cheddars-jacks" },
            { label: "Cream Cheese", href: "/cheese-charcuterie/cream-cheese" },
            { label: "Deli Style", href: "/cheese-charcuterie/deli-style" },
            { label: "Feta & Greek", href: "/cheese-charcuterie/feta-greek" },
          ],
        },
        {
          links: [
            { label: "Fresh, Spreads & Crumbly", href: "/cheese-charcuterie/fresh-spreads-crumbly" },
            { label: "Goat", href: "/cheese-charcuterie/goat" },
            { label: "Goudas", href: "/cheese-charcuterie/goudas" },
            { label: "Mexican Cheese", href: "/cheese-charcuterie/mexican" },
            { label: "Italian Style", href: "/cheese-charcuterie/italian-style" },
            { label: "Mozzarella & Burrata", href: "/cheese-charcuterie/mozzarella-burrata" },
          ],
        },
        {
          links: [
            { label: "Plant Based", href: "/cheese-charcuterie/plant-based" },
            { label: "Smoked & Flavored", href: "/cheese-charcuterie/smoked-flavored" },
            { label: "Spanish Style", href: "/cheese-charcuterie/spanish-style" },
            { label: "Swiss & Alpine", href: "/cheese-charcuterie/swiss-alpine" },
            { label: "Charcuterie & Salumi", href: "/cheese-charcuterie/charcuterie-salumi" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL CHEESE & CHARCUTERIE", href: "/cheese-charcuterie" },
    },
  },
  {
    id: "oils-vinegars",
    label: "Oils & Vinegars",
    href: "/oils-vinegars",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Extra Virgin Olive Oils", href: "/oils-vinegars/extra-virgin-olive-oils" },
            { label: "Frying Oils", href: "/oils-vinegars/frying-oils" },
            { label: "Canola & Vegetable Oils", href: "/oils-vinegars/canola-vegetable" },
            { label: "Flavored Oils", href: "/oils-vinegars/flavored-oils" },
            { label: "Nuts & Seed Oils", href: "/oils-vinegars/nuts-seed-oils" },
            { label: "Pure & Blended Oils", href: "/oils-vinegars/pure-blended-oils" },
          ],
        },
        {
          links: [
            { label: "Shortening & Spray Oils", href: "/oils-vinegars/shortening-spray" },
            { label: "Balsamic & Vincotto", href: "/oils-vinegars/balsamic-vincotto" },
            { label: "Rice Vinegars", href: "/oils-vinegars/rice-vinegars" },
            { label: "Wine, Cider & Malt Vinegars", href: "/oils-vinegars/wine-cider-malt-vinegars" },
            { label: "Flavored Vinegars", href: "/oils-vinegars/flavored-vinegars" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL OILS & VINEGARS", href: "/oils-vinegars" },
    },
  },
  {
    id: "baking-pastry",
    label: "Baking & Pastry",
    href: "/baking-pastry",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Baking Fats", href: "/baking-pastry/baking-fats" },
            { label: "Bread", href: "/baking-pastry/bread" },
            { label: "Chocolate", href: "/baking-pastry/chocolate" },
            { label: "Dough, Shells & Pastry", href: "/baking-pastry/dough-shells-pastry" },
            { label: "Extracts & Flavoring", href: "/baking-pastry/extracts-flavoring" },
            { label: "Finished Desserts & Cookies", href: "/baking-pastry/finished-desserts-cookies" },
          ],
        },
        {
          links: [
            { label: "Flour & Mixes", href: "/baking-pastry/flour-mixes" },
            { label: "Honey, Molasses & Syrups", href: "/baking-pastry/honey-molasses-syrups" },
            { label: "Ingredients, Fillings & Glazes", href: "/baking-pastry/ingredients-fillings-glazes" },
            { label: "Leaveners & Stabilizers", href: "/baking-pastry/leaveners-stabilizers" },
            { label: "Nuts, Dried Fruits & Seeds", href: "/baking-pastry/nuts-dried-fruits-seeds" },
            { label: "Sugar & Substitutes", href: "/baking-pastry/sugar-substitutes" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL BAKING & PASTRY", href: "/baking-pastry" },
    },
  },
  {
    id: "produce",
    label: "Produce",
    href: "/produce",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Lettuce", href: "/produce/lettuce" },
            { label: "Onions, Shallots & Leeks", href: "/produce/onions-shallots-leeks" },
            { label: "Tomatoes", href: "/produce/tomatoes" },
            { label: "Root & Bulb Vegetables", href: "/produce/root-bulb" },
            { label: "Leafy Greens & Brassicas", href: "/produce/leafy-greens-brassicas" },
          ],
        },
        {
          links: [
            { label: "Garlic, Herbs & Spices", href: "/produce/garlic-herbs-spices" },
            { label: "Peppers, Eggplants & Squash", href: "/produce/peppers-eggplants-squash" },
            { label: "Beans & Sprouts", href: "/produce/beans-sprouts" },
            { label: "Mushrooms", href: "/produce/mushrooms" },
            { label: "Specialty & Seasonal Vegetables", href: "/produce/specialty-seasonal-vegetables" },
            { label: "Citrus", href: "/produce/citrus" },
          ],
        },
        {
          links: [
            { label: "Tropical", href: "/produce/tropical" },
            { label: "Berries", href: "/produce/berries" },
            { label: "Orchard", href: "/produce/orchard" },
            { label: "Stone", href: "/produce/stone" },
            { label: "Vineyard", href: "/produce/vineyard" },
            { label: "Seasonal Fruit", href: "/produce/seasonal-fruit" },
          ],
        },
        {
          links: [{ label: "Avocado", href: "/produce/avocado" }],
        },
      ],
      viewAll: { label: "VIEW ALL PRODUCE", href: "/produce" },
    },
  },
  {
    id: "frozen",
    label: "Frozen",
    href: "/frozen",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Appetizers & Snacks", href: "/frozen/appetizers-snacks" },
            { label: "Dough & Pastry", href: "/frozen/dough-pastry" },
            { label: "French Fries", href: "/frozen/french-fries" },
            { label: "Frozen Desserts", href: "/frozen/desserts" },
            { label: "Frozen Fruit", href: "/frozen/fruit" },
            { label: "Frozen Vegetables", href: "/frozen/vegetables" },
          ],
        },
        {
          links: [
            { label: "Frozen Family Meals", href: "/frozen/family-meals" },
            { label: "Frozen Fruit Purée", href: "/frozen/fruit-puree" },
            { label: "Frozen Bread, Rolls & Bagels", href: "/frozen/bread-rolls-bagels" },
            { label: "Frozen Pasta", href: "/frozen/pasta" },
            { label: "Frozen Meat", href: "/frozen/meat" },
            { label: "Frozen Soup", href: "/frozen/soup" },
          ],
        },
        {
          links: [
            { label: "Ice Cream, Gelato & Sorbet", href: "/frozen/ice-cream-gelato-sorbet" },
            { label: "Frozen Hors D'oeuvre", href: "/frozen/hors-doeuvre" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL FROZEN", href: "/frozen" },
    },
  },
  {
    id: "seafood",
    label: "Seafood",
    href: "/seafood",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Shellfish", href: "/seafood/shellfish" },
            { label: "Shrimp", href: "/seafood/shrimp" },
            { label: "Tin Fish — Conservas", href: "/seafood/tin-fish-conservas" },
            { label: "Fish", href: "/seafood/fish" },
            { label: "Crab", href: "/seafood/crab" },
            { label: "Octopus & Calamari", href: "/seafood/octopus-calamari" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL SEAFOOD", href: "/seafood" },
    },
  },
  {
    id: "pantry",
    label: "Pantry",
    href: "/pantry",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Beans & Legumes", href: "/pantry/beans-legumes" },
            { label: "Beverages", href: "/pantry/beverages" },
            { label: "Condiments", href: "/pantry/condiments" },
            { label: "Dried Fruit & Vegetables", href: "/pantry/dried-fruit-vegetables" },
            { label: "Flours & Mixes", href: "/pantry/flours-mixes" },
            { label: "Ingredients", href: "/pantry/ingredients" },
          ],
        },
        {
          links: [
            { label: "Nuts & Seeds", href: "/pantry/nuts-seeds" },
            { label: "Oil & Vinegars", href: "/pantry/oil-vinegars" },
            { label: "Pasta, Grains & Rice", href: "/pantry/pasta-grains-rice" },
            { label: "Snacks & Candy", href: "/pantry/snacks-candy" },
            { label: "Spices & Seasonings", href: "/pantry/spices-seasonings" },
            { label: "Vinegar", href: "/pantry/vinegar" },
          ],
        },
        {
          links: [
            { label: "Canned Tomatoes & Sauces", href: "/pantry/canned-tomatoes-sauces" },
            { label: "Demi Glace, Stocks & Broth", href: "/pantry/demi-glace-stocks-broth" },
            { label: "Olives", href: "/pantry/olives" },
            { label: "Sugar & Sweeteners", href: "/pantry/sugar-sweeteners" },
            { label: "Truffles", href: "/pantry/truffles" },
            { label: "Molecular Gastronomy", href: "/pantry/molecular-gastronomy" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL PANTRY", href: "/pantry" },
    },
  },
  {
    id: "supplies",
    label: "Supplies",
    href: "/supplies",
    megaMenu: {
      columns: [
        {
          links: [
            { label: "Disposables", href: "/supplies/disposables" },
            { label: "Janitorial", href: "/supplies/janitorial" },
            { label: "Kitchen Supplies", href: "/supplies/kitchen-supplies" },
            { label: "Candles & Cooking Fuel", href: "/supplies/candles-cooking-fuel" },
            { label: "Cleaning Products", href: "/supplies/cleaning-products" },
            { label: "Containers & Bags", href: "/supplies/containers-bags" },
          ],
        },
        {
          links: [
            { label: "Cups & Bottles", href: "/supplies/cups-bottles" },
            { label: "Films & Foils", href: "/supplies/films-foils" },
            { label: "Gloves", href: "/supplies/gloves" },
            { label: "Grilling", href: "/supplies/grilling" },
            { label: "Napkins, Towels & Tissues", href: "/supplies/napkins-towels-tissues" },
            { label: "Pizza Boxes", href: "/supplies/pizza-boxes" },
          ],
        },
        {
          links: [
            { label: "Trays, Pans & Baskets", href: "/supplies/trays-pans-baskets" },
            { label: "Utensils", href: "/supplies/utensils" },
          ],
        },
      ],
      viewAll: { label: "VIEW ALL SUPPLIES", href: "/supplies" },
    },
  },
];

export const SPECIAL_NAV_LINK = {
  label: "Family Meal Specials",
  href: "/family-meal-specials",
};

/**
 * Homepage “shop by category” tiles — names match main nav; counts are placeholders.
 * Visuals (gradient, icon) keyed by `slug` in `lib/categoryThemes.js`.
 */
export const CATEGORIES = [
  { name: "What's New", count: 24, slug: "whats-new" },
  { name: "Meat & Poultry", count: 45, slug: "meat-poultry" },
  { name: "Dairy & Eggs", count: 32, slug: "dairy-eggs" },
  { name: "Cheese & Charcuterie", count: 38, slug: "cheese-charcuterie" },
  { name: "Oils & Vinegars", count: 28, slug: "oils-vinegars" },
  { name: "Baking & Pastry", count: 34, slug: "baking-pastry" },
  { name: "Produce", count: 52, slug: "produce" },
  { name: "Frozen", count: 29, slug: "frozen" },
  { name: "Seafood", count: 21, slug: "seafood" },
  { name: "Pantry", count: 41, slug: "pantry" },
  { name: "Supplies", count: 19, slug: "supplies" },
  { name: "Family Meal Specials", count: 15, slug: "family-meal-specials" },
];

/**
 * Homepage hero — auto-rotating slides.
 * All `imageSrc` values are Unsplash URLs so banners always load without local assets.
 * Swap for your own exports anytime (see `/public/IMAGES_REQUIRED.md`).
 */
export const HOME_HERO_SLIDES = [
  {
    id: "spring-hero",
    headlineLines: ["Bright.", "Fresh.", "Seasonal."],
    subheadline: "Premium cuts delivered to your door",
    ctaText: "Browse Early Spring Arrivals",
    ctaHref: "#",
    imageSrc:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=85",
    imageAlt: "Fresh seasonal produce and ingredients",
  },
  {
    id: "carved-hero",
    headlineLines: ["Carved", "Meat Company"],
    subheadline: "A Premium Cut Beef Program",
    ctaText: "Join Today",
    ctaHref: "/meat-poultry/carved-meat-co",
    imageSrc:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1920&q=85",
    imageAlt: "Premium marbled ribeye steaks",
  },
  {
    id: "produce-hero",
    headlineLines: ["Garden", "Fresh", "Quality"],
    subheadline: "Peak-season produce from trusted growers",
    ctaText: "Shop Produce",
    ctaHref: "/produce",
    imageSrc:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1920&q=85",
    imageAlt: "Fresh artichokes and vegetables",
    imageObjectPosition: "78% center",
  },
  {
    id: "family-hero",
    headlineLines: ["Family Meal", "Specials"],
    subheadline: "Chef-crafted bundles for busy nights",
    ctaText: "View Specials",
    ctaHref: "/family-meal-specials",
    imageSrc:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=85",
    imageAlt: "Prepared meals and sides",
  },
];

/** @deprecated use HOME_HERO_SLIDES — kept for any single-slide references */
export const HERO = HOME_HERO_SLIDES[0];

/**
 * Lower homepage promos — two-column dark cards, carousel (local + Unsplash assets).
 */
export const HOME_PROMO_BANNERS = [
  {
    id: "carved",
    badge: "Premium Program",
    titleLines: ["Carved", "Meat Company"],
    subtitle: "A Premium Cut Beef Program",
    description:
      "Experience the finest selection of premium cuts, hand-selected by our master butchers. Each piece is aged to perfection and traceable to its source.",
    ctaLabel: "Join Today",
    ctaHref: "/meat-poultry/carved-meat-co",
    imageSrc:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=85",
    imageAlt: "Premium marbled ribeye steaks on a wire rack",
  },
  {
    id: "produce",
    badge: "Farm Fresh",
    titleLines: ["Seasonal", "Harvest"],
    subtitle: "Vegetables and fruit at peak flavor",
    description:
      "We partner with growers who share our standards—so every tomato, leafy green, and herb arrives as it should taste.",
    ctaLabel: "Browse Produce",
    ctaHref: "/produce",
    imageSrc:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=85",
    imageAlt: "Fresh vegetables and artichokes",
  },
  {
    id: "seafood",
    badge: "Dock to Door",
    titleLines: ["Coastal", "Seafood"],
    subtitle: "Sustainably sourced fillets & shellfish",
    description:
      "From day-boat catch to your kitchen—temperature-controlled handling and careful sourcing you can stand behind.",
    ctaLabel: "Shop Seafood",
    ctaHref: "/seafood",
    imageSrc:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    imageAlt: "Fresh seafood on ice",
  },
  {
    id: "pantry",
    badge: "Staples",
    titleLines: ["Pantry", "Essentials"],
    subtitle: "Oils, sauces, and chef-grade ingredients",
    description:
      "Stock your line with the same premium oils, vinegars, and specialty items trusted in professional kitchens.",
    ctaLabel: "Explore Pantry",
    ctaHref: "/pantry",
    imageSrc:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
    imageAlt: "Olive oil and pantry ingredients",
  },
];

/** CASE vs piece — common demo purchasable unit toggle (2 equal segments) */
export const DEMO_SIZE_OPTIONS_CASE_PC = [
  { value: "case", label: "CASE" },
  { value: "pc", label: "PC" },
];

/** Three equal segments in the size picker (demo) */
export const DEMO_SIZE_OPTIONS_THREE = [
  { value: "case", label: "CASE" },
  { value: "pc", label: "PC" },
  { value: "split", label: "SPLIT" },
];

/**
 * Four units — same full-width segmented row as 2–3; horizontal scroll only for 5+ options.
 */
export const DEMO_SIZE_OPTIONS_MULTI = [
  { value: "case", label: "CASE" },
  { value: "pc", label: "PC" },
  { value: "split", label: "SPLIT" },
  { value: "bulk", label: "BULK" },
];

/**
 * Homepage “New Arrivals” — static placeholders until wired to catalog API.
 *
 * Fields:
 * - `footerMode`: "quantity" | "add"
 * - `sizeOptions` + `defaultSize`: optional unit toggles (CASE / PC / …)
 * - `price`, `unitPrice`, `netWeight`: defaults when no per-size data
 * - `priceBySize` (optional): map `sizeOption.value` → { price, unitPrice, netWeight? }.
 *   When present, switching size updates $ line, unit suffix (e.g. / lb vs / pc), and weight copy.
 *   Future API can return the same shape per SKU / variant.
 */
export const NEW_ARRIVALS_SECTION = {
  title: "New Arrivals",
  subtitle: "Discover our latest premium selections",
  viewAllLabel: "View All",
  viewAllHref: "/whats-new",
};

export const NEW_ARRIVALS_PRODUCTS = [
  {
    id: "na-1",
    slug: "pork-tenderloin-5x2lb",
    imageSrc:
      "https://images.unsplash.com/photo-1602470520998-f4a60889a0e5?w=640&q=80",
    imageAlt: "Pork tenderloin in a pan",
    tier: "STANDARD",
    title: "Pork Tenderloin, 5 × 2lb",
    vendor: "BEEF PALACE",
    netWeight: "Net Weight: 10.00 LBS",
    price: 57.99,
    unitPrice: "/ 5.799 lb",
    footerMode: "quantity",
    sizeOptions: DEMO_SIZE_OPTIONS_CASE_PC,
    defaultSize: "case",
    /** Per-unit pricing when CASE vs PC differ (demo — same pattern for API) */
    priceBySize: {
      case: {
        price: 57.99,
        unitPrice: "/ 5.799 lb",
        netWeight: "Net Weight: 10.00 LBS",
      },
      pc: {
        price: 12.49,
        unitPrice: "/ 6.245 lb",
        netWeight: "Net Weight: 2.00 LBS",
      },
    },
  },
  {
    id: "na-2",
    slug: "prime-ribeye-steaks-4ct",
    imageSrc:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=640&q=80",
    imageAlt: "Raw ribeye steaks on a rack",
    tier: "STANDARD",
    title: "Prime Ribeye Steaks, 4 × 12oz",
    vendor: "BEEF PALACE",
    netWeight: "Net Weight: 3.00 LBS",
    price: 89.99,
    unitPrice: "/ 29.997 lb",
    footerMode: "add",
    sizeOptions: DEMO_SIZE_OPTIONS_THREE,
    defaultSize: "case",
  },
  {
    id: "na-3",
    slug: "boneless-pork-loin-2ct",
    imageSrc:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=640&q=80",
    imageAlt: "Fresh pork cuts",
    tier: "STANDARD",
    title: "Boneless Pork Loin, 2 × 5lb",
    vendor: "BEEF PALACE",
    netWeight: "Net Weight: 10.00 LBS",
    price: 62.5,
    unitPrice: "/ 6.25 lb",
    footerMode: "add",
    sizeOptions: DEMO_SIZE_OPTIONS_MULTI,
    defaultSize: "case",
  },
  {
    id: "na-4",
    slug: "artisan-salami-chub",
    imageSrc:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=640&q=80",
    imageAlt: "Cured salami",
    tier: "STANDARD",
    title: "Artisan Salami Chub, 3lb",
    vendor: "BEEF PALACE",
    netWeight: "Net Weight: 3.00 LBS",
    price: 34.99,
    unitPrice: "/ 11.663 lb",
    footerMode: "add",
    sizeOptions: DEMO_SIZE_OPTIONS_CASE_PC,
    defaultSize: "case",
  },
];
