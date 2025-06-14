import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const body = await request.json()
    const { name, description, price, image_url, is_available, category_id } = body

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Update menu item
    const result = await sql`
      UPDATE menu_items 
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        image_url = ${image_url},
        is_available = ${is_available},
        category_id = ${category_id},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      message: 'Menu item updated successfully',
      menuItem: result.rows[0] 
    })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}