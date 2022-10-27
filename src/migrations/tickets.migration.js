require('../../db.connection');

runQuery(`
CREATE TABLE tickets (
    ticket_id CHAR(36) PRIMARY KEY,
    credits NUMBER(1),
    used_at TIMESTAMP,
    created_at TIMESTAMP
);
`)