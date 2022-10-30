require('../../db.connection');

try {
    runQuery(`
    CREATE SEQUENCE transaction_id MINVALUE 1 START WITH 1 CACHE 10;

    CREATE TABLE transactions (
        transaction_id INT DEFAULT transaction_id.NEXTVAL PRIMARY KEY,
        place VARCHAR2(50),
        method VARCHAR2(15) NOT NULL,
        created_at TIMESTAMP DEFAULT localtimestamp,
        fk_tickets_ticket_id CHAR(36)
    );
    
    ALTER TABLE transactions ADD CONSTRAINT FK_transactions_2
        FOREIGN KEY (fk_tickets_ticket_id)
        REFERENCES tickets (ticket_id)
        ON DELETE CASCADE
    `, [])
} catch (error) {
    console.error(error.message)
}