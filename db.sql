-- Drop and create database (run these manually if needed)
-- DROP DATABASE IF EXISTS "GenCareDB";
-- CREATE DATABASE "GenCareDB";
-- \c "GenCareDB";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "role" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID,
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID
);

CREATE TABLE IF NOT EXISTS "account" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "date_of_birth" DATE,
    "gender" BOOLEAN NOT NULL, -- TRUE = male, FALSE = female
    "avatar_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID,
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "fk_account_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT
);

ALTER TABLE "role" ADD CONSTRAINT "fk_role_created_by" FOREIGN KEY ("created_by") REFERENCES "account"("id");
ALTER TABLE "role" ADD CONSTRAINT "fk_role_updated_by" FOREIGN KEY ("updated_by") REFERENCES "account"("id");
ALTER TABLE "role" ADD CONSTRAINT "fk_role_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "account"("id");

ALTER TABLE "account" ADD CONSTRAINT "fk_account_created_by" FOREIGN KEY ("created_by") REFERENCES "account"("id");
ALTER TABLE "account" ADD CONSTRAINT "fk_account_updated_by" FOREIGN KEY ("updated_by") REFERENCES "account"("id");
ALTER TABLE "account" ADD CONSTRAINT "fk_account_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "account"("id");

-----------------------------------
-- Table: refresh_token
CREATE TABLE IF NOT EXISTS "refresh_token" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_used_at" TIMESTAMP,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
    CONSTRAINT "fk_refresh_token_account" FOREIGN KEY ("account_id") REFERENCES "account"("id")
);
COMMENT ON TABLE "refresh_token" IS 'Refresh tokens for authentication';


-- Table: department
CREATE TABLE IF NOT EXISTS "department" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"description" TEXT,
	---------
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id")
);

-- Table: staff_info
CREATE TABLE IF NOT EXISTS "staff_info" (
	"account_id" UUID PRIMARY KEY,
	"department_id" UUID NOT NULL,
	"degree" TEXT NOT NULL,
	"year_of_experience" int NOT NULL,
	"biography" TEXT NOT NULL,
	--------
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
	CONSTRAINT "fk_staff_info_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT,
	CONSTRAINT "fk_staff_info_department" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT
);

--------------------------------------------------
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_role_id ON "account"("role_id");
CREATE INDEX IF NOT EXISTS idx_account_is_deleted ON "account"("is_deleted");
CREATE INDEX IF NOT EXISTS idx_refresh_token_account_id ON "refresh_token"("account_id");

-- Improved trigger function: only update updated_at if row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF row_to_json(NEW) IS DISTINCT FROM row_to_json(OLD) THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER set_updated_at_role
BEFORE UPDATE ON "role"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_account
BEFORE UPDATE ON "account"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_refresh_token
BEFORE UPDATE ON "refresh_token"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

--------------------------------------------------


--hello test commit