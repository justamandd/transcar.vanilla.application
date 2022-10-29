const express = require('express');
const router = express.Router();

const ticketsRouter = require('./tickets.routes');
const rechargesRouter = require('./recharges.routes');
const transactionsRouter = require('./transactions.routes');

router.use('/tickets', ticketsRouter);
router.use('/recharges', rechargesRouter);
router.use('/transactions', transactionsRouter);

module.exports = router;