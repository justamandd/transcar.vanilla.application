require('../../db.connection');

module.exports = {
    async createLog(ticket_id, place, method, recharge_id){
        const response = await runQuery('INSERT INTO transactions (fk_tickets_ticket_id, place, method, fk_recharges_recharge_id) VALUES (:ticket_id, :place, :method, :recharge_id)', [ticket_id, place, method, recharge_id]);

        const transaction = await runQuery('SELECT * FROM transactions WHERE rowid = :id', [response.lastRowid]);

        return transaction.rows[0];
    }
}