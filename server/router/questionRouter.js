const Router = require('express').Router;
const questionController = require('../controllers/question-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/get/one/:id', questionController.getOneQuestion);
router.get('/get/all', questionController.getAllQuestion);
router.post('/create',authMiddleware , questionController.create);
router.post('/update',authMiddleware , questionController.update);
router.delete('/deleteOne/:id',authMiddleware, questionController.deleteOne);

module.exports = router;
