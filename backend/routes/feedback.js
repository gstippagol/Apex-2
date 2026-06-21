const express = require('express');
const { getFeedback, createFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createFeedback);
router.get('/', authorize('admin', 'superadmin'), getFeedback);
router.delete('/:id', authorize('admin', 'superadmin'), deleteFeedback);

module.exports = router;
