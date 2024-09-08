const Router = require('express').Router;
const questionController = require('../controllers/question-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/create',authMiddleware , questionController.create);
router.get('/get/all', questionController.getAllQuestion);

module.exports = router;
