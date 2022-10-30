require('../../db.connection');

module.exports = {
    async createLog(ticket_id, place, method){
        await runQuery('INSERT INTO transactions (fk_tickets_ticket_id, place, method) VALUES (:ticket_id, :place, :method)', [ticket_id, place, method]);

        const transaction = await runQuery('SELECT * FROM transactions where ticket_id = :fk_tickets_ticket_id AND created_at = (SELECT max(created_at) FROM transactions WHERE fk_tickets_ticket_id = :ticket_id)', [ticket_id, ticket_id]);

        return transaction.rows[0];
    }
}