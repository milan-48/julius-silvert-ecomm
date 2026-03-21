#!/usr/bin/env node
/**
 * Usage: pnpm exec node scripts/hash-stock-pin.js [6-digit-pin]
 * Prints a bcrypt hash — paste into STOCK_SAVE_PIN_BCRYPT in
 * app/api/catalog/inventory/save/route.js (do not commit the plain PIN).
 */
const bcrypt = require("bcryptjs");

const pin = process.argv[2] || "";
if (!/^\d{6}$/.test(pin)) {
  console.error("Usage: pnpm exec node scripts/hash-stock-pin.js <6-digit-pin>");
  process.exit(1);
}

bcrypt.hash(pin, 12).then((hash) => {
  console.log(hash);
});
