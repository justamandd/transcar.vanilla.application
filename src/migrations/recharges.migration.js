require('@db');

try {
    runQuery(`
    CREATE SEQUENCE recharge_id MINVALUE 1 START WITH 1 CACHE 10;

    CREATE TABLE recharges (
        recharge_id INT DEFAULT recharge_id.NEXTVAL PRIMARY KEY,
        type VARCHAR2(3) NOT NULL,
        state VARCHAR2(7) DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT localtimestamp,
        fk_tickets_ticket_id CHAR(36)
    );
    
    ALTER TABLE recharges ADD CONSTRAINT FK_recharges_2
        FOREIGN KEY (fk_tickets_ticket_id)
        REFERENCES tickets (ticket_id)
    `,[])
} catch (error) {
    console.error(error.message)
}