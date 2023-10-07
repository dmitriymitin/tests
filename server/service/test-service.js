const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
const TestCustomModel = require('../models/test-custom-model')
const TestCustomQuestionModel = require('../models/test-custom-question-model')

const {ObjectId} = require("mongodb");

class TestService {
    async getOne(id){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        return test
    }

    async getUserOne(id){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        return {
            _id: test._id,
            quantityQuestion: test.quantityQuestion,
            status: test.status,
            title: test.title
        }
    }

    async getOneInfo(id){
        const testModel  = await TestModel.findOne({_id: new ObjectId(id)})
        const testUserModel  = await TestUserModel.find({testId: new ObjectId(id)})
        return {
            test: testModel,
            usersInfo: testUserModel,
            testKey: testModel.testKey
        }
    }

    async addQuestionCustomTest(id, description, answers){
        const question = await TestCustomQuestionModel.create({answers, description,})
        const test  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        test.questions.push(question)
        await test.save();
        return {
            ...test
        }
    }

    async getOneCustomInfo(id){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        const testUserModel  = await TestUserModel.find({testId: new ObjectId(id)})

        return {
            test: testCustomModel,
            usersInfo: testUserModel,
            testKey: testCustomModel.testKey
        }
    }

    async changeStatusOne(id, status){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        test.status = status
        await test.save();
        return {
            ...test
        }
    }

    async changeKeyOne(id, key){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        test.testKey = key
        await test.save();
        return {
            ...test
        }
    }

    async create(title, quantityQuestion){
        return await TestModel.create({title, quantityQuestion})
    }

    async createCustom(){
        return await TestCustomModel.create({title: 'Название теста', questions: []})
    }

    async getAll(){
        const testsAll  = await TestModel.find()
        const testsCustom = await TestCustomModel.find()
        return [
                ...testsAll,
                ...testsCustom
        ]
    }

    async getAllQuestion(){
        const questionsAll  = await TestCustomQuestionModel.find()
        return [
            ...questionsAll
        ]
    }

    async getUsersAll(){
        const tests  = await TestModel.find()
        const newTests = Object.entries(tests).reduce((acc, el) => {
            if (el[1]['status'] === 'Open') {
                const newEl = {
                    _id: el[1]._id,
                    title: el[1].title,
                    quantityQuestion: el[1].quantityQuestion,
                }
                acc = {...acc, newEl}
            }

            return acc
        }, {})

        return {...newTests}
    }

    async deleteOne(id){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        if (testCustomModel) {
            await TestCustomModel.deleteOne({_id: new ObjectId(id)})
            return
        }

        await TestModel.deleteOne({_id: new ObjectId(id)})
    }

    async deleteOneCustomQuestion(id, testId){
        await TestCustomQuestionModel.deleteOne({_id: new ObjectId(id)})
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(testId)})
        const filterQuestions = testCustomModel.questions.filter(el => !el._id.equals(new ObjectId(id)))
        testCustomModel.questions = filterQuestions;
        testCustomModel.save()
        return {
            ...testCustomModel
        }
    }
}
module.exports = new TestService();
