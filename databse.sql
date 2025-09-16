-- POS System Database Schema
-- Created for React POS Application

-- Create database
CREATE DATABASE IF NOT EXISTS pos_system;
USE pos_system;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'manager', 'cashier') NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table for product categorization
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table (must be created before products table)
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    contact_person VARCHAR(255),
    payment_terms ENUM('net_15', 'net_30', 'net_45', 'net_60', 'cash_on_delivery', 'immediate') DEFAULT 'net_30',
    notes TEXT,
    products_supplied INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    last_order_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products/Inventory table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    barcode VARCHAR(100) UNIQUE,
    description TEXT,
    buy_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    sell_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit ENUM('pieces', 'kg', 'g', 'liter', 'ml', 'bottles', 'pack') DEFAULT 'pieces',
    expiry_date DATE,
    photo VARCHAR(255),
    status ENUM('in_stock', 'low_stock', 'out_of_stock', 'expired', 'damaged', 'returns', 'owner_bearing') DEFAULT 'in_stock',
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    notes TEXT,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_order_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'holding', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method ENUM('cash', 'card', 'credit', 'mixed', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(100),
    notes TEXT,
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Stock adjustments table for inventory tracking
CREATE TABLE stock_adjustments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    adjustment_type ENUM('purchase', 'sale', 'damage', 'return', 'correction', 'expired', 'other') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reason TEXT,
    reference_number VARCHAR(100),
    adjusted_by INT,
    adjustment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (adjusted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Supplier orders table (for purchase orders)
CREATE TABLE supplier_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'ordered', 'received', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Supplier order items table
CREATE TABLE supplier_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_order_id) REFERENCES supplier_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_stock_adjustments_product ON stock_adjustments(product_id);
CREATE INDEX idx_supplier_orders_supplier ON supplier_orders(supplier_id);
CREATE INDEX idx_supplier_order_items_order ON supplier_order_items(supplier_order_id);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food', 'Food and beverages'),
('Beverages', 'Drinks and beverages'),
('Other', 'Miscellaneous items');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password_hash, role, email, full_name) VALUES
('admin', '$2b$10$i98r7HwZ/e1hCS5BBvimx.hM8yZg7gaLflM7nVc7sydw8cTMqudTG', 'owner', 'admin@possystem.com', 'System Administrator');

-- Insert sample products
INSERT INTO products (name, category_id, barcode, buy_price, sell_price, current_stock, min_stock, unit) VALUES
('Laptop Dell Inspiron', 1, 'DELL001', 85000.00, 95000.00, 15, 5, 'pieces'),
('Wireless Mouse', 1, 'MOUSE001', 1200.00, 1500.00, 3, 10, 'pieces'),
('Organic Rice 5kg', 3, 'RICE001', 2500.00, 2800.00, 0, 20, 'kg'),
('Coca Cola 500ml', 4, 'COKE001', 150.00, 200.00, 45, 30, 'bottles'),
('T-Shirt Large', 2, 'TSHIRT001', 800.00, 1200.00, 8, 15, 'pieces');

-- Insert sample customer
INSERT INTO customers (customer_id, name, phone, email, address, city) VALUES
('CUST001', 'John Doe', '123-456-7890', 'john@example.com', '123 Main St', 'New York');

-- Insert sample supplier
INSERT INTO suppliers (supplier_id, name, phone, email, contact_person, payment_terms) VALUES
('SUP001', 'Supplier A', '123-456-7890', 'supplierA@example.com', 'John Manager', 'net_30');

-- Note: Triggers have been removed to avoid MySQL/MariaDB version compatibility issues
-- These operations will be handled by the application code instead

-- Views for common queries
CREATE VIEW order_details AS
SELECT
    o.id,
    o.order_number,
    o.order_date,
    o.total_amount,
    o.discount_amount,
    o.final_amount,
    o.status,
    o.payment_status,
    c.name as customer_name,
    c.phone as customer_phone,
    u.username as cashier_name,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.order_date, o.total_amount, o.discount_amount, o.final_amount, o.status, o.payment_status, c.name, c.phone, u.username;

CREATE VIEW inventory_summary AS
SELECT
    p.id,
    p.name,
    c.name as category,
    p.current_stock,
    p.min_stock,
    p.sell_price,
    (p.current_stock * p.sell_price) as total_value,
    p.status,
    p.updated_at as last_updated
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

CREATE VIEW sales_summary AS
SELECT
    DATE(order_date) as sale_date,
    COUNT(*) as total_orders,
    SUM(final_amount) as total_sales,
    AVG(final_amount) as avg_order_value
FROM orders
WHERE status = 'completed'
GROUP BY DATE(order_date)
ORDER BY sale_date DESC;

-- Note: Stored procedures have been removed to avoid MySQL/MariaDB version compatibility issues
-- These operations will be handled by the application code instead