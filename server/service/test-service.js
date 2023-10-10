const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
const TestCustomModel = require('../models/test-custom-model')
const TestCustomQuestionModel = require('../models/test-custom-question-model')
const ExelFileModel = require('../models/exel-file-model')

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
                descriptionEditor: test.descriptionEditor,
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

    async downloadTest(id) {
        const testModel = await TestModel.findOne({_id: new ObjectId(id)})
        const testUserModel = await TestUserModel.find({testId: new ObjectId(id)})
        let noCorrectAnswer = {}
        const workbook = new excel.Workbook();
        let countQuestion = 0;
        let title = ''
        let firstQuestionTitle = ''
        let testKey = ''

        if (testModel) {
            countQuestion = testModel.quantityQuestion
            title = testModel.title
            firstQuestionTitle = testModel.firstQuestionTitle
            testKey = testModel.testKey
        } else {
            const customTestModel = await TestCustomModel.findOne({_id: new ObjectId(id)})
            countQuestion = customTestModel.questions.length
            title = customTestModel.title
            firstQuestionTitle = customTestModel.firstQuestionTitle
            testKey = customTestModel.testKey
        }

        const worksheet = workbook.addWorksheet(title);
        worksheet.cell(1, 1).string(firstQuestionTitle);
        let indexCell = 1;
        const arrayQuestion = new Array(countQuestion).fill('1')

        // Строка с вопросами
        arrayQuestion.forEach((_, index) => {
            indexCell++;
            worksheet.cell(1, indexCell).string(`Вопрос ${index + 1}`);
        })
        worksheet.cell(1, indexCell + 1).string(`Кол-во верных ответов`);

        // Строка ответов студента
        let indexUserCell = 1;
        testUserModel.forEach((el, index) => {
            indexUserCell++;
            worksheet.cell(indexUserCell, 1).string(el.FIOGroup)
            let indexUserAnswerCell = 1;
            let countCorrectAnswer = 0;
            arrayQuestion.forEach((_, index) => {
                indexUserAnswerCell++;
                const answer = el.answer ? el.answer[index + 1] || '' : ''
                if (testKey[index] && answer === testKey[index]) {
                    countCorrectAnswer++;
                } else {
                    noCorrectAnswer[index] = (noCorrectAnswer[index] || 0) + 1
                }
                worksheet.cell(indexUserCell, indexUserAnswerCell).string(answer)
            })
            worksheet.cell(indexUserCell, indexUserAnswerCell + 1).number(countCorrectAnswer)
        })

        // Строка с правильными ответами
        let correctAnswerRowIndex = indexUserCell + 1
        worksheet.cell(correctAnswerRowIndex, 1).string('Правильные ответы')
        let indexKey = 1
        arrayQuestion.forEach((_, index) => {
            indexKey++;
            const key = testKey[index] || '';
            worksheet.cell(correctAnswerRowIndex, indexKey).string(key);
        })

        // Строка с неверными ответами
        let noCorrectAnswerRowIndex = indexUserCell + 2
        worksheet.cell(noCorrectAnswerRowIndex, 1).string('Кол-во неверных ответов на вопрос')
        let noCorrectAnswerCell = 1;
        arrayQuestion.forEach((_, index) => {
            noCorrectAnswerCell++;
            const noCorrectAns = noCorrectAnswer[index] || 0
            const result = 100 * noCorrectAns / testUserModel.length
            worksheet.cell(noCorrectAnswerRowIndex, noCorrectAnswerCell).string(`${result.toFixed(0)}%`)
        })

        const buffer = await workbook.writeToBuffer();
        const exelFile = await ExelFileModel.findOne({testId: id})
        const base64String = buffer.toString('base64');
        if (!exelFile) {
            await ExelFileModel.create({file: base64String, testId: id});
        } else {
            exelFile.file = base64String;
            await exelFile.save();
        }

        return {
            ...exelFile
        }
    }

    async generateFilePathTest(id) {
        const exelFile = await ExelFileModel.findOne({testId: id})
        const buffer = Buffer.from(exelFile.file, 'base64');
        return buffer;
    }

    async getOneInfo(id){
        const testModel  = await TestModel.findOne({_id: new ObjectId(id)})
        const testUserModel  = await TestUserModel.find({testId: new ObjectId(id)})

        if (testModel) {
            return {
                test: testModel,
                usersInfo: testUserModel,
                testKey: testModel.testKey
            }
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

    async create(title, quantityQuestion, description, createDate){
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestModel.create({firstQuestionTitle, title, quantityQuestion, descriptionEditor: description, createDate})
    }

    async createCustom(createDate){
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestCustomModel.create({firstQuestionTitle, title: 'Тест с отдельным описанием вопросов', questions: [], createDate})
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
                    createDate: el[1].createDate,
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
                    createDate: el[1].createDate,
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

    async changeInfoTest(id, title, quantityQuestion){
        const testModel  = await TestModel.findOne({_id: new ObjectId(id)})
        if (title) {
            testModel.title = title;
        }
        if (quantityQuestion) {
            testModel.quantityQuestion = quantityQuestion;
        }
        testModel.save()
        return {
            ...testModel
        }
    }

    async updateDescription(testId, description){
        try {
            const testModel  = await TestModel.findOne({_id: new ObjectId(testId)})
            if (!testModel) {
                throw ApiError.BadRequest(`Что-то пошло не так...`)
            }

            testModel.descriptionEditor = description;
            await testModel.save()
            return {
                ...testModel
            }
        } catch (e) {
            throw ApiError.BadRequest(`Что-то пошло не так...`)
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
