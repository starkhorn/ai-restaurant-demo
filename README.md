# AI Restaurant Demo

A Restaurant Menu & Order Management System built with Next.js, NextAuth.js, and Vercel Postgres.

## Features

- **Admin Authentication**: Secure login for restaurant managers
- **Protected Admin Routes**: Access control for administrative functions
- **Menu Management**: CRUD operations for menu items and categories
- **Responsive Design**: Works on desktop and mobile devices
- **Database Schema**: Complete schema for restaurant operations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js
- **Database**: Vercel Postgres
- **UI**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Vercel account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/starkhorn/ai-restaurant-demo.git
cd ai-restaurant-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

For local development, you can use the mock data. For production:

1. Set up Vercel Postgres database
2. Add database connection URLs to your environment variables
3. Call the setup API to create tables and seed data:

```bash
curl -X POST http://localhost:3000/api/setup
```

## Authentication

Demo credentials for local development:
- **Username**: admin
- **Password**: admin123

## Routes

- `/` - Home page
- `/admin` - Admin dashboard (redirects to `/admin/menu`)
- `/admin/menu` - Menu management interface
- `/auth/signin` - Admin login page

## Database Schema

The application includes the following tables:

- `categories` - Menu categories (Appetizers, Main Courses, etc.)
- `menu_items` - Restaurant menu items with prices and availability
- `orders` - Customer orders by table
- `order_items` - Individual items within orders with status tracking

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Set up Vercel Postgres database
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## License

MIT