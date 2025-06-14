import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, description, price, image_url, is_available, category_id } = await request.json()
    const id = parseInt((await params).id)
    
    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      )
    }
    
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
      UPDATE menu_items 
      SET 
        name = ${name},
        description = ${description || ''},
        price = ${priceNum},
        image_url = ${image_url || null},
        is_available = ${is_available ?? true},
        category_id = ${category_id},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}