const express = require('express');
const router = express.Router();

const transactionsController = require('@controllers/transactions.controller');

router.post('/', transactionsController.transaction);

module.exports = router;