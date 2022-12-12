const transactionsServices = require('@services/transactions.service');
const rechargeServices = require('@services/recharges.service');
const ticketServices = require('@services/tickets.service');
const rechargesController = require('@controllers/recharges.controller');

module.exports = {
    async transaction(req, res) {
        const ticket = req.headers.ticket;
        const { place, method } = req.body;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        if ((ticket) && (place) && (method))
          {
            if (await ticketServices.select(ticket)){
                const activeRecharge = await rechargeServices.activeRecharge(ticket);

                if (!activeRecharge)
                {   // Não possuí recarga ativa, procurar recarga em espera, ativar e criar log no ticket, ou retornar erro 

                    if (await rechargeServices.findOldestRecharge(ticket)) 
                    {
                        const currentRecharge = await rechargeServices.activateRecharge(ticket);

                        await ticketServices.changeToActiveRecharge(ticket);
                        
                        const transaction = await transactionsServices.createLog(ticket, place, method, currentRecharge.RECHARGE_ID);

                        ticketServices.use(ticket);

                        response.status = 'success';
                        response.message = 'successfuly transaction';
                        response.payload = transaction;
                    } else {
                        response.message = 'no recharges found for this ticket';
                    }
                }
                else
                { // tem recarga ativa
                    //qtd de créditos e o tempo e ela expirou
                    const ticketInfo = await ticketServices.select(ticket);
    
                    if (rechargesController.isValid(activeRecharge.TYPE, ticketInfo.USED_AT))
                    {   //ticket tem registro de uso porém ainda está dentro do tempo
                        const transaction = await transactionsServices.createLog(ticket, place, method, activeRecharge.RECHARGE_ID);
                        response.status = 'success';
                        response.message = 'successful transaction';
                        response.payload = transaction;
                    } 
                    else if (ticketInfo.CREDITS > 0) 
                    {//quer dizer que ele tem um bilhete duplo
                        const transaction = await transactionsServices.createLog(ticket, place, method, activeRecharge.RECHARGE_ID);

                        ticketServices.use(ticket);

                        response.status = 'success';
                        response.message = 'successful transaction';
                        response.payload = transaction;
                    } 
                    else 
                    {   //ticket não está dentro do tempo, tentar trocar recarga ou retornar erro
                        if (await rechargeServices.findOldestRecharge(ticket)) 
                        {
                            const currentRecharge = await rechargeServices.changeActiveRecharge(ticket);

                            if (currentRecharge)
                            {   
                                await ticketServices.changeToActiveRecharge(ticket);
                                
                                const transaction = await transactionsServices.createLog(ticket, place, method, currentRecharge.RECHARGE_ID);

                                ticketServices.use(ticket);

                                response.status = 'success';
                                response.message = 'successfuly transaction';
                                response.payload = transaction;
                            }
                        } else {
                            response.message = 'your ticket is expired and no recharges found for this ticket';
                        }
                    }
                }
            } else {
                response.message = "ticket not found or invalid";
            }
        }
        res.send(response);
    },

    async selectByRecharges(req, res) {
        const { recharge } = req.headers;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        try {
            const transactions = await transactionsServices.findByRecharges(recharge);

            if (transactions !== undefined) {
                response.status = "success";
                response.message = "successfuly search";
                response.payload = transactions;
            } else {
                response.message = "invalid recharge or recharge isn't activated";
            }

            res.send(response);
        } catch (error) {
            res.send(error)
        }
    },

    async selectByTickets(req, res) {
        const { ticket } = req.headers;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        try {
            const transactions = await transactionsServices.findByTicket(ticket);

            if (transactions !== undefined) {
                response.status = "success";
                response.message = "successfuly search";
                response.payload = transactions;
            } else {
                response.message = "invalid ticket";
            }

            res.send(response);
        } catch (error) {
            res.send(error)
        }
    },
    
    async select(req, res) {
        const { transaction } = req.headers;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        try {
            const transactionResponse = await transactionsServices.select(transaction);

            if (transactionResponse !== undefined) {
                response.status = "success";
                response.message = "successfuly search";
                response.payload = transactionResponse;
            } else {
                response.message = "invalid ticket";
            }

            res.send(response);
        } catch (error) {
            res.send(error)
        }
    }
}