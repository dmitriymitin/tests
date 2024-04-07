const Router = require('express').Router;
const TestController = require('../controllers/test-controller');
const TestUserController = require('../controllers/test-user-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');

//запросы которые могут отправялть неавторизованные пользователи
router.post('/saveAnswer', TestUserController.saveAnswer);
router.get('/users/all', TestController.getUsersTestsAll);
router.get('/user/getOne/:id', TestController.getUserOne);

//запросы которые могут отправялть только авторизованные пользователи
router.post('/create',authMiddleware, TestController.create);
router.post('/create/folder',authMiddleware, TestController.createFolder);
router.post('/update/folder',authMiddleware, TestController.updateFolder);
router.post('/putFolderOne',authMiddleware, TestController.putOneTestInFolder);

router.get('/get/folder',authMiddleware, TestController.getFolder);
router.delete('/deleteOne/folder/:id',authMiddleware, TestController.deleteOneFolder);

router.post('/openAll',authMiddleware, TestController.openAll);
router.post('/closeAll',authMiddleware, TestController.closeAll);
router.post('/clearAllResults',authMiddleware, TestController.clearAllResults);
router.get('/downloadTest/:id', TestController.downloadTest);
router.post('/createCustom',authMiddleware, TestController.createCustom);
router.post('/custom/addQuestion/:id',authMiddleware, TestController.addQuestionCustomTest);
router.post('/custom/updateOneQuestion',authMiddleware, TestController.updateQuestionCustomTest);
router.post('/description/updateDescription/:id',authMiddleware, TestController.updateDescription)
router.get('/all',authMiddleware, TestController.getAll);
router.get('/getOneInfo/:id',authMiddleware, TestController.getOneInfo);
router.get('/custom/getOneQuestionCustomInfo/:id',authMiddleware, TestController.getOneQuestionCustomInfo);
router.get('/getOne/:id',authMiddleware, TestController.getOne);
router.get('/getOneInfo/custom/:id',authMiddleware, TestController.getOneCustomTestInfo);
router.post('/changeStatusOne', authMiddleware, TestController.changeStatusOne);
router.post('/changeKeyOne',authMiddleware, TestController.changeKeyOne);
router.post('/updateFirstQuestion',authMiddleware, TestController.updateFirstQuestion);
router.delete('/deleteOne/:id',authMiddleware, TestController.deleteOne);
router.delete('/clearResults/:id',authMiddleware, TestController.clearResults);
router.delete('/custom/deleteOneQuestion',authMiddleware, TestController.deleteOneCustomQuestion);
router.get('/getAllQuestion',authMiddleware, TestController.getAllQuestion);
router.get('/getAllStudents',authMiddleware, TestController.getAllStudents);
router.post('/custom/updateTitle',authMiddleware, TestController.updateTitleCustomTest);
router.post('/changeInfoTest',authMiddleware, TestController.changeInfoTest);

module.exports = router;
