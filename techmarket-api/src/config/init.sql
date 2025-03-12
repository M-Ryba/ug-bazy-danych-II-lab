CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50),
    description VARCHAR(999),
    price: INTEGER,
    stock_count INTEGER,
    brand VARCHAR(50),
    image_url VARCHAR(999),
    is_available BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT price CHECK (price > 0),
    CONSTRAINT stock_count CHECK (stock_count >= 0)
);

INSERT INTO products (name, category, description, price, stock_count, brand, image_url, is_available) VALUES
('MacBook Pro 16', 'Laptopy', 'Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD', '9999.99', '15', 'Apple', 'https://example.com/macbook.jpg', 'true'),
('iPhone 15', 'Smartfony', 'Smartfon Apple z ekranem 6.1", 128GB pamięci', '699.99', '34', 'Apple', 'https://example.com/iphone15.jpg', 'true'),
('Kabel HDMI 1,5 m', 'Przewody', 'Kabel HDMI - HDMI o długości 1,5 w standardzie 2.0', '9.99', '15', 'Goldenline', 'https://example.com/hdmi.jpg', 'true')
ON CONFLICT DO NOTHING;
