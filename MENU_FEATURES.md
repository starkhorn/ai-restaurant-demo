# Menu Item Management Feature

This implementation adds Create & Edit functionality for menu items in the restaurant admin panel.

## Features Implemented

### ✅ Acceptance Criteria Met:
- **AC 1**: Clicking "Add New Item" or "Edit" opens a form in a modal ✅
- **AC 2**: Form includes fields for Name, Description, Price, Image Upload, Category, and Availability ✅
- **AC 3**: Form submission calls POST (create) or PUT (edit) API routes ✅
- **AC 4**: Menu table updates to show changes after successful submission ✅

### API Endpoints Added:
- `GET /api/categories` - Fetch all categories
- `GET /api/menu-items` - Fetch all menu items with category information
- `POST /api/menu-items` - Create new menu item
- `PUT /api/menu-items/[id]` - Update existing menu item

### Components Added:
- `MenuItemModal` - Reusable modal component for both create and edit operations

## Usage

1. **Setup Database** (required before first use):
   ```bash
   curl -X POST http://localhost:3000/api/setup
   ```

2. **Add New Menu Item**:
   - Click "Add New Menu Item" button
   - Fill in the form fields
   - Click "Add Item" to save

3. **Edit Existing Item**:
   - Click "Edit" button on any menu item card
   - Modify the desired fields
   - Click "Update Item" to save changes

4. **Toggle Availability**:
   - Click "Mark Sold Out" or "Mark Available" buttons to quickly change item availability

## Form Validation

- Name and Price are required fields
- Price must be a positive number
- Category selection is required
- Form displays error messages for validation failures

## Database Integration

The implementation uses the existing PostgreSQL database schema:
- Reads from `categories` table for dropdown options
- Performs INSERT/UPDATE operations on `menu_items` table
- Maintains referential integrity with foreign key constraints

## File Structure

```
src/
├── app/api/
│   ├── categories/route.ts          # Categories API
│   └── menu-items/
│       ├── route.ts                 # Menu items list & create API
│       └── [id]/route.ts           # Individual menu item update API
├── components/
│   └── MenuItemModal.tsx           # Modal form component
└── app/admin/menu/
    └── page.tsx                    # Updated admin menu page (main integration)
```