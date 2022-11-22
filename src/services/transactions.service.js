const { select } = require('./tickets.service');

require('../../db.connection');

module.exports = {
    async createLog(ticket_id, place, method, recharge_id){
        const response = await runQuery('INSERT INTO transactions (fk_tickets_ticket_id, place, method, fk_recharges_recharge_id) VALUES (:ticket_id, :place, :method, :recharge_id)', [ticket_id, place, method, recharge_id]);

        const transaction = await runQuery('SELECT * FROM transactions WHERE rowid = :id', [response.lastRowid]);

        return transaction.rows[0];
    },

    async findByTicket(ticket_id){
        const transactions = await runQuery('SELECT * FROM transactions WHERE fk_tickets_ticket_id = :ticket_id', [ticket_id]);

        return transactions.rows;
    },

    async findByRecharges(recharge_id){
        const transactions = await runQuery('SELECT * FROM transactions WHERE fk_recharges_recharge_id = :recharge_id', [recharge_id]);

        return transactions.rows;
    },

    async select(transaction_id){
        const transaction = await runQuery('SELECT * FROM transactions WHERE transaction_id = :transaction_id', [transaction_id]);

        return transaction.rows[0];
    },
}