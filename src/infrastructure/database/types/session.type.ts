import { InferSelectModel } from "drizzle-orm";
import { sessions } from "../schema/sessions.schema";

export type Session = InferSelectModel<typeof sessions>;
