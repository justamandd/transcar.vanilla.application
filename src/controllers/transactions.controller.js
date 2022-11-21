const transactionsServices = require('../services/transactions.service');
const rechargeServices = require('../services/recharges.service');
const ticketServices = require('../services/tickets.service');
const rechargesController = require('./recharges.controller');

module.exports = {
    async doTransaction(req, res) {
        const ticket = req.headers.ticket;
        const { place, method } = req.body;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }

        if ((ticket !== undefined) 
          && (place !== undefined) 
          && (method !== undefined))
          {
            if (await ticketServices.select(ticket) !== undefined){
                const activeRecharge = await rechargeServices.activeRecharge(ticket);

                if (activeRecharge === undefined)
                {   // Não possuí recarga ativa, procurar recarga em espera, ativar e criar log no ticket, ou retornar erro 

                    if (await rechargeServices.findOldestRecharge(ticket) !== undefined) 
                    {
                        await rechargeServices.activateRecharge(ticket);

                        await ticketServices.changeToActiveRecharge(ticket);
                        
                        const transaction = await transactionsServices.createLog(ticket, place, method);

                        await ticketServices.use(ticket);

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
    
                    if (ticketInfo.used_at !== null)
                    {
                        if (rechargesController.isExpired(activeRecharge.TYPE, ticketInfo.USED_AT))
                        {   //ticket tem registro de uso porém ainda está dentro do tempo
                            const transaction = await transactionsServices.createLog(ticket, place, method);
                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        } 
                        else if (ticketInfo.CREDITS > 0) 
                        {//quer dizer que ele tem um bilhete duplo
                            const transaction = await transactionsServices.createLog(ticket, place, method);

                            await ticketServices.use(ticket);

                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        } 
                        else 
                        {   //ticket não está dentro do tempo, tentar trocar recarga ou retornar erro
                            if (await rechargeServices.findOldestRecharge(ticket) !== undefined) 
                            {
                                if (await rechargeServices.changeActiveRecharge(ticket))
                                {   
                                    await ticketServices.changeToActiveRecharge(ticket);
                                    
                                    const transaction = await transactionsServices.createLog(ticket, place, method);
    
                                    await ticketServices.use(ticket);
    
                                    response.status = 'success';
                                    response.message = 'successfuly transaction';
                                    response.payload = transaction;
                                }
                            } else {
                                response.message = 'no recharges found for this ticket';
                            }
                        }
                    }
                }
            } else {
                response.message = "ticket not found or invalid";
            }
        }
        res.send(response);
    },
}