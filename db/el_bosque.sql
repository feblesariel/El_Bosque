CREATE DATABASE el_bosque;

USE el_bosque;

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE product_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_product INT NOT NULL,
    option_type ENUM('Tamaño', 'Relleno', 'Cobertura', 'Decoración') NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (id_product) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    url TEXT NOT NULL,    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX (product_id),
    INDEX (url(255)) -- Increase URL index length if needed
);

CREATE TABLE discounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    discount_percentage INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_id INT,
    code INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    method ENUM('Retiro', 'Envio') NOT NULL,    
    status ENUM('Procesando', 'Preparando', 'Listo', 'Completado', 'Cancelado') NOT NULL,    
    scheduled_date TEXT NOT NULL, -- REVISAR --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (discount_id) REFERENCES discounts(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_options TEXT NOT NULL, -- REVISAR --
    quantity INT NOT NULL DEFAULT 1,
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE order_details_delivery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE order_details_pickup (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pendiente', 'Completado', 'Cancelado') NOT NULL,
    payment_method ENUM('transfer', 'mercado_pago') NOT NULL,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poblar tablas

INSERT INTO categories (name) VALUES ('Categoria 1'), ('Categoria 2'), ('Categoria 3'), ('Categoria 4');

INSERT INTO products (category_id, name, price, description) VALUES
    (1, 'Torta 1', 499.99, 'Descripción del producto torta 1'),
    (1, 'Torta 2', 299.99, 'Descripción del producto torta 2'),
    (1, 'Torta 3', 899.99, 'Descripción del producto torta 3'),
    (1, 'Torta 4', 79.99, 'Descripción del producto torta 4'),
    (2, 'Budin 1', 19.99, 'Descripción del producto budin 1'),
    (2, 'Budin 2', 39.99, 'Descripción del producto budin 2'),
    (2, 'Budin 3', 49.99, 'Descripción del producto budin 3'),
    (2, 'Budin 4', 99.99, 'Descripción del producto budin 4'),
    (3, 'Desayuno 1', 599.99, 'Descripción del producto desayuno 1'),
    (3, 'Desayuno 2', 299.99, 'Descripción del producto desayuno 2'),
    (3, 'Desayuno 3', 79.99, 'Descripción del producto desayuno 3'),
    (3, 'Desayuno 4', 39.99, 'Descripción del producto desayuno 4'),
    (4, 'Salado 1', 29.99, 'Descripción del producto salado 1'),
    (4, 'Salado 2', 19.99, 'Descripción del producto salado 2'),
    (4, 'Salado 3', 24.99, 'Descripción del producto salado 3'),
    (4, 'Salado 4', 39.99, 'Descripción del producto salado 4');

INSERT INTO product_options (id_product, option_type, option_value, description) VALUES
    (1, 'Tamaño', 'Chico', 'Tamaño chico de 4 porciones'),
    (2, 'Tamaño', 'Chico', 'Tamaño chico de 4 porciones'),
    (3, 'Tamaño', 'Chico', 'Tamaño chico de 4 porciones'),
    (4, 'Tamaño', 'Chico', 'Tamaño chico de 4 porciones');

INSERT INTO product_images (product_id, url) VALUES
    (1, 'product-1.jpg'),
    (2, 'product-2.jpg'),
    (3, 'product-3.jpg'),
    (4, 'product-4.jpg'),
    (5, 'product-1.jpg'),
    (6, 'product-2.jpg'),
    (7, 'product-3.jpg'),
    (8, 'product-4.jpg'),
    (9, 'product-1.jpg'),
    (10, 'product-2.jpg'),
    (11, 'product-3.jpg'),
    (12, 'product-4.jpg'),
    (13, 'product-1.jpg'),
    (14, 'product-2.jpg'),
    (15, 'product-3.jpg'),
    (16, 'product-4.jpg');