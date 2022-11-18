require('../../db.connection');

module.exports = {
    async createLog(ticket_id, place, method){
        const response = await runQuery('INSERT INTO transactions (fk_tickets_ticket_id, place, method) VALUES (:ticket_id, :place, :method)', [ticket_id, place, method]);

        const transaction = await runQuery('SELECT * FROM transactions WHERE rowid = :id', [response.lastRowid]);

        return transaction.rows[0];
    }
}