const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
const TestCustomModel = require('../models/test-custom-model')
const TestCustomQuestionModel = require('../models/test-custom-question-model')

const path = require('path');
const excel = require('excel4node');
const {ObjectId} = require("mongodb");
const ApiError = require("../exceptions/api-error");
const {Workbook} = require("excel4node");

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

        const workbook = new excel.Workbook();

        const worksheet = workbook.addWorksheet('Sheet 1');

        const style = workbook.createStyle({
            font: {
                color: '#FF0800',
                size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        worksheet.cell(1,1).number(100).style(style);

        worksheet.cell(1,2).number(200).style(style);

        worksheet.cell(1,3).formula('A1 + B1').style(style);

        worksheet.cell(2,1).string('string').style(style);

        worksheet.cell(3,1).bool(true).style(style).style({font: {size: 14}});

        workbook.write('Excel.xlsx');

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
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestModel.create({firstQuestionTitle, title, quantityQuestion})
    }

    async createCustom(){
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestCustomModel.create({firstQuestionTitle, title: 'Название теста', questions: []})
    }

    async getAll(){
        const testsAll  = await TestModel.find()
        const testsCustom = await TestCustomModel.find()
        return [
                ...testsAll,
                ...testsCustom
        ]
    }

    async downloadTest() {
        const filePath = path.join(__dirname, '../Excel.xlsx');
        return filePath;
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
