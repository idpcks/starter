import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    const client = await pool.connect();
    
    try {
      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized successfully' 
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to initialize database',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read schema file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Test database connection
      const result = await client.query('SELECT NOW()');
      
      // Check if tables exist
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      const tables = tablesResult.rows.map(row => row.table_name);
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        timestamp: result.rows[0].now,
        tables: tables
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}