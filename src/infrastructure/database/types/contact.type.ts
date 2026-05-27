import { InferSelectModel } from "drizzle-orm";
import { contacts } from "../schema/contacts.schema";

export type Contact = InferSelectModel<typeof contacts>;
