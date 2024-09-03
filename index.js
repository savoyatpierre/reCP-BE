require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceDatabaseConnect.js");
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const transactionRoutes = require("./src/routes/transaction.js");
const categoryRoutes = require("./src/routes/category.js");
const computeRoutes = require("./src/routes/compute.js");
const shelfRoutes = require("./src/routes/shelf.js");
const shoppingRoutes = require("./src/routes/shopping.js");

// CONNECT MONGO
serviceConnectMongoDB();

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.SUPPORTED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Max-Age", "3600");
  next();
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/category", categoryRoutes);
app.use("/compute", computeRoutes);
app.use("/shelf", shelfRoutes);
app.use("/shopping", shoppingRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>reCP© back end</h1>");
});

module.exports = app;
