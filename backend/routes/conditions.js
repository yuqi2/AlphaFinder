const express = require('express');
const router = express.Router();
const conditionController = require('../controllers/conditionController');

router.get('/', conditionController.getAllConditions);
router.get('/:id', conditionController.getConditionById);
router.post('/', conditionController.createCondition);
router.put('/:id', conditionController.updateCondition);
router.delete('/:id', conditionController.deleteCondition);

module.exports = router;
