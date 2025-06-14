import { sql } from '@vercel/postgres'

export const createTablesQuery = `
  -- Create categories table
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create menu_items table
  CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create orders table
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'paid')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create order_items table
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'cooking', 'ready')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
  CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
  CREATE INDEX IF NOT EXISTS idx_orders_table_number ON orders(table_number);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);
`

export async function createTables() {
  try {
    await sql.query(createTablesQuery)
    console.log('Database tables created successfully')
    return { success: true }
  } catch (error) {
    console.error('Error creating tables:', error)
    return { success: false, error }
  }
}