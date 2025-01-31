const express = require('express');
const router = express.Router();
const gadgetController = require('../controllers/gadgetController');
const protect = require('../middleware/authMiddleware');

/**
 * Base path: /api/v1/gadgets
 * All routes are protected by authentication
 */
router.use('/gadgets', protect);

router.get('/gadgets', gadgetController.getAllGadgets);
router.post('/gadgets', gadgetController.createGadget);
router.patch('/gadgets/:id', gadgetController.updateGadget);
router.post('/gadgets/:id/self-destruct', gadgetController.selfDestruct);
router.delete('/gadgets/:id', gadgetController.decommissionGadget);

module.exports = router;