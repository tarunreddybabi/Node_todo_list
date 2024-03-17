const express = require("express");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 2001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
