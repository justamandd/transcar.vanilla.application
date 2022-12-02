const express = require('express');
const router = express.Router();

const rechargesController = require('@controllers/recharges.controller');

router.post('/', rechargesController.recharge);
router.get('/list/usage', rechargesController.listUsage)

module.exports = router;