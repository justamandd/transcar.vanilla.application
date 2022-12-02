require('@db');

module.exports = {
    async recharge(ticket_id, type){
        await runQuery('INSERT INTO recharges (fk_tickets_ticket_id, type) VALUES (:ticket_id, :type)', [ticket_id, type]);

        const recharge = await runQuery('SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND created_at = (SELECT max(created_at) FROM recharges WHERE fk_tickets_ticket_id = :ticket_id)', [ticket_id, ticket_id]);

        return recharge.rows[0];
    },

    async find(ticket_id){
        const response = await runQuery('SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id', [ticket_id]);

        return response.rows;
    },

    async findOldestRecharge(ticket_id){
        const response = await runQuery("SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting' AND created_at = (SELECT min(created_at) FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting')", [ticket_id, ticket_id]);

        if (!response.rows[0]) {
            return false
        }

        return response.rows[0];
    },

    async changeActiveRecharge(ticket_id){
        try {
            await runQuery(
                "UPDATE recharges SET state = 'expired' WHERE fk_tickets_ticket_id = :ticket_id AND state = 'active' AND created_at = (SELECT min(created_at) FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'active')",
                [ticket_id]
            );

            const affectedRows = await runQuery(
                "UPDATE recharges SET state = 'active' WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting' AND created_at = (SELECT min(created_at) FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting')",
                [ticket_id]
            );

            const response = await runQuery(`SELECT * FROM recharges WHERE rowid = '${affectedRows.lastRowid}'`, []);

            return response.rows[0];
        } catch (error) {
            return error;
        }
    },

    async activateRecharge(ticket_id) {
        try {
            const affectedRows = await runQuery(
                "UPDATE recharges SET state = 'active' WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting' AND created_at = (SELECT min(created_at) FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'waiting')",
                [ticket_id]
            )

            const response = await runQuery(`SELECT * FROM recharges WHERE rowid = '${affectedRows.lastRowid}'`, []);

            return response.rows[0];
        } catch (error) {
            return error;
        }
    },

    async activeRecharge(ticket_id){
        try {
            const res = await runQuery("SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND state = 'active'", [ticket_id]);

            if (!res.rows[0]) {
                return false;
            }

            return res.rows[0];
        } catch (error) {
            return error;
        }
    },

    async listUsage(ticket) {
        try {
            const res = await runQuery("SELECT  r.recharge_id, r.type, r.state,t.transaction_id, t.place, t.method, t.created_at FROM recharges r LEFT OUTER JOIN transactions t ON recharge_id = fk_recharges_recharge_id where r.fk_tickets_ticket_id = :code ORDER BY r.recharge_id DESC", [ticket])

            if (!res.rows.length) {
                return false;
            }

            return res.rows;
        } catch (error) {
            return error;
        }
    }
}