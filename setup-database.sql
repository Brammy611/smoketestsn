-- Run this SQL script in your Netlify Neon database to create the tables

-- Main landing page submissions
CREATE TABLE IF NOT EXISTS email_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SH2 page submissions
CREATE TABLE IF NOT EXISTS sh2_submissions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SH3 page submissions
CREATE TABLE IF NOT EXISTS sh3_submissions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_sh2_email ON sh2_submissions(email);
CREATE INDEX IF NOT EXISTS idx_sh3_email ON sh3_submissions(email);

-- Queries to view all submissions
-- SELECT * FROM email_subscribers ORDER BY subscribed_at DESC;
-- SELECT * FROM sh2_submissions ORDER BY submitted_at DESC;
-- SELECT * FROM sh3_submissions ORDER BY submitted_at DESC;

-- Query to get total counts
-- SELECT 
--   (SELECT COUNT(*) FROM email_subscribers) as main_count,
--   (SELECT COUNT(*) FROM sh2_submissions) as sh2_count,
--   (SELECT COUNT(*) FROM sh3_submissions) as sh3_count;
