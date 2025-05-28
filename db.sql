-- Improved GenCareDB Schema with Enhancements Applied
-- DROP DATABASE IF EXISTS "GenCareDB";
-- CREATE DATABASE "GenCareDB";
-- \c "GenCareDB";
-- no need for this because we're creating with docker ^.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "role" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "account" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "date_of_birth" DATE,
    "gender" BOOLEAN NOT NULL CHECK ("gender" IN (TRUE, FALSE)),
    "avatar_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID,
    "updated_at" TIMESTAMP,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "fk_account_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT
);
COMMENT ON COLUMN "account"."gender" IS 'TRUE = male, FALSE = female';

CREATE UNIQUE INDEX IF NOT EXISTS idx_account_email ON "account"("email");
CREATE INDEX IF NOT EXISTS idx_account_role_id ON "account"("role_id");
CREATE INDEX IF NOT EXISTS idx_account_is_deleted ON "account"("is_deleted");

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "refresh_token" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_used_at" TIMESTAMP,
    "expires_at" TIMESTAMP NOT NULL,
    CONSTRAINT "fk_refresh_token_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "department" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "staff_info" (
    "account_id" UUID PRIMARY KEY,
    "department_id" UUID NOT NULL,
    "degree" TEXT NOT NULL,
    "year_of_experience" INT NOT NULL,
    "biography" TEXT NOT NULL,
    CONSTRAINT "fk_staff_info_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_staff_info_department" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "slot" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "no" INT NOT NULL,
    "start_at" TIMESTAMP NOT NULL,
    "end_at" TIMESTAMP NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "schedule" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slot_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    CONSTRAINT "fk_schedule_account" FOREIGN KEY ("account_id") REFERENCES "account"("id"),
    CONSTRAINT "fk_schedule_slot" FOREIGN KEY ("slot_id") REFERENCES "slot"("id")
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "birth_control" (
    "account_id" UUID PRIMARY KEY,
    "start_date" TIMESTAMP NOT NULL,
    "end_date" TIMESTAMP,
    "start_safe_date" TIMESTAMP,
    "end_safe_date" TIMESTAMP,
    "start_unsafe_date" TIMESTAMP,
    "end_unsafe_date" TIMESTAMP,
    CONSTRAINT "fk_birth_control_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "conversation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "staff_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "start_at" TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "fk_conversation_staff" FOREIGN KEY ("staff_id") REFERENCES "account"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_conversation_member" FOREIGN KEY ("member_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "message" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "update_by" UUID,
    "updated_at" TIMESTAMP,
    "content" TEXT NOT NULL,
    CONSTRAINT "fk_message_conversation" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE
);

CREATE TYPE appointment_status AS ENUM ('booked', 'cancelled', 'completed');
CREATE TABLE IF NOT EXISTS "appointment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "schedule_at" TIMESTAMP NOT NULL,
    "status" appointment_status NOT NULL DEFAULT 'booked',
    "join_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP,
    "update_by" UUID,
    "created_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    CONSTRAINT "fk_appointment_member_id" FOREIGN KEY ("member_id") REFERENCES "account"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_appointment_staff_id" FOREIGN KEY ("staff_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "purchase" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    CONSTRAINT "fk_purchase_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TYPE payment_history_status AS ENUM ('pending', 'paid', 'expired');
CREATE TYPE payment_method_status AS ENUM ('card', 'momo', 'bank');
CREATE TABLE IF NOT EXISTS "payment_history" (
    "purchase_id" UUID PRIMARY KEY,
    "transaction_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "amount" FLOAT NOT NULL,
    "status" payment_history_status NOT NULL DEFAULT 'pending',
    "expired_at" TIMESTAMP,
    "payment_method" payment_method_status NOT NULL DEFAULT 'bank',
    CONSTRAINT "fk_payment_history_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "service" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP,
    "created_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "order_detail" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "purchase_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" BOOLEAN NOT NULL CHECK ("gender" IN (TRUE, FALSE)),
    CONSTRAINT "fk_order_detail_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id"),
    CONSTRAINT "fk_order_detail_service" FOREIGN KEY ("service_id") REFERENCES "service"("id")
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "result" (
    "order_detail_id" UUID PRIMARY KEY,
    "order_date" TIMESTAMP NOT NULL,
    "sample_date" TIMESTAMP,
    "result_date" TIMESTAMP,
    "status" BOOLEAN DEFAULT FALSE,
    "result_data" TEXT,
    "updated_at" TIMESTAMP,
    CONSTRAINT "fk_result_order_detail" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "feedback" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "detail" TEXT NOT NULL,
    "rating" INT NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    CONSTRAINT "fk_feedback_service" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT
);

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "blog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "published_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID,
    "updated_at" TIMESTAMP,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID
);
COMMENT ON TABLE "blog" IS 'Table for storing blog posts';

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "comment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "blog_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP,
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
    CONSTRAINT "fk_comment_blog" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_comment_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT
);
COMMENT ON TABLE "comment" IS 'Save comments for blog posts';

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "tag" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL UNIQUE
);
COMMENT ON TABLE "tag" IS 'Table for storing tags for blog posts';

----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "blog_tag" (
    "blog_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" UUID REFERENCES "account"("id"),
    "updated_at" TIMESTAMP,
    "updated_by" UUID REFERENCES "account"("id"),
    "deleted_at" TIMESTAMP,
    "deleted_by" UUID REFERENCES "account"("id"),
    PRIMARY KEY ("blog_id", "tag_id"),
    CONSTRAINT "fk_blog_tag_blog" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_blog_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE
);
COMMENT ON TABLE "blog_tag" IS 'Join table for many-to-many relationship between blogs and tags';

