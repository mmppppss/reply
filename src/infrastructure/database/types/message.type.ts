import { InferSelectModel } from "drizzle-orm";
import { messages } from "../schema/messages.schema";

export type Message = InferSelectModel<typeof messages>;
