const TestUserModel = require('../models/test-user-model')
const TestModel = require("../models/test-model");
const CustomTestModel = require('../models/test-custom-model')
const VariantModel = require('../models/variant-model')
const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");

class TestService {
    async create({FIOGroup, testType, answersCustom, answer, testId}){
        if (testType !== 'questions') {
            const test  = await TestModel.findOne({_id: new ObjectId(testId)})
            if (test) {
                if (test.status === 'Close' || test.status === 'Start') {
                    throw ApiError.BadRequest(`Тест закрыт`)
                    return
                }
            }
        } else {
            const customTest = await CustomTestModel.findOne({_id: new ObjectId(testId)})
            if (customTest.status === 'Close' || customTest.status === 'Start') {
                throw ApiError.BadRequest(`Тест закрыт`)
                return
            }
            if (customTest.setting.isRandomQuestions) {

            }
        }
        const valuesToSave = {FIOGroup, testType, answersCustom, answer, testId};
        return await TestUserModel.create({...valuesToSave, createDate: new Date()})
    }
}
module.exports = new TestService();
