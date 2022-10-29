const express = require('express');
const router = express.Router();

const ticketsController = require('../controllers/tickets.controllers');

// router.get('/', ticketsController.list);
router.get('/', ticketsController.select);
router.post('/create', ticketsController.createCode);
router.delete('/delete', ticketsController.delete);

module.exports = router;