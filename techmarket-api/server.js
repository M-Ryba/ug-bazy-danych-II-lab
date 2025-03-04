require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, My server is using Express");
});

const server = app.listen(process.env.PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server is listening at http://${host}:${port}`);
});
