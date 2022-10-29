const transactionsServices = require('../services/transactions.service');
const ticketServices = require('../services/ticket.service');

module.exports = {
    async doTransaction(req, res) {
        const ticket = req.headers.ticket;
        const { place, method } = req.body;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        const typeTime = {
            "u": 40,
            "d": 40,
            "1d": 1440,
            "3d": 4320,
            "7d": 10080,
            "14d": 20160,
            "30d": 43200
        }

        try {
            if (ticket !== undefined && place !== undefined && method !== undefined) {
                const ticketStatus = ticketServices.verifyUsage(ticket);

                let created_at_date = new Date(ticketStatus.created_at);
                created_at_date + typeTime[ticketStatus.type];
                created_at_date += new Date(created_at_date);

                let now = new Date();


                if (ticket.credits !== null && now < created_at_date) {
                    const transaction = await transactionsServices.createLog(ticket, place, method);

                    response.status = 'success';
                    response.message = 'successful transaction';
                    response.payload = transaction;
                } else {
                    if (ticket.credits === null){
                        


                        //verificar se tem recarga
                        //se tiver atualizar
                        //criar transaction
                        //descontar credito e criar timestamp

                        //se n tiver retornar erro 
                    } else {
                        //verificar se tem credito
                        //se tiver descontar e criar transaction e timestamp
                        
                        //se n tiver, verificar se tem recarga
                        //se tiver atualizar
                        //criar transaction
                        //descontar credito e criar timestamp
                    }
                }
            }
            res.send(response);
        } catch (error) {
            
        }
    },
}