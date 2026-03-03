// Type User
import { InferSelectModel } from "drizzle-orm";
import { users } from "../schema/users.schema";

export type User = InferSelectModel<typeof users>;
