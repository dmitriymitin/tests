const ApiError = require("../exceptions/api-error");
const TestService = require('../service/test-service')
const {checkAuth} = require("../helpers/util");

class TestController{
    async create(req, res, next){
        try {
            const {title, quantityQuestion, description, createDate, testType, setting} = req.body;
            const testData = await TestService.create(title, quantityQuestion, description, createDate, testType, setting);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async createFolder(req, res, next){
        try {
            const {name, testIds} = req.body;
            const testData = await TestService.createFolder(name);
            if (testIds.length > 0) {
                const newTestData = await TestService.putManyTestInFolder(testData._id, testIds);
            }
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async actionOnManyTest(req, res, next){
        try {
            const {testIds, action, folderId} = req.body;
            if (testIds.length > 0) {
                await TestService.actionOnManyTest(testIds, action, folderId);
            }
            return res.json([])
        } catch (e){
            next(e);
        }
    }


    async updateFolder(req, res, next){
        try {
            const {id, name, testIds} = req.body;
            const testData = await TestService.updateFolder(id, name);
            if (testIds) {
                await TestService.putManyTestInFolder(id, testIds);
            }
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async putOneTestInFolder(req, res, next) {
        try {
            const {id, folderId} = req.body;
            const testData = await TestService.putOneTestInFolder(id, folderId);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async getFolder(req, res, next){
        try {
            const testData = await TestService.getAllFolder();
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async openAll(req, res, next){
        try {
            const testData = await TestService.updateStatusInAllTest('Open');
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async closeAll(req, res, next){
        try {
            const testData = await TestService.updateStatusInAllTest('Close');
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async clearAllResults(req, res, next){
        try {
            const testData = await TestService.clearAllResults();
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async createCustom(req, res, next){
        try {
            const {createDate, testType} = req.body;
            const testData = await TestService.createCustom(createDate, testType);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async getAll(req, res, next){
        try{
            const {filterByCreateId, folderId, status} = req.query;
            const testsData = await TestService.getAll({filterByCreateId: filterByCreateId, filterByFolderId: folderId, status});
            return res.json(testsData)
        } catch (e){
            next(e)
        }
    }

    async downloadTest(req, res, next){
        try{
            const {id} = req.params;
            await TestService.downloadTest(id);
            const bufferFile = await TestService.generateFilePathTest(id);
            res.setHeader('Content-Disposition', 'attachment; filename=TestTable.xlsx');
            res.send(bufferFile)
        } catch (e){
            next(e)
        }
    }

    async getAllQuestion(req, res, next){
        try{
            const questionsData = await TestService.getAllQuestion();
            return res.json(questionsData)
        } catch (e){
            next(e)
        }
    }

    async getAllStudents(req, res, next){
        try{
            const {search, pageNumber, limit, sortId} = req.query;
            const filterStudents = await TestService.getAllStudents(search, pageNumber, limit, sortId);
            return res.json(filterStudents)
        } catch (e){
            next(e)
        }
    }

    async getUsersTestsAll(req, res, next){
        try{
            const eventsData = await TestService.getUsersTestsAll();
            return res.json(eventsData)
        } catch (e){
            next(e)
        }
    }

    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getUserOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getUserOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getOneInfo(req, res, next){
        try {
            const {id} = req.params;
            const isAuth = checkAuth(req);
            const response = await TestService.getOneInfo(id, isAuth);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async testResultGerOneInfo(req, res, next) {
        try {
            const {id} = req.params;
            const isAuth = checkAuth(req);
            const response = await TestService.testResultGerOneInfo(id, isAuth);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getOneQuestionCustomInfo(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getOneQuestionCustomInfo(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async addQuestionCustomTest(req, res, next){
        try{
            const {id} = req.params;
            const {questionId} = req.body
            const response = await TestService.addQuestionCustomTest(id, questionId);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async addManyQuestionCustomTest(req, res, next){
        try{
            const {id} = req.params;
            const {questionsId} = req.body
            const response = await TestService.addManyQuestionCustomTest(id, questionsId);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async updateCustomTest(req, res, next){
        try{
            const {id} = req.params;
            const updateValues = req.body
            const response = await TestService.updateCustomTest(id, updateValues);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getOneCustomTestInfo(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getOneCustomInfo(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async changeStatusOne(req, res, next){
        try{
            const {id, status} = req.body;
            const response = await TestService.changeStatusOne(id, status);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async changeKeyOne(req, res, next){
        try{
            const {id, key} = req.body;
            const response = await TestService.changeKeyOne(id, key);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async updateFirstQuestion(req, res, next){
        try{
            const {title} = req.body;
            const response = await TestService.updateFirstQuestion(title);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async deleteOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.deleteOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async deleteOneFolder(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.deleteOneFolder(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async deleteOneTestFromFolder(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.deleteOneTestFromFolder(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }


    async clearResults(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.clearResults(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async deleteOneCustomQuestion(req, res, next){
        try{
            const {id, questionId} = req.query;
            const response = await TestService.deleteOneCustomQuestion(id, questionId);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async updateTitleCustomTest(req, res, next){
        try{
            const {id} = req.query;
            const {title} = req.body;
            const response = await TestService.updateTitleCustomTest(id, title);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async changeInfoTest(req, res, next){
        try{
            const {id} = req.query;
            const {title, quantityQuestion, description, setting} = req.body;
            const response = await TestService.changeInfoTest(id, title, quantityQuestion, description, setting);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async updateQuestionCustomTest(req, res, next){
        try{
            const {id, testId} = req.query;
            const {description, answers} = req.body;
            const response = await TestService.updateQuestionCustomTest(id,testId, description, answers);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async updateDescription(req, res, next){
        try{
            const {id} = req.params;
            const {description} = req.body;
            const response = await TestService.updateDescription(id, description);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TestController();
