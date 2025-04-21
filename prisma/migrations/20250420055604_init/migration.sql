-- CreateTable
CREATE TABLE `users` (
    `user_id` CHAR(26) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `realname` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `username_UNIQUE`(`username`),
    UNIQUE INDEX `phone_UNIQUE`(`phone_number`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
