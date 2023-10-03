const TestUserModel = require('../models/test-user-model')
const TestModel = require("../models/test-model");
const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");

class TestService {
    async create(FIOGroup, answer, testId){
        const test  = await TestModel.findOne({_id: new ObjectId(testId)})
        if (test.status === 'Close' || test.status === 'Start') {
            throw ApiError.BadRequest(`Тест закрыт`)
        }
        return await TestUserModel.create({FIOGroup, answer, testId})
    }
}
module.exports = new TestService();
