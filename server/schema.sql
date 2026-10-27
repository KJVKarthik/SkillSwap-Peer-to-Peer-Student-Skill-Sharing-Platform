-- ============================================================
-- Student Skill Swap Peer-to-Peer Database Schema (MySQL)
-- Currency: Indian Rupees (₹)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `skillswap` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skillswap`;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `university` VARCHAR(160) NOT NULL DEFAULT 'University',
  `major` VARCHAR(160) NOT NULL DEFAULT 'General Studies',
  `avatar` TEXT,
  `bio` TEXT,
  `hourly_rate` INT NOT NULL DEFAULT 0 COMMENT 'Hourly tutoring rate in Indian Rupees (₹)',
  `open_to_swap` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = open for 1-on-1 free barter',
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `review_count` INT NOT NULL DEFAULT 0,
  `verified_student` TINYINT(1) NOT NULL DEFAULT 1,
  `location` VARCHAR(160) NOT NULL DEFAULT 'Campus / Online',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_email` (`email`),
  INDEX `idx_students_university` (`university`),
  INDEX `idx_students_hourly_rate` (`hourly_rate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Skills Offered (What the student can teach)
CREATE TABLE IF NOT EXISTS `skills_offered` (
  `id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `category` VARCHAR(80) NOT NULL DEFAULT 'General',
  `level` VARCHAR(40) NOT NULL DEFAULT 'Intermediate',
  `description` TEXT,
  `is_swap_available` TINYINT(1) NOT NULL DEFAULT 1,
  `hourly_price` INT NOT NULL DEFAULT 0 COMMENT 'Price in Indian Rupees (₹)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_offered_student` (`student_id`),
  INDEX `idx_offered_name` (`name`),
  INDEX `idx_offered_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Skills Wanted (What the student wants to learn)
CREATE TABLE IF NOT EXISTS `skills_wanted` (
  `id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `category` VARCHAR(80) NOT NULL DEFAULT 'General',
  `level` VARCHAR(40) NOT NULL DEFAULT 'Beginner',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_wanted_student` (`student_id`),
  INDEX `idx_wanted_name` (`name`),
  INDEX `idx_wanted_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Swap & Paid Session Requests
CREATE TABLE IF NOT EXISTS `swap_requests` (
  `id` VARCHAR(64) PRIMARY KEY,
  `requester_id` VARCHAR(64) NOT NULL,
  `requester_name` VARCHAR(120) NOT NULL,
  `requester_email` VARCHAR(191) NOT NULL,
  `requester_avatar` TEXT,
  `provider_id` VARCHAR(64) NOT NULL,
  `provider_name` VARCHAR(120) NOT NULL,
  `provider_email` VARCHAR(191) NOT NULL,
  `type` ENUM('swap', 'paid') NOT NULL DEFAULT 'swap',
  `offered_skill` VARCHAR(120) DEFAULT NULL,
  `requested_skill` VARCHAR(120) NOT NULL,
  `duration_hours` DECIMAL(3, 1) NOT NULL DEFAULT 1.0,
  `total_amount` INT NOT NULL DEFAULT 0 COMMENT 'Total amount in Indian Rupees (₹)',
  `scheduled_time` VARCHAR(160) NOT NULL DEFAULT 'Flexible / Coordinate via Gmail',
  `status` ENUM('pending', 'accepted', 'declined', 'completed') NOT NULL DEFAULT 'pending',
  `meeting_platform` VARCHAR(80) NOT NULL DEFAULT 'Google Meet',
  `meeting_link` TEXT,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_req_requester` (`requester_id`),
  INDEX `idx_req_provider` (`provider_id`),
  INDEX `idx_req_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Student Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `reviewer_id` VARCHAR(64) NOT NULL,
  `reviewer_name` VARCHAR(120) NOT NULL,
  `reviewer_avatar` TEXT,
  `reviewer_university` VARCHAR(160) DEFAULT 'University Peer',
  `rating` INT NOT NULL DEFAULT 5,
  `skill_name` VARCHAR(120) NOT NULL,
  `session_type` VARCHAR(80) NOT NULL DEFAULT 'Skill Swap',
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_reviews_student` (`student_id`),
  INDEX `idx_reviews_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Mail Log (Gmail contact drafts initiated from the site)
CREATE TABLE IF NOT EXISTS `mail_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `sender_id` VARCHAR(64) DEFAULT NULL,
  `sender_name` VARCHAR(120) NOT NULL,
  `sender_email` VARCHAR(191) NOT NULL,
  `mentor_id` VARCHAR(64) NOT NULL,
  `mentor_name` VARCHAR(120) NOT NULL,
  `mentor_email` VARCHAR(191) NOT NULL,
  `mentor_university` VARCHAR(160) DEFAULT NULL,
  `skill_name` VARCHAR(120) NOT NULL,
  `session_type` VARCHAR(80) NOT NULL DEFAULT 'Free Skill Swap',
  `hourly_rate` INT NOT NULL DEFAULT 0 COMMENT 'in ₹',
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `draft_opened` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Gmail compose window was launched in browser',
  `opened_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_maillogs_mentor` (`mentor_id`),
  INDEX `idx_maillogs_sender` (`sender_id`),
  INDEX `idx_maillogs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notifications Feed (simulated email notifications)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(64) PRIMARY KEY,
  `recipient_email` VARCHAR(191) NOT NULL,
  `recipient_name` VARCHAR(120) NOT NULL,
  `sender_name` VARCHAR(120) NOT NULL,
  `sender_email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_recipient` (`recipient_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
