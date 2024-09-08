const Router = require('express');

const router = new Router();

const userRouter = require('./userRouter');
const testRouter = require('./testRouter');
const csvRoutes = require("./csvRoutes");
const questionRoutes = require("./questionRouter");
const questionGroupRoutes = require("./questionGroupRouter");

router.use('/', userRouter);
router.use('/test', testRouter);
router.use('/uploadImage', csvRoutes);
router.use('/question', questionRoutes);
router.use('/questionGroup', questionGroupRoutes);

module.exports = router;
