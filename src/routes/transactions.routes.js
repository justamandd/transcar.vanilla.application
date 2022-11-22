const express = require('express');
const router = express.Router();

const transactionsController = require('../controllers/transactions.controller');

// router.get('/', transactionsController.list);
router.get('/recharges', transactionsController.selectByRecharges);
router.get('/tickets', transactionsController.selectByTickets);
router.get('/', transactionsController.select);
router.post('/', transactionsController.doTransaction);

module.exports = router;