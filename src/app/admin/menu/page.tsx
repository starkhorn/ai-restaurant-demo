'use client'

import { useState, useEffect } from 'react'
import MenuItemModal from '@/components/MenuItemModal'

// Types
interface Category {
  id: number
  name: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image_url?: string | null
  is_available: boolean
  category_id: number
  category_name?: string
}

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories and menu items on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [categoriesResponse, menuItemsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/menu-items')
      ])

      if (!categoriesResponse.ok || !menuItemsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const categoriesData = await categoriesResponse.json()
      const menuItemsData = await menuItemsResponse.json()

      setCategories(categoriesData)
      setMenuItems(menuItemsData)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load menu data. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems

  const toggleAvailability = async (itemId: number) => {
    const item = menuItems.find(item => item.id === itemId)
    if (!item) return

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          is_available: !item.is_available,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      setMenuItems(items =>
        items.map(item =>
          item.id === itemId
            ? { ...item, is_available: !item.is_available }
            : item
        )
      )
    } catch (error) {
      console.error('Error toggling availability:', error)
      alert('Failed to update item availability. Please try again.')
    }
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown'
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (itemData: Omit<MenuItem, 'id'> & { id?: number }) => {
    try {
      let response
      if (editingItem && itemData.id) {
        // Update existing item
        response = await fetch(`/api/menu-items/${itemData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        })
      } else {
        // Create new item
        response = await fetch('/api/menu-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save item')
      }

      const savedItem = await response.json()

      if (editingItem) {
        // Update existing item in state
        setMenuItems(items =>
          items.map(item =>
            item.id === savedItem.id ? { ...savedItem, category_name: getCategoryName(savedItem.category_id) } : item
          )
        )
      } else {
        // Add new item to state
        setMenuItems(items => [...items, { ...savedItem, category_name: getCategoryName(savedItem.category_id) }])
      }

      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving item:', error)
      throw error // Re-throw to let modal handle the error display
    }
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading menu items...</div>
          </div>
        ) : (
          <>
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
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Item Button */}
            <div className="mb-6">
              <button
                onClick={handleAddNew}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
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
                          {item.category_name || getCategoryName(item.category_id)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          ${item.price.toFixed(2)}
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
                        
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200"
                        >
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
          </>
        )}

        {/* Modal */}
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingItem(null)
          }}
          onSubmit={handleModalSubmit}
          editItem={editingItem}
          categories={categories}
        />
      </div>
    </div>
  )
}