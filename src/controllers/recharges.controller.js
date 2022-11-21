const rechargeServices = require('../services/recharges.service');
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

    const now = new Date();
    let expirationDate = new Date(used_at);
    expirationDate.setMinutes(expirationDate.getMinutes() + typeTime[type]);
    expirationDate = new Date(expirationDate);

    return { now, expirationDate };
}

const isExpired = (type, used_at) => {
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
    },

    getExpirationDate,
    isExpired,
}