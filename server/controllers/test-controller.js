const TestService = require('../service/test-service')
const ApiError = require("../exceptions/api-error");

class TestController{
    async create(req, res, next){
        try {
            const {title, quantityQuestion} = req.body;
            const testData = await TestService.create(title, quantityQuestion);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async createCustom(req, res, next){
        try {
            const testData = await TestService.createCustom();
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async getAll(req, res, next){
        try{
            const testsData = await TestService.getAll();
            return res.json(testsData)
        } catch (e){
            next(e)
        }
    }

    async downloadTest(req, res, next){
        try{
            const {id} = req.params;
            const filePath = await TestService.generateFilePathTest();
            res.download(filePath, (err) => {
                if (err) {
                    res.status(500).send('Ошибка при загрузке файла');
                }
            });
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
            await TestService.downloadTest(id);
            const response = await TestService.getOneInfo(id);
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
            const {description, answers} = req.body
            const response = await TestService.addQuestionCustomTest(id, description, answers);
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
            const {id, testId} = req.query;
            const response = await TestService.deleteOneCustomQuestion(id, testId);
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
}

module.exports = new TestController();
