import express, { Express, Router } from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import agentRoutes from "./modules/agent/routes/agent.routes";
import responseRoutes from "./modules/agent/routes/response.routes";
import agentModuleRoutes from "./modules/agent-module/routes/agent-module.routes";
import agentConfigRoutes from "./modules/agent-config/routes/agent-config.routes";
import messagesRoutes from "./modules/messages/routes/messages.routes";
import contactRoutes from "./modules/contacts/routes/contact.routes";
import knowledgeRoutes from "./modules/knowledge/routes/knowledge.routes";

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
router.get("/hello", (req, res) => {
	res.send("hello test 2");
});
app.use(router);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user/:id_user/agents", agentRoutes);
app.use("/api/v1/agents/:id_agent/responses", responseRoutes);
app.use("/api/v1/agents/:id_agent/modules", agentModuleRoutes);
app.use("/api/v1/agents/:id_agent/config", agentConfigRoutes);
app.use("/api/v1/agents/:id_agent/messages", messagesRoutes);
app.use("/api/v1/agents/:id_agent/contacts", contactRoutes);
app.use("/api/v1/agents/:id_agent/knowledge", knowledgeRoutes);

export default app;
