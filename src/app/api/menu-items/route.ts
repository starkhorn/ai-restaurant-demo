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
        mi.created_at,
        mi.updated_at,
        c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      ORDER BY mi.name ASC
    `
    
    return NextResponse.json({ menuItems: result.rows })
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
    const body = await request.json()
    const { name, description, price, image_url, is_available, category_id } = body

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Insert new menu item
    const result = await sql`
      INSERT INTO menu_items (name, description, price, image_url, is_available, category_id)
      VALUES (${name}, ${description}, ${price}, ${image_url}, ${is_available}, ${category_id})
      RETURNING *
    `

    return NextResponse.json({ 
      message: 'Menu item created successfully',
      menuItem: result.rows[0] 
    })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}