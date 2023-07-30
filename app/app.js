const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("../routers/userRoutes");
const taskRoutes = require("../routers/taskRoutes");
const {
  catchAllUndefinedRoutes,
  globalErrorHandler,
} = require("../middleware/common/errorHandler");
const isAuthenticated = require("../middleware/common/authMiddleware");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Define routes
app.use("/api/users/", userRoutes);

app.use(isAuthenticated);
app.use("/api/task", taskRoutes);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
