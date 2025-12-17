-- Optional
-- CREATE DATABASE IF NOT EXISTS condo_mgmt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE condo_mgmt;

-- =========================================================
-- TABLES (no foreign keys yet)
-- =========================================================

CREATE TABLE permissions (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    cpf             VARCHAR(20)  NOT NULL,
    email           VARCHAR(255) NOT NULL,
    user_type       ENUM('ADMIN','MANAGER','LAWYER','RESIDENT','OTHER') NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_cpf   (cpf),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lawyers (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    bar_number  VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),

    KEY idx_lawyers_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE condominiums (
    id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    corporate_name      VARCHAR(255) NOT NULL,
    trade_name          VARCHAR(255) NULL,
    email               VARCHAR(255) NULL,
    cnpj                VARCHAR(30)  NULL,
    phone               VARCHAR(30)  NULL,
    phone_type          ENUM('MOBILE','LANDLINE','OTHER') NULL,
    zip_code            VARCHAR(20)  NULL,
    street              VARCHAR(255) NULL,
    number              INT NULL,
    state               VARCHAR(2)   NULL,
    city                VARCHAR(255) NULL,
    address_complement  VARCHAR(255) NULL,
    created_by          INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),

    KEY idx_condominiums_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE residents (
    id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NULL,
    document_number     VARCHAR(50)  NULL,
    phone               VARCHAR(30)  NULL,
    phone_type          ENUM('MOBILE','LANDLINE','OTHER') NULL,
    zip_code            VARCHAR(20)  NULL,
    street              VARCHAR(255) NULL,
    number              INT NULL,
    address_complement  VARCHAR(255) NULL,
    state               VARCHAR(2)   NULL,
    city                VARCHAR(255) NULL,
    created_by          INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),

    KEY idx_residents_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE residential_units (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    condominium_id  INT UNSIGNED NOT NULL,
    block           VARCHAR(100) NULL,
    floor           VARCHAR(50)  NULL,
    number          INT NULL,
    street          VARCHAR(255) NULL,
    tower           VARCHAR(100) NULL,
    unique_code     VARCHAR(255) NOT NULL,
    created_by      INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),

    KEY idx_res_units_condominium_id (condominium_id),
    KEY idx_res_units_created_by     (created_by),
    KEY idx_res_units_unique_code    (unique_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE resident_units (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    resident_id     INT UNSIGNED NOT NULL,
    unit_id         INT UNSIGNED NOT NULL,
    start_date      DATETIME NOT NULL,
    end_date        DATETIME NULL,
    PRIMARY KEY (id),

    KEY idx_resident_units_resident_id (resident_id),
    KEY idx_resident_units_unit_id     (unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_permissions (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED NOT NULL,
    permission_id   INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),

    KEY idx_user_permissions_user_id       (user_id),
    KEY idx_user_permissions_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- FOREIGN KEYS (added at the end)
-- =========================================================

ALTER TABLE lawyers
    ADD CONSTRAINT fk_lawyers_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_permissions
    ADD CONSTRAINT fk_user_permissions_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT fk_user_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id);

ALTER TABLE condominiums
    ADD CONSTRAINT fk_condominiums_created_by
        FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE residents
    ADD CONSTRAINT fk_residents_created_by
        FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE residential_units
    ADD CONSTRAINT fk_residential_units_condominium
        FOREIGN KEY (condominium_id) REFERENCES condominiums(id),
    ADD CONSTRAINT fk_residential_units_created_by
        FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE resident_units
    ADD CONSTRAINT fk_resident_units_resident
        FOREIGN KEY (resident_id) REFERENCES residents(id),
    ADD CONSTRAINT fk_resident_units_unit
        FOREIGN KEY (unit_id) REFERENCES residential_units(id);


ALTER TABLE condominiums
  ADD COLUMN condo_type ENUM('APTO_BLOCO','APTO_SIMPLES','CASAS_RUA','CASAS_SIMPLES') NOT NULL
  AFTER address_complement;

ALTER TABLE residential_units
  ADD UNIQUE KEY uk_units_unique (condominium_id, unique_code);

ALTER TABLE condominiums
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

  ALTER TABLE condominiums
ADD COLUMN is_garantidora TINYINT(1) NOT NULL DEFAULT 0;


ALTER TABLE users ADD UNIQUE KEY uq_users_email (email);
ALTER TABLE users ADD UNIQUE KEY uq_users_cpf (cpf);
ALTER TABLE `users` CHANGE `user_type` `user_type` ENUM('ADMIN','MANAGER','LAWYER','ACCOUNTING','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

ALTER TABLE users
  ADD COLUMN profile_photo_path VARCHAR(255) NULL AFTER password_hash;
