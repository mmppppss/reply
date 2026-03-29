import express, {Express} from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// for investigation
// app.use((req, res, next) => {
//     console.log(process.memoryUsage().rss/1024/1024);
//     next();
// });

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes)


export default app;
