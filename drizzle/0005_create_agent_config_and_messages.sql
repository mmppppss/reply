CREATE TABLE "agent_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_agent" uuid NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_agent" uuid NOT NULL,
	"id_session" uuid,
	"direction" varchar(10) NOT NULL,
	"from_jid" varchar(255),
	"to_jid" varchar(255),
	"content" text NOT NULL,
	"module_key" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_config" ADD CONSTRAINT "agent_config_id_agent_agents_id_fk" FOREIGN KEY ("id_agent") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_agent_agents_id_fk" FOREIGN KEY ("id_agent") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_session_sessions_id_fk" FOREIGN KEY ("id_session") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_config_agent_key_idx" ON "agent_config" USING btree ("id_agent", "config_key");
