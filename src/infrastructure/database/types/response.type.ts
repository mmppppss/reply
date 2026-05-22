import { InferSelectModel } from "drizzle-orm";
import { responses } from "../schema/responses.schema";

export type ResponseRule = InferSelectModel<typeof responses>;
