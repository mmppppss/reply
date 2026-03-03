CREATE TABLE `users` (
	`id` char(36) NOT NULL DEFAULT uuid(),
	`username` varchar(50) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(50) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT now(),
	`updated_at` datetime NOT NULL DEFAULT now(),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
