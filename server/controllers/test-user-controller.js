const TestUserService = require('../service/test-user-service')
const ApiError = require("../exceptions/api-error");

class TestUserController{
    async saveAnswer(req, res, next){
        try {
            const values = req.body;
            const testData = await TestUserService.create(values);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }
}

module.exports = new TestUserController();
