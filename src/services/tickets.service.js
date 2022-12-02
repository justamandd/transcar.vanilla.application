require('@db');

const rechargesController = require('@controllers/recharges.controller');

module.exports = {
    //retorna o registro codigo criado
    async createCode(code){
        await runQuery('INSERT INTO tickets (ticket_id) values (:code)', [code]);

        const response = await runQuery('SELECT * FROM tickets WHERE ticket_id = :ticket_id', [code]);

        return response.rows[0];
    },

    async select(code){
        const res = await runQuery('SELECT * FROM tickets WHERE ticket_id = :ticket_id', [code]);

        if (!res.rows[0])
        {
            return false;
        }

        return res.rows[0];
    },

    //retorna informoções importantes para verificar se está ativo, qnts creditos e o tempo para testar
    async verifyUsage(ticket_id){
        const response = await runQuery("SELECT credits, used_at FROM tickets WHERE tickets.ticket_id = :ticket_id", [ticket_id]);

        return response.rows[0];
    },

    async changeToActiveRecharge(ticket_id){
        let type = await runQuery("SELECT type FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'active'", [ticket_id]);

        type = type.rows[0];

        const typeCredit = {
            "u": 1,
            "d": 2,
            "1d": 1,
            "3d": 1,
            "7d": 1,
            "14d": 1,
            "30d": 1
        }

        await runQuery("UPDATE tickets SET credits = :typeCredit, used_at = NULL WHERE ticket_id = :ticket_id", [typeCredit[type.TYPE], ticket_id]);
    },

    async use(ticket_id){
        await runQuery("UPDATE tickets SET used_at = localtimestamp, credits = credits-1 WHERE ticket_id = :ticket_id", [ticket_id]);
    },

    async validate(ticket, typeActiveRecharge) {
        rechargesController.getExpirationDate
    }
}