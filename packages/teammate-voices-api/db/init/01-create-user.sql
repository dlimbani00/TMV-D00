-- Create TEAMMATE_VOICES user for the application
-- This runs inside FREEPDB1 (pluggable database)
ALTER SESSION SET CONTAINER = FREEPDB1;

CREATE USER teammate_voices IDENTIFIED BY "ChangeMe123";
GRANT CONNECT, RESOURCE TO teammate_voices;
GRANT CREATE SESSION TO teammate_voices;
GRANT CREATE TABLE TO teammate_voices;
GRANT CREATE SEQUENCE TO teammate_voices;
GRANT UNLIMITED TABLESPACE TO teammate_voices;
