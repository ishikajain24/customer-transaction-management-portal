// Run this script ONCE to generate the hashed password for your .env file
// Usage: node scripts/hashPassword.js yourpassword
// Then copy the output into .env as OWNER_PASSWORD_HASH=...

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hashPassword.js <your_password>");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("\nAdd this to your .env file:");
  console.log(`OWNER_PASSWORD_HASH=${hash}\n`);
});
