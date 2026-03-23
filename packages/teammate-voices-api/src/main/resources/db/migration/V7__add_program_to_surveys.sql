-- V7: Add program_id, build_status, and cycle columns to SURVEYS
ALTER TABLE SURVEYS ADD (
    program_id NUMBER,
    build_status VARCHAR2(20) DEFAULT 'DRAFT' NOT NULL,
    cycle VARCHAR2(100)
);

ALTER TABLE SURVEYS ADD CONSTRAINT fk_survey_program FOREIGN KEY (program_id) REFERENCES PROGRAMS(program_id);
ALTER TABLE SURVEYS ADD CONSTRAINT chk_build_status CHECK (build_status IN ('DRAFT', 'PUBLISHED'));

CREATE INDEX idx_surveys_program ON SURVEYS(program_id);
CREATE INDEX idx_surveys_build_status ON SURVEYS(build_status);

-- Link existing seed survey to first program
UPDATE SURVEYS SET program_id = 1, cycle = '2026 Q1' WHERE survey_id = 1;
