import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import certificateRoutes from "./routes/certificateRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }));
app.use(express.json());

app.use("/api/institution",institutionRoutes)

app.use("/api/certificate", certificateRoutes);
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("working");