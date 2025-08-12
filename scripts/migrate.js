#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'starter_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🚀 Starting database migration...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Clean the schema first - remove comments and normalize whitespace
    const cleanedSchema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--')) // Remove comment lines
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\s+/g, ' '); // Normalize whitespace

    // Split the schema into individual statements
    const allStatements = cleanedSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Filter out empty statements
        return stmt.length > 0 && stmt !== '';
      })
      .map(stmt => stmt + ';'); // Add semicolon back
      
    console.log('All statements found:');
    allStatements.forEach((stmt, i) => {
      console.log(`${i + 1}: ${stmt.substring(0, 50)}...`);
    });

    // Separate different types of statements for proper execution order
    const extensionStatements = allStatements.filter(stmt => stmt.toUpperCase().includes('CREATE EXTENSION'));
    const tableStatements = allStatements.filter(stmt => stmt.toUpperCase().includes('CREATE TABLE'));
    const indexStatements = allStatements.filter(stmt => stmt.toUpperCase().includes('CREATE INDEX'));
    const insertStatements = allStatements.filter(stmt => stmt.toUpperCase().includes('INSERT INTO'));
    
    console.log(`Found ${extensionStatements.length} extension statements`);
    console.log(`Found ${tableStatements.length} table statements`);
    console.log(`Found ${indexStatements.length} index statements`);
    console.log(`Found ${insertStatements.length} insert statements`);
    
    // Combine in proper order: extensions -> tables -> indexes -> inserts
    const statements = [...extensionStatements, ...tableStatements, ...indexStatements, ...insertStatements];
    
    if (statements.length === 0) {
      console.log('No valid statements found. Check schema.sql file.');
      return;
    }

    const client = await pool.connect();
    
    try {
      console.log('📊 Executing migration statements...');
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement && statement !== ';') {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`);
          try {
            await client.query(statement);
          } catch (error) {
            console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
            console.error(`   Statement: ${statement.substring(0, 100)}...`);
            throw error;
          }
        }
      }

      console.log('✅ Database migration completed successfully!');
      console.log('📋 Tables created:');
      
      // Show created tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      
      console.log('\n👤 Default admin user created:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('   Role: ADMIN');
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();