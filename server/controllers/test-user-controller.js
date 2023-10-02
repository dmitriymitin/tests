const TestUserService = require('../service/test-user-service')
const ApiError = require("../exceptions/api-error");

class TestUserController{
    async saveAnswer(req, res, next){
        try {
            const {FIOGroup, answer, testId} = req.body;
            const testData = await TestUserService.create(FIOGroup, answer, testId);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }
}

module.exports = new TestUserController();
