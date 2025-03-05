require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorMiddleware = require("./src/middleware/errorMiddleware");

const productRoutes = require("./src/routes/productRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev")); // HTTP request logging
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // form data parsing
app.use(errorMiddleware);

// Routing
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("You are using TechMarket API");
});

const server = app.listen(process.env.PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server is listening at http://${host}:${port}`);
});
