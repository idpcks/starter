#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'starter_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🧪 Testing login functionality...');
    
    // Test credentials
    const testUsers = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'manager@example.com', password: 'manager123' },
      { email: 'user@example.com', password: 'user123' }
    ];
    
    const client = await pool.connect();
    
    try {
      for (const testUser of testUsers) {
        console.log(`\n🔐 Testing login for: ${testUser.email}`);
        
        // Find user in database
        const result = await client.query('SELECT * FROM users WHERE email = $1', [testUser.email]);
        const user = result.rows[0];
        
        if (!user) {
          console.log('❌ User not found in database');
          continue;
        }
        
        console.log('👤 User found:', user.email, '- Role:', user.role);
        
        // Test password
        const isPasswordValid = await bcrypt.compare(testUser.password, user.password);
        console.log('🔑 Password valid:', isPasswordValid ? '✅ YES' : '❌ NO');
        
        if (isPasswordValid) {
          console.log('✅ Login test PASSED for', user.email);
        } else {
          console.log('❌ Login test FAILED for', user.email);
        }
      }
    } finally {
      client.release();
    }
    
    console.log('\n🏁 Login testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testLogin();