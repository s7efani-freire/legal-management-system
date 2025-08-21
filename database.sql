-- Enables the use of foreign keys
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table: users
-- Stores all system users, such as lawyers, administrators, finance members, etc.
-- ----------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `profile_photo_path` VARCHAR(255) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table: roles
-- Defines the roles a user can have in the system.
-- ----------------------------
CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE, -- E.g., 'Administrator', 'Lawyer', 'Finance'
  `description` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Junction Table: user_roles
-- Assigns one or more roles to users (Many-to-Many).
-- ----------------------------
CREATE TABLE `user_roles` (
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table: permissions
-- List of possible permissions in the system.
-- ----------------------------
CREATE TABLE `permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE, -- E.g., 'legal_actions:create'
  `description` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Junction Table: role_permissions
-- Assigns permissions to roles (Many-to-Many).
-- ----------------------------
CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------
-- Table: condominiums
-- Stores data for client condominiums.
-- ----------------------------
CREATE TABLE `condominiums` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `legal_name` VARCHAR(255) NOT NULL,
  `trade_name` VARCHAR(255) NULL,
  `cnpj` VARCHAR(18) NOT NULL UNIQUE,
  `email` VARCHAR(255) NULL,
  `phone_number` VARCHAR(20) NULL,
  `zip_code` VARCHAR(9) NULL,
  `street_address` VARCHAR(255) NULL,
  `street_number` VARCHAR(20) NULL,
  `address_complement` VARCHAR(100) NULL,
  `neighborhood` VARCHAR(100) NULL,
  `city` VARCHAR(100) NULL,
  `state` CHAR(2) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table: residents
-- Stores data for residents (your 'stakeholders'), linked to a condominium.
-- ----------------------------
CREATE TABLE `residents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `document_number` VARCHAR(18) NOT NULL UNIQUE, -- For CPF or CNPJ
  `email` VARCHAR(255) NULL,
  `phone_number` VARCHAR(20) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ----------------------------
-- Table: dwellings
-- Residential or commercial units (your 'dwellings'), linking residents to condominiums.
-- ----------------------------
CREATE TABLE `dwellings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `condominium_id` INT UNSIGNED NOT NULL,
  `resident_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(20) NULL,
  `building_block` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`condominium_id`) REFERENCES `condominiums` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------
-- Table: legal_actions
-- The core table, stores legal demands/actions.
-- ----------------------------
CREATE TABLE `legal_actions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `type` ENUM('Judicial', 'Extrajudicial') NOT NULL,
  `condominium_id` INT UNSIGNED NOT NULL,
  `dwelling_id` INT UNSIGNED NULL, -- A dwelling is optional
  `responsible_user_id` INT UNSIGNED NOT NULL,
  -- Columns for the Kanban board
  `status` ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  `position` INT UNSIGNED NOT NULL DEFAULT 0,
  -- Judicial details
  `case_number` VARCHAR(30) NULL UNIQUE,
  `court` VARCHAR(100) NULL,
  `court_branch` VARCHAR(100) NULL,
  `forum` VARCHAR(100) NULL,
  `court_link` VARCHAR(255) NULL,
  `case_value` DECIMAL(10, 2) NULL,
  `ruling_value` DECIMAL(10, 2) NULL,
  `distribution_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`condominium_id`) REFERENCES `condominiums` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`dwelling_id`) REFERENCES `dwellings` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`responsible_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ----------------------------
-- Junction Table: legal_action_residents
-- Links a legal action to one or more residents (Many-to-Many).
-- ----------------------------
CREATE TABLE `legal_action_residents` (
  `legal_action_id` INT UNSIGNED NOT NULL,
  `resident_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`legal_action_id`, `resident_id`),
  FOREIGN KEY (`legal_action_id`) REFERENCES `legal_actions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------
-- Table: notifications
-- Stores notifications for users.
-- ----------------------------
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` VARCHAR(50) NOT NULL, -- E.g., 'deadline', 'assignment'
  `message` VARCHAR(255) NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `link_url` VARCHAR(255) NULL,
  `related_item_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;