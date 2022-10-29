const rechargeServices = require('../services/recharges.service');
const ticketServices = require('../services/tickets.service');


module.exports = {
    async recharge(req, res) {

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        const typeCredit = {
            "u": 1,
            "d": 2,
            "1d": 1,
            "3d": 1,
            "7d": 1,
            "14d": 1,
            "30d": 1
        }

        const ticket = req.headers.ticket;
        const type = req.body.type;

        try {
            if (ticket !== undefined && type !== undefined) {
                const recharge = await rechargeServices.recharge(ticket, type, 'waiting');

                response.status = 'success';
                response.message = 'successful recharge';
                response.payload = recharge.rows
            }
        } catch (error) {
            response.message = error.message;
        }

        res.send(response);
    },

    async verifyLastRecharge(ticket_id) {
        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        try {
            const recharges = await rechargeServices.findOldestRecharge(ticket_id);

            response.status = "success";
            response.message = "succefull select";
            response.payload = recharges;
        } catch (error) {
            response.message = error.message;
        }

        res.send(response);
    }
}