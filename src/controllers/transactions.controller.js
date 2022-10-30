const transactionsServices = require('../services/transactions.service');
const rechargeServices = require('../services/recharges.service');
const ticketServices = require('../services/tickets.service');

module.exports = {
    //transação está funcionando como o BRASIL, não está kkkkkkkkk

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

                const ticketStatus = await ticketServices.verifyUsage(ticket);

                console.log(ticketStatus.credits);

                if (ticketStatus.used_at === null && ticketStatus.credits === 0){

                    console.log('entrou');
                    // ativar nova recarga
                    const oldestRecharge = await rechargeServices.findOldestRecharge(ticket);

                    if (oldestRecharge != []){
                        await rechargeServices.changeActiveRecharge(ticket, 'waiting', 'active');

                        await ticketServices.changeToActiveRecharge(ticket);

                        ticketStatus = ticketServices.verifyUsage(ticket);

                        if (ticketStatus.credits > 0) {
                            await ticketServices.use(ticket);
                            const transaction = await transactionService.createLog(ticket,place, method);

                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        }

                    } else {
                        response.message = 'ticket does not have a recharge';
                    }
                } else {
                    let created_at_date = new Date(ticketStatus.created_at);
                    created_at_date + typeTime[ticketStatus.type];
                    created_at_date += new Date(created_at_date);
    
                    let now = new Date();
    
                    if (now < created_at_date) {
                        const transaction = await transactionsServices.createLog(ticket, place, method);
    
                        response.status = 'success';
                        response.message = 'successful transaction';
                        response.payload = transaction;
                    } else {
                        if (ticket.credits === 0){
                            const oldestRecharge = await rechargeServices.findOldestRecharge(ticket);

                            if (oldestRecharge != []){
                                await rechargeServices.changeActiveRecharge(ticket, 'active', 'expired');
                                await rechargeServices.changeActiveRecharge(ticket, 'waiting', 'active');

                                await ticketServices.changeToActiveRecharge(ticket);

                                ticketStatus = ticketServices.verifyUsage(ticket);

                                if (ticketStatus.credits > 0) {
                                    await ticketServices.use(ticket);
                                    const transaction = await transactionService.createLog(ticket,place, method);

                                    response.status = 'success';
                                    response.message = 'successful transaction';
                                    response.payload = transaction;
                                }
                            } else {
                                response.message = 'ticket does not have a recharge';
                            }
                        }
                    }
                }


            }
            res.send(response);
        } catch (error) {
            
        }
    },
}