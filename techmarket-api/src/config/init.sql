CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(999),
    price NUMERIC NOT NULL,
    stock_count INTEGER NOT NULL,
    brand VARCHAR(50) NOT NULL,
    image_url VARCHAR(999),
    is_available BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT price CHECK (price > 0),
    CONSTRAINT stock_count CHECK (stock_count >= 0)
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(999),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE products
ADD COLUMN category_id INTEGER,
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id) REFERENCES categories(category_id);

INSERT INTO categories (name, description) VALUES
('Laptopy', 'Laptopy i notebooki'),
('Smartfony', 'Telefony komórkowe i smartfony'),
('Przewody', 'Kable i przewody');

INSERT INTO products (name, category, description, price, stock_count, brand, image_url, is_available, category_id) VALUES
('MacBook Pro 16', 'Laptopy', 'Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD', '9999.99', '15', 'Apple', 'https://example.com/macbook.jpg', 'true', 1),
('iPhone 15', 'Smartfony', 'Smartfon Apple z ekranem 6.1", 128GB pamięci', '699.99', '34', 'Apple', 'https://example.com/iphone15.jpg', 'true', 2),
('Kabel HDMI 1,5 m', 'Przewody', 'Kabel HDMI - HDMI o długości 1,5 w standardzie 2.0', '9.99', '15', 'Goldenline', 'https://example.com/hdmi.jpg', 'true', 3)
ON CONFLICT DO NOTHING;

INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
('adam1', 'adm1@example.com', '1234#', 'Adam', 'Kowalski'),
('natif', 'natif@example.com', 'zaq1@WSX', 'Natalia', 'Kowal');

INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Doskonały laptop, bardzo szybki i niezawodny.'),
(2, 2, 4, 'Świetny telefon, ale trochę drogi.'),
(3, 1, 3, 'Dobry kabel, ale mógłby być dłuższy.');
