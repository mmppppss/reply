CREATE TABLE "agent_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_agent" uuid NOT NULL,
	"module_key" varchar(50) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" varchar(10) DEFAULT 'primary' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_agent" uuid NOT NULL,
	"keyword" varchar(100) NOT NULL,
	"response" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_modules" ADD CONSTRAINT "agent_modules_id_agent_agents_id_fk" FOREIGN KEY ("id_agent") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_id_agent_agents_id_fk" FOREIGN KEY ("id_agent") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;