const Router = require('express');

const router = new Router();

const userRouter = require('./userRouter');
const testRouter = require('./testRouter');
const csvRoutes = require("./csvRoutes");

router.use('/', userRouter);
router.use('/test', testRouter);
router.use('/uploadImage', csvRoutes);

module.exports = router;
