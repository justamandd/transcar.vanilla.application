require('../../db.connection');
const rechargesController = require ('../controllers/recharges.controller');

module.exports = {
    async createCode(code){
        await runQuery('INSERT INTO tickets (ticket_id) values (:code)', [code]);

        const response = await runQuery('SELECT * FROM tickets WHERE ticket_id = :ticket_id', [code]);

        return response.rows;
    },

    async verifyUsage(ticket_id){
        const response = await runQuery('SELECT credits, used_at, type FROM tickets INNER JOIN recharges ON ticket_id = fk_tickets_ticket_id WHERE ticket_id = :ticket_id AND type = "active"', [ticket_id]);

        return response.rows;
    },

    async changeToActivatedRecharge(ticket_id){

    }
}