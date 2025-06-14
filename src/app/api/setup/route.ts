import { NextResponse } from 'next/server'
import { createTables } from '@/lib/db/schema'
import { seedDatabase } from '@/lib/db/seed'

export async function POST() {
  try {
    // Create tables
    const tablesResult = await createTables()
    if (!tablesResult.success) {
      return NextResponse.json(
        { error: 'Failed to create tables', details: tablesResult.error },
        { status: 500 }
      )
    }

    // Seed database
    const seedResult = await seedDatabase()
    if (!seedResult.success) {
      return NextResponse.json(
        { error: 'Failed to seed database', details: seedResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Database setup completed successfully',
      tables: 'created',
      data: 'seeded'
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { error: 'Database setup failed', details: error },
      { status: 500 }
    )
  }
}