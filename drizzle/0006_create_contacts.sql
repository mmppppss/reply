CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_agent" uuid NOT NULL,
	"contact_id" varchar(255) NOT NULL,
	"name" varchar(255),
	"platform" varchar(20),
	"chat_type" varchar(20),
	"first_seen_at" timestamp DEFAULT now() NOT NULL,
	"last_interaction_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_agent_agents_id_fk" FOREIGN KEY ("id_agent") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contacts_agent_contact_idx" ON "contacts" USING btree ("id_agent", "contact_id");
