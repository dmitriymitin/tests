const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/login', userController.login);
router.post('/registration', userController.registration);

router.post('/update_user_password', authMiddleware, userController.updateUserPassword);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);


module.exports = router;
