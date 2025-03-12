require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./src/middleware/errorMiddleware");
const notFoundHandler = require("./src/middleware/notFoundMiddleware");

const productRoutes = require("./src/routes/productRoutes");
const { initDb } = require("./src/config/db");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev")); // HTTP request logging
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // form data parsing

// Routing
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Please use /api route");
});

app.get("/api", (req, res) => {
  res.send("You are using TechMarket API");
});

app.use(notFoundHandler);
app.use(errorHandler);

initDb()
  .then(() => {
    console.log("Database initialized");
    const server = app.listen(process.env.PORT, () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`Server is listening at http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize the database:", err);
  });
