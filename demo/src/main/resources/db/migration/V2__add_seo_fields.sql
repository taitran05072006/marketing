-- =============================================================================
-- V2__add_seo_fields.sql: Safe migration for SEO metadata, redirects and indexes
-- 100% Compatible with MySQL 8.0+ (No syntax errors on CREATE INDEX)
-- Idempotent: Checks information_schema before adding columns and indexes
-- =============================================================================

-- 1. Helper Procedure: Add Column If Not Exists
DROP PROCEDURE IF EXISTS add_column_if_not_exists;
DELIMITER $$
CREATE PROCEDURE add_column_if_not_exists(
    IN p_table VARCHAR(64),
    IN p_column VARCHAR(64),
    IN p_definition VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table
          AND COLUMN_NAME = p_column
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

-- 2. Helper Procedure: Add Index If Not Exists
DROP PROCEDURE IF EXISTS add_index_if_not_exists;
DELIMITER $$
CREATE PROCEDURE add_index_if_not_exists(
    IN p_table VARCHAR(64),
    IN p_index VARCHAR(64),
    IN p_columns VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table
          AND INDEX_NAME = p_index
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', p_table, '` ADD INDEX `', p_index, '` (', p_columns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

-- 3. Add SEO Fields to Products
CALL add_column_if_not_exists('products', 'meta_title', 'VARCHAR(255) NULL AFTER description');
CALL add_column_if_not_exists('products', 'meta_description', 'VARCHAR(500) NULL AFTER meta_title');
CALL add_column_if_not_exists('products', 'og_image', 'VARCHAR(500) NULL AFTER meta_description');
CALL add_column_if_not_exists('products', 'canonical_url', 'VARCHAR(500) NULL AFTER og_image');

-- 4. Add Additional SEO Fields to Articles
CALL add_column_if_not_exists('articles', 'og_image', 'VARCHAR(500) NULL AFTER meta_description');
CALL add_column_if_not_exists('articles', 'canonical_url', 'VARCHAR(500) NULL AFTER og_image');

-- 5. Add SEO Fields to Product Categories
CALL add_column_if_not_exists('product_categories', 'meta_title', 'VARCHAR(255) NULL AFTER description');
CALL add_column_if_not_exists('product_categories', 'meta_description', 'VARCHAR(500) NULL AFTER meta_title');

-- 6. Add SEO Fields to Article Categories
CALL add_column_if_not_exists('article_categories', 'meta_title', 'VARCHAR(255) NULL AFTER description');
CALL add_column_if_not_exists('article_categories', 'meta_description', 'VARCHAR(500) NULL AFTER meta_title');

-- 7. Create Slug Redirects Table
CREATE TABLE IF NOT EXISTS slug_redirects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    old_slug VARCHAR(500) NOT NULL,
    new_slug VARCHAR(500) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_slug_redirect_old (old_slug),
    INDEX idx_slug_redirect_type (entity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Add Composite Indexes for High-performance SEO & Sitemap queries
CALL add_index_if_not_exists('articles', 'idx_article_status_updated', 'status, updated_at');
CALL add_index_if_not_exists('products', 'idx_product_status_updated', 'status, updated_at');

-- 9. Clean up Helper Procedures
DROP PROCEDURE IF EXISTS add_column_if_not_exists;
DROP PROCEDURE IF EXISTS add_index_if_not_exists;
