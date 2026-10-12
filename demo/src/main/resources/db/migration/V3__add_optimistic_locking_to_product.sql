-- V3: Add version column for optimistic locking to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0 NOT NULL;
