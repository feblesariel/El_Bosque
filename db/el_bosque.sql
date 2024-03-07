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
    sold_count INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE product_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_product INT NOT NULL,
    option_type ENUM('Tamaño', 'Bizcochuelo', 'Relleno 1', 'Relleno 2', 'Cobertura', 'Decoración') NOT NULL,
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

INSERT INTO categories (name) VALUES ('Categoria 1'), ('Categoria 2'), ('Categoria 3');

INSERT INTO products (category_id, name, price, description) VALUES
    (1, 'Producto 1', 499.99, '3 capas de bizcochuelo y 1 de relleno firme a elección (no cremas, seleccionar ambos rellenos iguales, en caso de elegir distintos se hará con el primero). Los bizcochuelos son humedecidos con almíbar y las tortas cubiertas de buttercream. Se mantienen en heladera. Se entrega en base de carton con blonda y caja cerrada.\n\nTamaño chica rinde 6 porciones.\n\nTamaño chica rinde 10 porciones.'),
    (2, 'Producto 2', 299.99, 'Clásica chocotorta con ganache de chocolate como topping y deco con picos de dulce de leche, chocolatines y chips de chocolate.'),
    (3, 'Producto 3', 899.99, 'Clásica chocotorta con ganache de chocolate como topping y deco con picos de dulce de leche, chocolatines y chips de chocolate.'),
    (1, 'Producto 4', 79.99, 'Clásica chocotorta con ganache de chocolate como topping y deco con picos de dulce de leche, chocolatines y chips de chocolate.'),
    (2, 'Producto 5', 19.99, 'Clásica chocotorta con ganache de chocolate como topping y deco con picos de dulce de leche, chocolatines y chips de chocolate.');

INSERT INTO product_options (id_product, option_type, option_value, description) VALUES
    (1, 'Tamaño', 'Chica', 'Rinde para 8 porciones.'),
    (1, 'Bizcochuelo', 'Vainilla', 'Chocolate'),
    (1, 'Relleno 1', 'Dulce de leche', 'Relleno de dulce de leche Vacalin.'),
    (1, 'Relleno 2', 'Merengue italiano', 'Relleno de merengue italiano.'),
    (2, 'Tamaño', 'Chica', 'Rinde para 8 porciones.'),
    (2, 'Bizcochuelo', 'Vainilla', 'Chocolate'),
    (2, 'Relleno 1', 'Dulce de leche', 'Relleno de dulce de leche Vacalin.'),
    (2, 'Relleno 2', 'Merengue italiano', 'Relleno de merengue italiano.'),
    (3, 'Tamaño', 'Chica', 'Rinde para 8 porciones.'),
    (3, 'Bizcochuelo', 'Vainilla', 'Chocolate'),
    (3, 'Relleno 1', 'Dulce de leche', 'Relleno de dulce de leche Vacalin.'),
    (3, 'Relleno 2', 'Merengue italiano', 'Relleno de merengue italiano.'),
    (4, 'Tamaño', 'Chica', 'Rinde para 8 porciones.'),
    (4, 'Bizcochuelo', 'Vainilla', 'Chocolate'),
    (4, 'Relleno 1', 'Dulce de leche', 'Relleno de dulce de leche Vacalin.'),
    (4, 'Relleno 2', 'Merengue italiano', 'Relleno de merengue italiano.'),
    (5, 'Tamaño', 'Chica', 'Rinde para 8 porciones.'),
    (5, 'Bizcochuelo', 'Vainilla', 'Chocolate'),
    (5, 'Relleno 1', 'Dulce de leche', 'Relleno de dulce de leche Vacalin.'),
    (5, 'Relleno 2', 'Merengue italiano', 'Relleno de merengue italiano.');

INSERT INTO product_images (product_id, url) VALUES
    (1, 'product-big-1.jpg'),
    (1, 'product-big-2.jpg'),
    (1, 'product-big-3.jpg'),
    (2, 'product-big-1.jpg'),
    (2, 'product-big-2.jpg'),
    (2, 'product-big-3.jpg'),
    (3, 'product-big-1.jpg'),
    (3, 'product-big-2.jpg'),
    (3, 'product-big-3.jpg'),
    (4, 'product-big-1.jpg'),
    (4, 'product-big-2.jpg'),
    (4, 'product-big-3.jpg'),
    (5, 'product-big-1.jpg'),
    (5, 'product-big-2.jpg'),
    (5, 'product-big-3.jpg');