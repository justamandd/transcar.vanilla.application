require('../../db.connection');

runQuery(`
CREATE TABLE tickets (
    ticket_id CHAR(36) PRIMARY KEY,
    credits NUMBER(1) DEFAULT 0,
    used_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT localtimestamp
)
`)