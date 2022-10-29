require('../../db.connection');

module.exports = {
    async recharge(ticket_id, type, status){
        await runQuery('INSERT INTO recharges (fk_tickets_ticket_id, type, status) VALUES (:ticket_id, :type, :status', [ticket_id, type, status]);

        const recharge = await runQuery('SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND created_at = max(created_at)', [ticket_id]);

        return recharge;
    },

    async find(ticket_id){
        const response = await runQuery('SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id', [ticket_id]);

        return response.rows;
    },

    async findOldestRecharge(ticket_id){
        const response = await runQuery('SELECT * FROM recharges WHERE fk_tickets_ticket_id = :ticket_id AND status = "waiting" AND created_at = min(created_at)', [ticket_id]);

        return response.rows;
    },

    async changeActivatedRecharge(ticket_id, oldStatus, newStatus){
        try {
            await runQuery('UPDATE recharges SET status = :newStatus WHERE fk_tickets_ticket_id = :ticket_id AND status = :oldStatus AND created_at = min(created_at)', [ticket_id, newStatus, oldStatus]);
            
            return true;
        } catch (error) {
            return error;
        }
    }
}