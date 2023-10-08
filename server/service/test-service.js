const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
const TestCustomModel = require('../models/test-custom-model')
const TestCustomQuestionModel = require('../models/test-custom-question-model')

const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");

class TestService {
    async getOne(id){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        return test
    }

    async getUserOne(id){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        if (test) {
            return {
                _id: test._id,
                firstQuestionTitle: test.firstQuestionTitle,
                quantityQuestion: test.quantityQuestion,
                status: test.status,
                title: test.title
            }
        }
        const customTestModel = await TestCustomModel.findOne({_id: new ObjectId(id)})
        return {
            _id: customTestModel._id,
            quantityQuestion: customTestModel.questions.length,
            firstQuestionTitle: customTestModel.firstQuestionTitle,
            status: customTestModel.status,
            questions: customTestModel.questions,
            title: customTestModel.title
        }
    }

    async getOneInfo(id){
        const testModel  = await TestModel.findOne({_id: new ObjectId(id)})
        const testUserModel  = await TestUserModel.find({testId: new ObjectId(id)})
        if (testModel) return {
            test: testModel,
            usersInfo: testUserModel,
            testKey: testModel.testKey
        }
        const customTestModel = await TestCustomModel.findOne({_id: new ObjectId(id)})
        return {
            test: customTestModel,
            usersInfo: testUserModel,
            testKey: customTestModel.testKey
        }
    }

    async getOneQuestionCustomInfo(id){
        const question  = await TestCustomQuestionModel.findOne({_id: new ObjectId(id)})
        return {
            ...question
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
        if (test) {
            test.status = status
            await test.save();
            return {
                ...test
            }
        }
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.status = status
        await testCustomModel.save();
        return {
            ...testCustomModel
        }
    }

    async changeKeyOne(id, key){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        if (test) {
            test.testKey = key
            await test.save();
            return {
                ...test
            }
        }
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.testKey = key
        await testCustomModel.save();
        return {
            ...testCustomModel
        }
    }

    async updateFirstQuestion(title){
        const tests = await TestModel.updateMany({firstQuestionTitle: title})
        const testsCustom = await TestCustomModel.updateMany({firstQuestionTitle: title})
        return
    }

    async create(title, quantityQuestion){
        return await TestModel.create({firstQuestionTitle: 'Фамилия, номер группы', title, quantityQuestion})
    }

    async createCustom(){
        return await TestCustomModel.create({firstQuestionTitle: 'Фамилия, номер группы', title: 'Название теста', questions: []})
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

    async getUsersTestsAll(){
        const tests  = await TestModel.find()
        const customTests = await TestCustomModel.find()
        const newTests = Object.entries(tests).reduce((acc, el) => {
            if (el[1]['status'] === 'Open') {
                acc.push({
                    _id: el[1]._id,
                    title: el[1].title,
                    quantityQuestion: el[1].quantityQuestion,
                })
            }
            return acc
        }, [])

        const newCustomTests = Object.entries(customTests).reduce((acc, el) => {
            if (el[1]['status'] === 'Open') {
                acc.push({
                    _id: el[1]._id,
                    title: el[1].title,
                    quantityQuestion: el[1].questions.length,
                })
            }
            return acc
        }, [])

        return [...newTests, ...newCustomTests]
    }

    async deleteOne(id){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        if (testCustomModel) {
            await TestCustomModel.deleteOne({_id: new ObjectId(id)})
            return
        }

        await TestModel.deleteOne({_id: new ObjectId(id)})
    }

    async clearResults(id){
        const usersTest = await TestUserModel.deleteMany({testId: new ObjectId(id)})
        return {
            ...usersTest
        }
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

    async updateTitleCustomTest(id, title){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.title = title;
        testCustomModel.save()
        return {
            ...testCustomModel
        }
    }

    async updateQuestionCustomTest(id, testId, description, answers){
        try {
            const question = await TestCustomQuestionModel.findOne({_id: new ObjectId(id)})
            question.description = description
            question.answers = answers
            await question.save()

            const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(testId)})
            const newQuestions = testCustomModel.questions.reduce((acc, el, index) => {
                if (el._id.equals(new ObjectId(id))) {
                    acc.push({ ...el, answers, description})
                } else acc.push(el)
                return acc
            }, [])

            testCustomModel.questions = newQuestions;
            testCustomModel.save()
            return {
                ...testCustomModel
            }
        } catch (e) {
            throw ApiError.BadRequest(`Что-то пошло не так...`)
        }
    }
}
module.exports = new TestService();
