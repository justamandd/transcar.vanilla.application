const express = require('express');
const router = express.Router();

const ticketsRouter = require('@routes/tickets.routes');
const rechargesRouter = require('@routes/recharges.routes');
const transactionsRouter = require('@routes/transactions.routes');

router.use('/tickets', ticketsRouter);
router.use('/recharges', rechargesRouter);
router.use('/transactions', transactionsRouter);

module.exports = router;