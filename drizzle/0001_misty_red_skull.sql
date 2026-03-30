ALTER TABLE `sessions` RENAME COLUMN `id_cliente` TO `id_user`;--> statement-breakpoint
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_id_cliente_clients_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id` char(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id_user` char(36);--> statement-breakpoint
ALTER TABLE `sessions` ADD `status` char(1) DEFAULT 'P' NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `updated_at` datetime DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;