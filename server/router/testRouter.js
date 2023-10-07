const Router = require('express').Router;
const TestController = require('../controllers/test-controller');
const TestUserController = require('../controllers/test-user-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');

//запросы которые могут отправялть неавторизованные пользователи
router.post('/saveAnswer', TestUserController.saveAnswer);
router.get('/users/all', TestController.getUsersAll);
router.get('/user/getOne/:id', TestController.getUserOne);

//запросы которые могут отправялть только авторизованные пользователи
router.post('/create',authMiddleware, TestController.create);
router.post('/createCustom',authMiddleware, TestController.createCustom);
router.post('/custom/addQuestion/:id',authMiddleware, TestController.addQuestionCustomTest);
router.get('/all',authMiddleware, TestController.getAll);
router.get('/getOneInfo/:id',authMiddleware, TestController.getOneInfo);
router.get('/getOne/:id',authMiddleware, TestController.getOne);
router.get('/getOneInfo/custom/:id',authMiddleware, TestController.getOneCustomTestInfo);
router.post('/changeStatusOne', authMiddleware, TestController.changeStatusOne);
router.post('/changeKeyOne',authMiddleware, TestController.changeKeyOne);
router.delete('/deleteOne/:id',authMiddleware, TestController.deleteOne);
router.delete('/custom/deleteOneQuestion',authMiddleware, TestController.deleteOneCustomQuestion);
router.get('/getAllQuestion',authMiddleware, TestController.getAllQuestion);

module.exports = router;
