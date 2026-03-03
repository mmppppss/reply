import express from "express";
import cors from "cors";
// import helmet from "helmet";

import authRoutes from "./modules/auth/routes/auth.routes";

const app = express();

// app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

export default app;
