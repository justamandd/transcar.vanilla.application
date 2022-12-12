const rechargeServices = require('@services/recharges.service');
// const ticketServices = require('../services/tickets.service');

const getExpirationDate = (type, used_at) => {
    const typeTime = {
        "u": 40,
        "d": 40,
        "1d": 1440,
        "3d": 4320,
        "7d": 10080,
        "14d": 20160,
        "30d": 43200
    }

    //verificar tipo

    const now = new Date();
    let expirationDate = new Date(used_at);
    expirationDate.setMinutes(expirationDate.getMinutes() + typeTime[type]);
    expirationDate = new Date(expirationDate);

    return { now, expirationDate };
}

const isValid = (type, used_at) => {
    const { now, expirationDate } = getExpirationDate(type, used_at);
    return now < expirationDate ? true : false;
}

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

        const { ticket, type } = req.headers;

        try {
            if (ticket !== undefined && type !== undefined) {
                    if (typeCredit[type] !== undefined) {
                        const recharge = await rechargeServices.recharge(ticket, type);
        
                        if (recharge !== undefined){
                            response.status = 'success';
                            response.message = 'successful recharge';
                            response.payload = recharge
                        }else {
                            response.message = 'invalid ticket'
                        }
                    } else {
                        response.message = 'type not found';
                    }
            }
        } catch (error) {
            response.message = error.message;
        }

        res.send(response);
    },

    getExpirationDate,
    isValid,

    async listUsage(req, res) {
        const { ticket } = req.headers;

        const response = {
            status: "error",
            message: "missing data",
            payload: undefined
        }


        if (ticket) {
            const usage = await rechargeServices.listUsage(ticket);

            payload = []

            if (usage) {
                usage.forEach(log => {
                    if (!payload.find(el => el.RECHARGE_ID == log.RECHARGE_ID)){
                        payload.push({
                            RECHARGE_ID: log.RECHARGE_ID,
                            TYPE: log.TYPE,
                            STATE: log.STATE,
                            CREATED_AT: log.CREATED_AT,
                            TRANSACTIONS: []
                        })
                    }

                    if (log.TRANSACTION_ID) {
                        payload.find(el => el.RECHARGE_ID == log.RECHARGE_ID).TRANSACTIONS.push({
                            TRANSACTION_ID: log.TRANSACTION_ID,
                            PLACE: log.PLACE,
                            METHOD: log.METHOD,
                            CREATED_AT: log.CREATED_AT
                        })
                    }
                });

                response.status = 'success'
                response.message = 'successfully search'
                response.payload = payload;
            } else {
                response.message = 'invalid ticket or no recharges found'
            }
            
            res.send(response)
        }
    }
}