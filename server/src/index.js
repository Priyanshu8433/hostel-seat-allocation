import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import allocationRoutes from "./routes/allocation.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/complaints", complaintRoutes);
app.use("/student", studentRoutes);
app.use("/admin", allocationRoutes);
// stats endpoints (admin and public alias)
app.use("/admin/stats", statsRoutes);
app.use("/stats", statsRoutes);
// Admin data routes
app.use("/api/admin", adminRoutes);

// simple root route /
app.get("/", (req, res) => {
  res.send("Hostel Seat Allocation API is up");
});

// global error handler (must be registered after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
