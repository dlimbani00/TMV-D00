-- V8: Add PAGES column to store survey page structure as JSON
ALTER TABLE SURVEYS ADD (
    PAGES CLOB
);

-- Add check constraint to ensure valid JSON (Oracle 21c+)
ALTER TABLE SURVEYS ADD CONSTRAINT CHK_PAGES_JSON CHECK (PAGES IS JSON OR PAGES IS NULL);
