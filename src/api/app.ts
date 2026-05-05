import express, {Express, Router} from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import whatsappRoutes from "./modules/whatsapp/routes/whatsapp.routes";
import agentRoutes from "./modules/agent/routes/agent.routes";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// for investigation
// app.use((req, res, next) => {
//     console.log(process.memoryUsage().rss/1024/1024);
//     next();
// });
// checkhealt
const router: Router = Router();
router.get("/hello", (req, res)=>{
	res.send("hello");
})
app.use(router)

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/users", whatsappRoutes);
app.use("/api/v1/user/:id_user/agents", agentRoutes);


export default app;
