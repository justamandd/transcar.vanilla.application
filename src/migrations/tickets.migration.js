require('@db');

try {
    runQuery(`
    CREATE TABLE tickets (
        ticket_id CHAR(12) PRIMARY KEY,
        credits NUMBER(1) DEFAULT 0,
        used_at TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT localtimestamp
    )
    `,[])
} catch (error) {
    console.error(error.message)
}