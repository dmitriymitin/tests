const Router = require('express').Router;
const questionGroupController = require('../controllers/question-group-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/create',authMiddleware , questionGroupController.create);
router.get('/get/all', questionGroupController.getAllGroupQuestion);

module.exports = router;
