#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function resetDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'starter_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🗑️  Starting database reset...');
    
    const client = await pool.connect();
    
    try {
      // Get all tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      if (tablesResult.rows.length > 0) {
        console.log('📋 Dropping existing tables...');
        
        // Drop all tables
        for (const row of tablesResult.rows) {
          await client.query(`DROP TABLE IF EXISTS ${row.table_name} CASCADE`);
          console.log(`   ✅ Dropped table: ${row.table_name}`);
        }
      } else {
        console.log('📋 No tables found to drop.');
      }
      
      console.log('✅ Database reset completed successfully!');
      console.log('💡 Run "npm run db:migrate" to recreate tables and seed data.');
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();