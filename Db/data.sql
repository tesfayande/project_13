CREATE TABLE `roles`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `roles` ADD UNIQUE `roles_name_unique`(`name`);
CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `role_id` BIGINT UNSIGNED NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `birthdate` DATE NOT NULL,
    `email_verified_at` TIMESTAMP NULL,
    `is_active` BOOLEAN NULL DEFAULT 'DEFAULT TRUE',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `users` ADD INDEX `users_role_id_index`(`role_id`);
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
CREATE TABLE `agencies`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NULL,
    `is_active` BOOLEAN NULL DEFAULT 'DEFAULT TRUE',
    `opening_hours` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `agencies` ADD INDEX `agencies_city_index`(`city`);
ALTER TABLE
    `agencies` ADD INDEX `agencies_country_index`(`country`);
CREATE TABLE `customers`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NULL,
    `driver_license_number` VARCHAR(100) NULL,
    `driver_license_expiry` DATE NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `customers` ADD UNIQUE `customers_user_id_unique`(`user_id`);
ALTER TABLE
    `customers` ADD INDEX `customers_driver_license_number_index`(`driver_license_number`);
CREATE TABLE `vehicle_categories`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `fuel_type` ENUM(
        'gasoline',
        'diesel',
        'electric',
        'hybrid',
        'lpg'
    ) NOT NULL,
    `transmission` ENUM(
        'manual',
        'automatic',
        'semi_automatic'
    ) NOT NULL,
    `vehicle_type` ENUM(
        'economy',
        'compact',
        'mid_size',
        'standard',
        'full_size',
        'premium',
        'luxury',
        'suv',
        'minivan',
        'convertible',
        'sports'
    ) NOT NULL,
    `icon_url` VARCHAR(500) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `vehicle_categories` ADD UNIQUE `vehicle_categories_name_unique`(`name`);
CREATE TABLE `vehicles`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `current_agency_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `brand` VARCHAR(100) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `year` YEAR NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `license_plate` VARCHAR(20) NOT NULL,
    `vin` VARCHAR(17) NULL,
    `mileage_limit` INT NULL COMMENT 'Daily mileage limit if applicable',
    `excess_mileage_fee` DECIMAL(6, 2) NULL,
    `status` ENUM(
        'available',
        'rented',
        'maintenance',
        'cleaning',
        'unavailable'
    ) NULL DEFAULT 'available',
    `odometer_reading` INT NOT NULL COMMENT 'Current kilometers/miles',
    `fuel_level` ENUM(
        'empty',
        'quarter',
        'half',
        'three_quarters',
        'full'
    ) NULL DEFAULT 'full',
    `seating_capacity` TINYINT UNSIGNED NOT NULL,
    `door_count` TINYINT UNSIGNED NOT NULL,
    `luggage_capacity` VARCHAR(50) NULL COMMENT 'e.g. ,  2 large bags ,  1 small',
    `features` JSON NULL COMMENT 'AC ,  GPS ,  Bluetooth ,  etc.',
    `insurance_number` VARCHAR(100) NULL,
    `insurance_expiry` DATE NULL,
    `registration_number` VARCHAR(100) NULL,
    `last_maintenance_date` DATE NULL,
    `next_maintenance_odometer` INT NULL,
    `image_url` VARCHAR(500) NULL,
    `image_gallery` JSON NULL COMMENT 'Array of image URLs',
    `is_active` BOOLEAN NULL DEFAULT 'DEFAULT TRUE',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `vehicles` ADD INDEX `vehicles_current_agency_id_index`(`current_agency_id`);
ALTER TABLE
    `vehicles` ADD INDEX `vehicles_category_id_index`(`category_id`);
ALTER TABLE
    `vehicles` ADD UNIQUE `vehicles_license_plate_unique`(`license_plate`);
ALTER TABLE
    `vehicles` ADD UNIQUE `vehicles_vin_unique`(`vin`);
ALTER TABLE
    `vehicles` ADD INDEX `vehicles_status_index`(`status`);
CREATE TABLE `offers`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `vehicle_id` BIGINT UNSIGNED NOT NULL,
    `agency_id` BIGINT UNSIGNED NOT NULL,
    `departure_agency_id` BIGINT UNSIGNED NOT NULL,
    `departure_time` DATETIME NOT NULL,
    `return_agency_id` BIGINT UNSIGNED NOT NULL,
    `return_time` DATETIME NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `is_available` BOOLEAN NULL DEFAULT 'DEFAULT TRUE',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `offers` ADD INDEX `offers_vehicle_id_index`(`vehicle_id`);
ALTER TABLE
    `offers` ADD INDEX `offers_departure_time_index`(`departure_time`);
ALTER TABLE
    `offers` ADD INDEX `offers_is_available_index`(`is_available`);
CREATE TABLE `rentals`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `offer_id` BIGINT UNSIGNED NOT NULL,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `rental_number` VARCHAR(50) NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `paid_amount` DECIMAL(10, 2) NULL,
    `payment_status` ENUM(
        'pending',
        'paid',
        'partially_paid',
        'refunded'
    ) NULL DEFAULT 'pending',
    `rental_status` ENUM(
        'reserved',
        'active',
        'completed',
        'cancelled',
        'no_show'
    ) NULL DEFAULT 'reserved',
    `pickup_odometer` INT NULL,
    `return_odometer` INT NULL,
    `cancellation_reason` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `rentals` ADD INDEX `rentals_customer_id_index`(`customer_id`);
ALTER TABLE
    `rentals` ADD UNIQUE `rentals_rental_number_unique`(`rental_number`);
ALTER TABLE
    `rentals` ADD INDEX `rentals_rental_status_index`(`rental_status`);
CREATE TABLE `conversations`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('open', 'closed', 'pending') NULL DEFAULT 'open',
    `last_message_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `conversations` ADD INDEX `conversations_status_index`(`status`);
ALTER TABLE
    `conversations` ADD INDEX `conversations_last_message_at_index`(`last_message_at`);
CREATE TABLE `messages`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT UNSIGNED NOT NULL,
    `sender_type` ENUM('customer', 'user') NOT NULL,
    `sender_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `message_type` ENUM('text', 'attachment', 'system') NULL DEFAULT 'text',
    `attachment_url` VARCHAR(255) NULL,
    `is_read` BOOLEAN NULL DEFAULT 'DEFAULT FALSE',
    `read_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `messages` ADD INDEX `messages_conversation_id_index`(`conversation_id`);
ALTER TABLE
    `messages` ADD INDEX `messages_created_at_index`(`created_at`);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_return_agency_id_foreign` FOREIGN KEY(`return_agency_id`) REFERENCES `agencies`(`id`);
ALTER TABLE
    `vehicles` ADD CONSTRAINT `vehicles_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `vehicle_categories`(`id`);
ALTER TABLE
    `vehicles` ADD CONSTRAINT `vehicles_current_agency_id_foreign` FOREIGN KEY(`current_agency_id`) REFERENCES `agencies`(`id`);
ALTER TABLE
    `users` ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`);
ALTER TABLE
    `rentals` ADD CONSTRAINT `rentals_offer_id_foreign` FOREIGN KEY(`offer_id`) REFERENCES `offers`(`id`);
ALTER TABLE
    `customers` ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `conversations` ADD CONSTRAINT `conversations_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `conversations` ADD CONSTRAINT `conversations_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`);
ALTER TABLE
    `messages` ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY(`conversation_id`) REFERENCES `conversations`(`id`);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_vehicle_id_foreign` FOREIGN KEY(`vehicle_id`) REFERENCES `vehicles`(`id`);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_departure_agency_id_foreign` FOREIGN KEY(`departure_agency_id`) REFERENCES `agencies`(`id`);
ALTER TABLE
    `rentals` ADD CONSTRAINT `rentals_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_agency_id_foreign` FOREIGN KEY(`agency_id`) REFERENCES `agencies`(`id`);