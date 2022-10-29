const express = require('express');
const router = express.Router();

const rechargesController = require('../controllers/recharges.controller');

// router.get('/', rechargesController.list);
router.get('/', rechargesController.select);
router.post('/', rechargesController.recharge);

module.exports = router;