// src/app/api/bouquets/route.ts
// @ts-expect-error: No type definitions for pg ESM import
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM bouquets');
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}