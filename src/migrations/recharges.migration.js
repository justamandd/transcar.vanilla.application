require('../../db.connection');

runQuery(`
CREATE TABLE recharges (
    recharge_id INT PRIMARY KEY AUTOINCREMENT,
    type ENUM["u","d","1d","3d","7d","14d","30d"] NOT NULL,
    state ENUM["waiting","active","expired"] DEFAULT "waiting",
    created_at TIMESTAMP DEFAULT localtimestamp,
    fk_tickets_ticket_id CHAR(36)
);

ALTER TABLE recharges ADD CONSTRAINT FK_recharges_2
    FOREIGN KEY (fk_tickets_ticket_id)
    REFERENCES tickets (ticket_id)
`)