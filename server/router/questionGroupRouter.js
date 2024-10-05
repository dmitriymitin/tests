const Router = require('express').Router;
const questionGroupController = require('../controllers/question-group-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/create',authMiddleware , questionGroupController.create);
router.post('/update',authMiddleware , questionGroupController.update);
router.get('/get/allGroupQuestion', questionGroupController.getAllGroupQuestion);
router.delete('/deleteOne/:id', questionGroupController.deleteOne);

module.exports = router;
