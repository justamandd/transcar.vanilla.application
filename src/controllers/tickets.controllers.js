const rechargesService = require('@services/recharges.service');
const ticketServices = require('@services/tickets.service');
const { randomUUID } = require('crypto');
const rechargesController = require('./recharges.controller');

module.exports = {
    async createCode(req, res){
        let code = randomUUID();
        code = code.slice(0,13).replace('-','')

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        try {
            const ticket = await ticketServices.createCode(code);

            response.status = "success";
            response.message = "successful creation";
            response.payload = ticket;
        } catch (error) {
            response.message = error.message;
        }

        res.send(response);
    },

    async info(req, res) {
        const { ticket } = req.headers;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        const payload = {
            exist: false,
            valid: false, // aqui se estiver fora do prazo testar se tem crédito > 0 e/ou recarga esperando
        }

        if (ticket) {
            const ticketDb = await ticketServices.select(ticket);
            
            if (ticketDb) {
                payload.exist = true;

                const activeRecharge = await rechargesService.activeRecharge(ticket);

                if (activeRecharge) {
                    const isValid = rechargesController.isValid(activeRecharge.TYPE, ticketServices.USED_AT);

                    if (isValid || ticketDb.CREDITS > 0) {
                        payload.valid = true;
                    } else {
                        const waitingRecharge = await rechargesService.findOldestRecharge(ticket)

                        if (waitingRecharge) {
                            payload.valid = true;
                        }
                    }
                } else {
                    const waitingRecharge = await rechargesService.findOldestRecharge(ticket)

                    if (waitingRecharge) {
                        payload.valid = true;
                    }
                }
                response.status = 'success';
                response.message = 'successfuly search'
            }
        }

        response.payload = payload;

        res.send(response);
    }

}