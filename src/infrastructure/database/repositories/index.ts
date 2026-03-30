import { db } from "..";

import { UserRepository } from "./user.repo";
import { SessionRepository } from "./session.repo";

export const userRepo = new UserRepository(db);
export const sessionRepo = new SessionRepository(db);
