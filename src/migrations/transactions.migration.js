require('../../db.connection');

runQuery(`
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY,
    place VARCHAR2(50),
    method ENUM["bus","train","subway"],
    created_at TIMESTAMP,
    fk_tickets_ticket_id CHAR(36)
);
 
ALTER TABLE transactions ADD CONSTRAINT FK_transactions_2
    FOREIGN KEY (fk_tickets_ticket_id)
    REFERENCES tickets (ticket_id)
    ON DELETE CASCADE;
`)