'use client'

import { useState } from 'react'

// Mock data for categories and menu items
const mockCategories = [
  { id: 1, name: 'Appetizers' },
  { id: 2, name: 'Main Courses' },
  { id: 3, name: 'Beverages' },
  { id: 4, name: 'Desserts' },
]

const mockMenuItems = [
  {
    id: 1,
    name: 'Spring Rolls',
    description: 'Fresh vegetables wrapped in rice paper',
    price: 8.99,
    image_url: '/placeholder-food.jpg',
    is_available: true,
    category_id: 1,
  },
  {
    id: 2,
    name: 'Pad Thai',
    description: 'Traditional Thai stir-fried noodles',
    price: 12.99,
    image_url: '/placeholder-food.jpg',
    is_available: true,
    category_id: 2,
  },
  {
    id: 3,
    name: 'Thai Iced Tea',
    description: 'Sweet and creamy traditional Thai tea',
    price: 4.99,
    image_url: '/placeholder-food.jpg',
    is_available: false,
    category_id: 3,
  },
]

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [menuItems, setMenuItems] = useState(mockMenuItems)

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems

  const toggleAvailability = (itemId: number) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, is_available: !item.is_available }
          : item
      )
    )
  }

  const getCategoryName = (categoryId: number) => {
    return mockCategories.find(cat => cat.id === categoryId)?.name || 'Unknown'
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your restaurant&apos;s menu items and categories
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Categories</option>
            {mockCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Item Button */}
        <div className="mb-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add New Menu Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCategoryName(item.category_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      ${item.price}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_available ? 'Available' : 'Sold Out'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        item.is_available
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {item.is_available ? 'Mark Sold Out' : 'Mark Available'}
                    </button>
                    
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  )
}