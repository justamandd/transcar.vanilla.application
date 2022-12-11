require('@db');

try {
    runQuery(`
    CREATE SEQUENCE transaction_id MINVALUE 1 START WITH 1;

    CREATE TABLE transactions (
        transaction_id INT DEFAULT transaction_id.NEXTVAL PRIMARY KEY,
        place VARCHAR2(50),
        method VARCHAR2(15) NOT NULL,
        created_at TIMESTAMP DEFAULT localtimestamp,
        fk_tickets_ticket_id CHAR(12),
        fk_recharges_recharge_id INT
    );
    
    ALTER TABLE transactions ADD CONSTRAINT FK_transactions_2
        FOREIGN KEY (fk_tickets_ticket_id)
        REFERENCES tickets (ticket_id)
        ON DELETE CASCADE;

    ALTER TABLE transactions ADD CONSTRAINT FK_transactions_3
        FOREIGN KEY (fk_recharges_recharge_id)
        REFERENCES recharges (recharge_id)
        ON DELETE RESTRICT
    `, [])
} catch (error) {
    console.error(error.message)
}