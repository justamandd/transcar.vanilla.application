const transactionsServices = require('../services/transactions.service');
const rechargeServices = require('../services/recharges.service');
const ticketServices = require('../services/tickets.service');
const ticketsControllers = require('./tickets.controllers');

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

        if ((ticket !== undefined) 
          && (place !== undefined) 
          && (method !== undefined))
          {
            if (await ticketServices.select(ticket) !== undefined){
                let activeRecharge = await rechargeServices.activeRecharge(ticket);
                if (activeRecharge === undefined)
                { // quer dizer que não tem nenhuma recarga ativa
                    //ver se tem recarga esperando
                    //ativar, ativar ticke
                    //usar e criar transact

                    console.log('entrou em não tem recarga ativa')

                    if (await rechargeServices.findOldestRecharge(ticket) !== undefined) 
                    {
                        await rechargeServices.changeActiveRecharge(ticket, 'waiting', 'active');

                        await ticketServices.changeToActiveRecharge(ticket);
                        
                        const transaction = await transactionsServices.createLog(ticket, place, method);

                        await ticketServices.use(ticket);

                        response.status = 'success';
                        response.message = 'successfuly transaction';
                        response.payload = transaction;
                    }
                    else 
                    {
                        response.message = 'no recharges found for this ticket';
                    }
                }
                else
                { // tem recarga ativa
                    //qtd de créditos e o tempo e ela expirou
                    const ticketInfo = await ticketServices.select(ticket);
    
                    if (ticketInfo.CREDITS > 0)
                    {//quer dizer que ele tem um bilhete duplo
                        console.log('entrou em caso de ticketduplo')

                        const now = new Date();
                        let used_at_date = new Date(ticketInfo.used_at)
                        used_at_date += typeTime[activeRecharge.type]
                        used_at_date = new Date(used_at_date)

                        if (now < used_at_date) { // tempo ainda está valido, n cobrar
                            const transaction = await transactionsServices.createLog(ticket, place, method);
                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        }
                        else 
                        {// tempo n válido, debitar credito
                            const transaction = await transactionsServices.createLog(ticket, place, method);

                            await ticketServices.use(ticket);

                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        }
                    } 
                    else if (ticketInfo.used_at !== null)
                    {
                        const now = new Date();
                        let used_at_date = new Date(ticketInfo.USED_AT)
                        used_at_date.setMinutes(used_at_date.getMinutes() + typeTime[activeRecharge.TYPE])
                        used_at_date = new Date(used_at_date)

                        if (now < used_at_date)
                        {//carga ainda válida
                            const transaction = await transactionsServices.createLog(ticket, place, method);
                            response.status = 'success';
                            response.message = 'successful transaction';
                            response.payload = transaction;
                        }
                        else
                        {//trocar recarga ou retornar erro
                            console.log('tempo inválido')

                            console.log(await rechargeServices.findOldestRecharge(ticket))


                            if (await rechargeServices.findOldestRecharge(ticket) !== undefined) 
                            {
                                await rechargeServices.changeActiveRecharge(ticket, 'active', 'expired');

                                await rechargeServices.changeActiveRecharge(ticket, 'waiting', 'active');

                                await ticketServices.changeToActiveRecharge(ticket);
                                
                                const transaction = await transactionsServices.createLog(ticket, place, method);

                                await ticketServices.use(ticket);

                                response.status = 'success';
                                response.message = 'successfuly transaction';
                                response.payload = transaction;
                            }
                            else 
                            {
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