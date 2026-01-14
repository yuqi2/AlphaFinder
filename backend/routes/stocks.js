const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStocks);
router.get('/:symbol', stockController.getStockBySymbol);
router.post('/filter', stockController.filterStocks);

module.exports = router;
