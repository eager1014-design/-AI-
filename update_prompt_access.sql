-- Add diagnosis_result column to track user's AI diagnosis
-- This will be stored as JSON text containing diagnosis results
ALTER TABLE user ADD COLUMN diagnosis_result TEXT;
ALTER TABLE user ADD COLUMN diagnosis_completed_at DATETIME;

-- Add notes column to UserPromptAccess for admin notes
-- ALTER TABLE user_prompt_access ADD COLUMN admin_notes TEXT;
