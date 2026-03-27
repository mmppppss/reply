CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_user` char(36),
	`name` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(30),
	`created_at` datetime NOT NULL DEFAULT now(),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_cliente` int,
	`created_at` datetime NOT NULL DEFAULT now(),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`username` varchar(50) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT now(),
	`updated_at` datetime NOT NULL DEFAULT now(),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_id_cliente_clients_id_fk` FOREIGN KEY (`id_cliente`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;