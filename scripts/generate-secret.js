#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure random string for NextAuth secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated NextAuth Secret:');
console.log('');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('');
console.log('📝 Copy this to your production environment variables');
console.log('');
console.log('⚠️  Keep this secret secure and never commit it to version control!');
