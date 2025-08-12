#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function seed() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'starter_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🌱 Starting database seeding...');
    
    const client = await pool.connect();
    
    try {
      // Check if data already exists
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      const permissionCount = await client.query('SELECT COUNT(*) FROM permissions');
      
      console.log(`📊 Current data status:`);
      console.log(`   - Users: ${userCount.rows[0].count}`);
      console.log(`   - Permissions: ${permissionCount.rows[0].count}`);
      
      // Add sample users if needed
      if (parseInt(userCount.rows[0].count) <= 1) {
        console.log('👥 Adding sample users...');
        
        const bcrypt = require('bcryptjs');
        const sampleUsers = [
          {
            email: 'manager@example.com',
            password: bcrypt.hashSync('manager123', 10), // manager123
            name: 'Manager User',
            role: 'MANAGER'
          },
          {
            email: 'user@example.com',
            password: bcrypt.hashSync('user123', 10), // user123
            name: 'Regular User',
            role: 'USER'
          }
        ];
        
        for (const user of sampleUsers) {
          await client.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            [user.email, user.password, user.name, user.role]
          );
          console.log(`   ✅ Added user: ${user.email}`);
        }
      } else {
        console.log('👥 Sample users already exist, skipping...');
      }
      
      console.log('\n✅ Database seeding completed successfully!');
      console.log('\n👤 Available test users:');
      console.log('   Admin: admin@example.com / admin123');
      console.log('   Manager: manager@example.com / manager123');
      console.log('   User: user@example.com / user123');
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();