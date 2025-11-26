const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log('\n🔐 Generated Webhook Secret:\n');
console.log(secret);
console.log('\n📋 Copy this to your .env.local file as SUPABASE_WEBHOOK_SECRET\n');
