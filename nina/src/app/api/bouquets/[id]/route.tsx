// src/app/api/bouquets/[id]/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Получаем id из параметров маршрута
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID букета не указан' },
        { status: 400 }
      );
    }

    const result = await pool.query('SELECT * FROM bouquets WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Букет не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}