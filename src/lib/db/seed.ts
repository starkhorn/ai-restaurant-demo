import { sql } from '@vercel/postgres'

export const seedData = {
  categories: [
    { name: 'Appetizers' },
    { name: 'Main Courses' },
    { name: 'Beverages' },
    { name: 'Desserts' }
  ],
  menuItems: [
    {
      name: 'Spring Rolls',
      description: 'Fresh vegetables wrapped in rice paper, served with sweet and sour sauce',
      price: 8.99,
      image_url: null,
      is_available: true,
      category_name: 'Appetizers'
    },
    {
      name: 'Tom Yum Soup',
      description: 'Spicy and sour Thai soup with shrimp, mushrooms, and lemongrass',
      price: 11.99,
      image_url: null,
      is_available: true,
      category_name: 'Appetizers'
    },
    {
      name: 'Chicken Satay',
      description: 'Grilled chicken skewers with peanut sauce and cucumber relish',
      price: 12.99,
      image_url: null,
      is_available: true,
      category_name: 'Appetizers'
    },
    {
      name: 'Pad Thai',
      description: 'Traditional Thai stir-fried noodles with shrimp, tofu, bean sprouts, and tamarind sauce',
      price: 14.99,
      image_url: null,
      is_available: true,
      category_name: 'Main Courses'
    },
    {
      name: 'Green Curry',
      description: 'Spicy green curry with chicken, Thai basil, and jasmine rice',
      price: 16.99,
      image_url: null,
      is_available: true,
      category_name: 'Main Courses'
    },
    {
      name: 'Massaman Beef',
      description: 'Slow-cooked beef in rich massaman curry with potatoes and peanuts',
      price: 18.99,
      image_url: null,
      is_available: true,
      category_name: 'Main Courses'
    },
    {
      name: 'Thai Iced Tea',
      description: 'Sweet and creamy traditional Thai tea with condensed milk',
      price: 4.99,
      image_url: null,
      is_available: false,
      category_name: 'Beverages'
    },
    {
      name: 'Fresh Coconut Water',
      description: 'Natural coconut water served in fresh coconut',
      price: 5.99,
      image_url: null,
      is_available: true,
      category_name: 'Beverages'
    },
    {
      name: 'Mango Sticky Rice',
      description: 'Sweet sticky rice with fresh mango slices and coconut milk',
      price: 7.99,
      image_url: null,
      is_available: true,
      category_name: 'Desserts'
    },
    {
      name: 'Thai Coconut Ice Cream',
      description: 'Homemade coconut ice cream with crushed peanuts and corn',
      price: 6.99,
      image_url: null,
      is_available: true,
      category_name: 'Desserts'
    }
  ]
}

export async function seedDatabase() {
  try {
    // Insert categories
    console.log('Seeding categories...')
    for (const category of seedData.categories) {
      await sql`
        INSERT INTO categories (name) 
        VALUES (${category.name})
        ON CONFLICT (name) DO NOTHING
      `
    }

    // Insert menu items
    console.log('Seeding menu items...')
    for (const item of seedData.menuItems) {
      // Get category ID
      const categoryResult = await sql`
        SELECT id FROM categories WHERE name = ${item.category_name}
      `
      
      if (categoryResult.rows.length > 0) {
        const categoryId = categoryResult.rows[0].id
        
        await sql`
          INSERT INTO menu_items (name, description, price, image_url, is_available, category_id)
          VALUES (${item.name}, ${item.description}, ${item.price}, ${item.image_url}, ${item.is_available}, ${categoryId})
          ON CONFLICT DO NOTHING
        `
      }
    }

    console.log('Database seeded successfully')
    return { success: true }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error }
  }
}