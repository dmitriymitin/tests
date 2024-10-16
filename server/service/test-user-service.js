const TestUserModel = require('../models/test-user-model')
const TestModel = require("../models/test-model");
const CustomTestModel = require('../models/test-custom-model')
const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");
const {convertIdToCustomFormat} = require("../helpers/util");

class TestService {
    async create({FIOGroup, testType, answersCustom, answer, testId}){
        let currentTest = null;
        if (testType !== 'questions') {
            currentTest  = await TestModel.findOne({_id: new ObjectId(testId)})
            if (currentTest) {
                if (currentTest.status === 'Close' || currentTest.status === 'Start') {
                    throw ApiError.BadRequest(`Тест закрыт`)
                    return
                }
            }
        } else {
            currentTest = await CustomTestModel.findOne({_id: new ObjectId(testId)})
            if (currentTest.status === 'Close' || currentTest.status === 'Start') {
                throw ApiError.BadRequest(`Тест закрыт`)
                return
            }
        }
        const valuesToSave = {FIOGroup, testType, answersCustom, answer, testId};
        const testUser = await TestUserModel.create({...valuesToSave, createDate: new Date()})
        const testUserFind = await TestUserModel.findById(testUser._id);
        testUserFind.convertId = convertIdToCustomFormat(testUserFind.id, +2, '');
        await testUserFind.save();
        return testUserFind;
    }
}
module.exports = new TestService();
