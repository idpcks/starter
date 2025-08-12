#!/usr/bin/env node

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updatePasswords() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'starter_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🔐 Updating user passwords...');
    
    const client = await pool.connect();
    
    try {
      // Update admin password
      const adminHash = bcrypt.hashSync('admin123', 10);
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [adminHash, 'admin@example.com']
      );
      console.log('✅ Updated admin@example.com password');
      
      // Update manager password
      const managerHash = bcrypt.hashSync('manager123', 10);
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [managerHash, 'manager@example.com']
      );
      console.log('✅ Updated manager@example.com password');
      
      // Update user password
      const userHash = bcrypt.hashSync('user123', 10);
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [userHash, 'user@example.com']
      );
      console.log('✅ Updated user@example.com password');
      
      console.log('\n✅ All passwords updated successfully!');
      console.log('\n👤 Available test users:');
      console.log('   Admin: admin@example.com / admin123');
      console.log('   Manager: manager@example.com / manager123');
      console.log('   User: user@example.com / user123');
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Password update failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updatePasswords();