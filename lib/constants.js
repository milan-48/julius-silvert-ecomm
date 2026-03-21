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

export const HERO = {
  headlineLines: ["Bright.", "Fresh.", "Seasonal."],
  subheadline: "Premium cuts delivered to your door",
  ctaText: "Browse Early Spring Arrivals",
  ctaHref: "#",
};
