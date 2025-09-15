# POS System Backend API

A comprehensive backend API for a Point of Sale (POS) system built with Node.js, Express, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Complete CRUD operations for products with inventory tracking
- **Order Management**: Create and manage sales orders with automatic stock updates
- **Customer Management**: Customer database with purchase history
- **Supplier Management**: Supplier database for purchase orders
- **Payment Processing**: Multiple payment method support
- **Inventory Tracking**: Real-time stock monitoring and alerts
- **Reporting**: Sales and inventory reports

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, Helmet for security headers
- **Validation**: express-validator

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Import the database schema
   mysql -u your_username -p your_database < ../databse.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Owner only)
- `POST /api/users` - Create new user (Owner only)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/barcode/:barcode` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/stock` - Update product stock
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

### Payments
- `GET /api/payments/order/:orderId` - Get payments for an order
- `POST /api/payments` - Record new payment

### Inventory
- `GET /api/inventory/summary` - Get inventory summary
- `GET /api/inventory/adjustments` - Get stock adjustments
- `POST /api/inventory/adjustments` - Record stock adjustment

## User Roles

- **Owner**: Full system access, can manage users
- **Manager**: Can manage products, suppliers, and view all data
- **Cashier**: Can process sales, manage customers, view limited data

## Database Schema

The database consists of the following main tables:
- `users` - System users
- `categories` - Product categories
- `products` - Product inventory
- `customers` - Customer information
- `suppliers` - Supplier information
- `orders` - Sales orders
- `order_items` - Order line items
- `payments` - Payment records
- `stock_adjustments` - Inventory adjustments

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── customers.js
│   │   ├── suppliers.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── inventory.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.