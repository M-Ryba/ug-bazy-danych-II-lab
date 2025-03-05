const products = [
  {
    id: 1,
    name: "MacBook Pro 16",
    category: "Laptopy",
    description: "Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD",
    price: 9999.99,
    stockCount: 15,
    brand: "Apple",
    imageUrl: "https://example.com/macbook.jpg",
    isAvailable: true,
    createdAt: "2023-01-15T14:30:00Z",
  },
  {
    id: 2,
    name: "iPhone 15",
    category: "Smartfony",
    description: 'Smartfon Apple z ekranem 6.1", 128GB pamięci',
    price: 699.99,
    stockCount: 34,
    brand: "Apple",
    imageUrl: "https://example.com/iphone15.jpg",
    isAvailable: true,
    createdAt: "2022-02-15T13:29:00Z",
  },
  {
    id: 3,
    name: "Kabel HDMI 1,5 m",
    category: "Przewody",
    description: "Kabel HDMI - HDMI o długości 1,5 w standardzie 2.0",
    price: 9.99,
    stockCount: 15,
    brand: "Goldenline",
    imageUrl: "https://example.com/hdmi.jpg",
    isAvailable: true,
    createdAt: "2021-06-23T15:35:00Z",
  },
];

module.exports = {
  products,
};
