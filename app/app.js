const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("../routers/authRoutes");
const userRoutes = require("../routers/userRoutes");
const taskRoutes = require("../routers/taskRoutes");
const tagsRoutes = require("../routers/tagsRoutes");
const eventRoutes = require("../routers/eventRoutes");
const activateRoutes = require("../routers/activateRoutes");
const inviteRoutes = require("../routers/inviteRoutes");

const {
  catchAllUndefinedRoutes,
  globalErrorHandler,
} = require("../middleware/common/errorHandler");
const isAuthenticated = require("../middleware/common/authMiddleware");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_URL }));

// Define routes
app.use("/api/auth/", authRoutes);

app.use(isAuthenticated);
app.use("/api/user/", userRoutes);
app.use("/api/task/", taskRoutes);
app.use("/api/tags/", tagsRoutes);
app.use("/api/event/", eventRoutes);
app.use("/api/activates/", activateRoutes);
app.use("/api/send/", inviteRoutes);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
