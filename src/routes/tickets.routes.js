const express = require('express');
const router = express.Router();

const ticketsController = require('@controllers/tickets.controllers');

router.get('/info', ticketsController.info); //esse devolve os dados para verificação
router.post('/create', ticketsController.createCode);

module.exports = router;