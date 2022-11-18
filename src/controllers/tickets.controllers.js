const ticketServices = require('../services/tickets.service');
const { randomUUID } = require('crypto');

module.exports = {
    async createCode(req, res){
        const code = randomUUID();

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

    async use(ticket_id){
        
    },

    async select(req, res){

    },


}