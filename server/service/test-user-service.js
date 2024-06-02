const TestUserModel = require('../models/test-user-model')
const TestModel = require("../models/test-model");
const CustomTestModel = require('../models/test-custom-model')
const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");

class TestService {
    async create(FIOGroup, answer, testId){
        const test  = await TestModel.findOne({_id: new ObjectId(testId)})
        if (test) {
            if (test.status === 'Close' || test.status === 'Start') {
                throw ApiError.BadRequest(`Тест закрыт`)
                return
            }
            return await TestUserModel.create({FIOGroup, answer, testId, createDate: new Date()})
        }
        const customTest = await CustomTestModel.findOne({_id: new ObjectId(testId)})
        if (customTest.status === 'Close' || customTest.status === 'Start') {
            throw ApiError.BadRequest(`Тест закрыт`)
            return
        }
        return await TestUserModel.create({FIOGroup, answer, testId, createDate: new Date()})
    }
}
module.exports = new TestService();
