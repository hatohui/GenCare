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
    --"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    --"created_by" UUID,
    --"updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    --"updated_by" UUID,
    --"deleted_at" TIMESTAMP,
    --"deleted_by" UUID
);
COMMENT ON TABLE "role" IS 'Role definitions for accounts';
COMMENT ON COLUMN "role"."name" IS 'Role name (e.g., admin, user)';

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
    --"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    --"created_by" UUID,
    --"updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    --"updated_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "fk_account_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT
);
--COMMENT ON TABLE "account" IS 'User accounts';
--COMMENT ON COLUMN "account"."gender" IS 'TRUE = male, FALSE = female';

ALTER TABLE "role" ADD CONSTRAINT "fk_role_created_by" FOREIGN KEY ("created_by") REFERENCES "account"("id");
ALTER TABLE "role" ADD CONSTRAINT "fk_role_updated_by" FOREIGN KEY ("updated_by") REFERENCES "account"("id");
ALTER TABLE "role" ADD CONSTRAINT "fk_role_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "account"("id");

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
    --"created_by" UUID REFERENCES "account"("id"),
    --"updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    --"updated_by" UUID REFERENCES "account"("id"),
    --"deleted_at" TIMESTAMP,
    --"deleted_by" UUID REFERENCES "account"("id"),
    CONSTRAINT "fk_refresh_token_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);
COMMENT ON TABLE "refresh_token" IS 'Refresh tokens for authentication';


-- Table: department
CREATE TABLE IF NOT EXISTS "department" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"description" TEXT,
);

-- Table: staff_info
CREATE TABLE IF NOT EXISTS "staff_info" (
	"account_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"department_id" UUID NOT NULL,
	"degree" TEXT NOT NULL,
	"year_of_experience" int NOT NULL,
	"biography" TEXT NOT NULL,
	CONSTRAINT "fk_staff_info_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT,
	CONSTRAINT "fk_staff_info_department" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT
);

-- Table: slot
CREATE TABLE IF NOT EXISTS "slot" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "no" int NOT NULL,
    "start_at" TIMESTAMP NOT NULL,
	"end_at" TIMESTAMP NOT NULL,
	"is_deleted" BOOLEAN NOT NULL DEFAULT false
);

-- Table: Schedule
CREATE TABLE IF NOT EXISTS "schedule" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slot_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
	CONSTRAINT "fk_schedule_account" FOREIGN KEY ("account_id") REFERENCES "account"("id"),
	CONSTRAINT "fk_schedule_slot" FOREIGN KEY ("slot_id") REFERENCES "slot"("id")
);

-- Table: birth_control
CREATE TABLE IF NOT EXISTS "birth_control" (
    "account_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "start_date" TIMESTAMP NOT NULL,
    "end_date" TIMESTAMP,
	"start_safe_date" TIMESTAMP,
	"end_safe_date" TIMESTAMP,
	"start_unsafe_date" TIMESTAMP,
	"end_unsafe_date" TIMESTAMP,
	CONSTRAINT "fk_birth_control_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

-- Table: conversation
CREATE TABLE IF NOT EXISTS "conversation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_one_id" UUID NOT NULL,
    "account_two_id" UUID NOT NULL,
	"start_at" TIMESTAMP,
	"status" boolean NOT NULL DEFAULT TRUE, --true: active  false: inactive
	CONSTRAINT "fk_conversation_account_one" FOREIGN KEY ("account_one_id") REFERENCES "account"("id") ON DELETE RESTRICT,
	CONSTRAINT "fk_conversation_account_two" FOREIGN KEY ("account_two_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

-- Table: message
CREATE TABLE IF NOT EXISTS "message" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL, --FK
	"created_by" UUID NOT NULL, --FK
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP,
	"content" TEXT NOT NULL,
	CONSTRAINT "fk_message_conversation" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id"),
	CONSTRAINT "fk_message_account" FOREIGN KEY ("created_by") REFERENCES "account"("id") ON DELETE RESTRICT
);

-- Table: appointment
--create enum type for appoinment
CREATE TYPE appointment_status AS ENUM ('booked', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS "appointment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_one_id" UUID NOT NULL, --FK
    "account_two_id" UUID NOT NULL, --FK
	"schedule_at" TIMESTAMP NOT NULL,
	"status" appointment_status NOT NULL DEFAULT 'booked',
	"join_url" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT "fk_appointment_account_one" FOREIGN KEY ("account_one_id") REFERENCES "account"("id") ON DELETE RESTRICT,
	CONSTRAINT "fk_appointment_account_two" FOREIGN KEY ("account_two_id") REFERENCES "account"("id") ON DELETE RESTRICT
);
-- Table: purchase
CREATE TABLE IF NOT EXISTS "purchase" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL, --FK
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "fk_purchase_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT,
);

-- Table: payment_history
CREATE TYPE payment_history_status AS ENUM ('pending', 'paid', 'expired');
CREATE TYPE payment_method_status AS ENUM ('card', 'momo', 'bank');
CREATE TABLE IF NOT EXISTS "payment_history" (
    "purchase_id" UUID PRIMARY KEY, --FK
    "transaction_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"amount" float NOT NULL,
	"status" payment_history_status NOT NULL DEFAULT 'pending',
	"expired_at" TIMESTAMP,
	"payment_method" payment_method_status NOT NULL DEFAULT 'bank',
	CONSTRAINT "fk_payment_history_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE RESTRICT,
);
-- Table: service
CREATE TABLE IF NOT EXISTS "service" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" varchar(100) NOT NULL,
	"description" text,
	"price" decimal,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP,
	"is_deleted" boolean NOT NULL DEFAULT false
);
-- Table: order_detail
CREATE TABLE IF NOT EXISTS "order_detail" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"purchase_id" UUID NOT NULL, --FK
	"service_id" UUID NOT NULL, --FK
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone_number" varchar(50) NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" boolean NOT NULL,
	CONSTRAINT "fk_order_detail_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id"),
	CONSTRAINT "fk_order_detail_service" FOREIGN KEY ("service_id") REFERENCES "service"("id")
);

-- Table: result
CREATE TABLE IF NOT EXISTS "result" (
    "order_detail_id" UUID PRIMARY KEY, -fk
	"order_date" TIMESTAMP NOT NULL,
	"sample_date" TIMESTAMP,
	"result_date" TIMESTAMP,
	"status" boolean DEFAULT false,
	"result_data" text,
	"updated_at" TIMESTAMP,
	CONSTRAINT "fk_result_order_detail" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE RESTRICT,
);

-- Table: feedback
CREATE TABLE IF NOT EXISTS "feedback" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"detail" text NOT NULL,
	"rating" int NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"created_by" UUID NOT NULL,  --fk
	"service_id" UUID NOT NULL,  --fk
	CONSTRAINT "fk_feedback_account" FOREIGN KEY ("created_by") REFERENCES "account"("id") ON DELETE RESTRICT,
	CONSTRAINT "fk_feedback_service" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT,
);

CREATE TABLE IF NOT EXISTS "blog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "published_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id")
);
COMMENT ON TABLE "blog" IS 'table for storing blog posts';
--tabble:comment
CREATE TABLE IF NOT EXISTS "comment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "blog_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
    CONSTRAINT "fk_comment_blog" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_comment_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);
COMMENT ON TABLE "comment" IS 'Save comments for blog posts';
--table:tag
CREATE TABLE IF NOT EXISTS "tag" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL UNIQUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id")
);
COMMENT ON TABLE "tag" IS 'Table for storing tags for blog posts';
-- Table: BlogTag
CREATE TABLE IF NOT EXISTS "blog_tag" (
    "blog_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
    PRIMARY KEY ("blog_id", "tag_id"),
    CONSTRAINT "fk_blog_tag_blog" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_blog_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE
);
COMMENT ON TABLE "blog_tag" IS 'Join table for many-to-many relationship between blogs and tags';
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
