import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.category_id,
        c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      ORDER BY c.name, mi.name
    `
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, image_url, is_available, category_id } = await request.json()
    
    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Validate price is a number
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO menu_items (name, description, price, image_url, is_available, category_id, updated_at)
      VALUES (${name}, ${description || ''}, ${priceNum}, ${image_url || null}, ${is_available ?? true}, ${category_id}, CURRENT_TIMESTAMP)
      RETURNING *
    `
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}