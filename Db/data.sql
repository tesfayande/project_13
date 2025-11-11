
CREATE TABLE `Users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `brithdate` DATE NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `Agents`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `Customers`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `adress` VARCHAR(255) NOT NULL,
    `created_at` BIGINT NOT NULL,
    `updated_at` BIGINT NOT NULL
);

CREATE TABLE `chats`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sender_id` BIGINT NOT NULL,
    `reciver_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `messages`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `Conversations`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT NOT NULL,
    `agent_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `Answers`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `message_id` BIGINT NOT NULL,
    `sender_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `vehicle-categories`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category` VARCHAR(255) NOT NULL,
    `fuel` BIGINT NOT NULL,
    `transmission` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `Offers`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT NOT NULL,
    `agency_id` BIGINT NOT NULL,
    `depature_city` VARCHAR(255) NOT NULL,
    `departure_time` DATETIME NOT NULL,
    `back_city` VARCHAR(255) NOT NULL,
    `back_time` DATETIME NOT NULL,
    `new_column` BIGINT NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `Rentals`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `offer_id` BIGINT NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);


ALTER TABLE
    `chats` ADD CONSTRAINT `chats_reciver_id_foreign` FOREIGN KEY(`reciver_id`) REFERENCES `Conversations`(`id`);
ALTER TABLE
    `Conversations` ADD CONSTRAINT `conversations_agent_id_foreign` FOREIGN KEY(`agent_id`) REFERENCES `Agents`(`id`);
ALTER TABLE
    `chats` ADD CONSTRAINT `chats_reciver_id_foreign` FOREIGN KEY(`reciver_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `Offers` ADD CONSTRAINT `offers_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `vehicle-categories`(`id`);
ALTER TABLE
    `Customers` ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `Answers` ADD CONSTRAINT `answers_message_id_foreign` FOREIGN KEY(`message_id`) REFERENCES `messages`(`id`);
ALTER TABLE
    `Rentals` ADD CONSTRAINT `rentals_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `Customers`(`id`);
ALTER TABLE
    `Rentals` ADD CONSTRAINT `rentals_offer_id_foreign` FOREIGN KEY(`offer_id`) REFERENCES `Offers`(`id`);
ALTER TABLE
    `Agents` ADD CONSTRAINT `agents_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `messages` ADD CONSTRAINT `messages_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `Customers`(`id`);
ALTER TABLE
    `Answers` ADD CONSTRAINT `answers_sender_id_foreign` FOREIGN KEY(`sender_id`) REFERENCES `Agents`(`id`);
ALTER TABLE
    `Conversations` ADD CONSTRAINT `conversations_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `Customers`(`id`);
ALTER TABLE
    `chats` ADD CONSTRAINT `chats_sender_id_foreign` FOREIGN KEY(`sender_id`) REFERENCES `Users`(`id`);