const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
const TestCustomModel = require('../models/test-custom-model')
const TestCustomQuestionModel = require('../models/test-custom-question-model')
const ExelFileModel = require('../models/exel-file-model')
const FolderModel = require('../models/folder-model')

const path = require('path');
const excel = require('excel4node');
const natural = require('natural');
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
                if (testKey[index] && answer.toUpperCase() === testKey[index].toUpperCase()) {
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
            test.updateDate = new Date();
            await test.save();
            return {
                ...test
            }
        }
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.status = status
        testCustomModel.updateDate = new Date();
        await testCustomModel.save();
        return {
            ...testCustomModel
        }
    }

    async changeKeyOne(id, key){
        const test  = await TestModel.findOne({_id: new ObjectId(id)})
        if (test) {
            test.testKey = key
            test.updateDate = new Date();
            await test.save();
            return {
                ...test
            }
        }
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.testKey = key
        testCustomModel.updateDate = new Date();
        await testCustomModel.save();
        return {
            ...testCustomModel
        }
    }

    async updateFirstQuestion(title){
        const tests = await TestModel.updateMany({firstQuestionTitle: title})
        const testsCustom = await TestCustomModel.updateMany({firstQuestionTitle: title})
        return testsCustom
    }

    async create(title, quantityQuestion, description, createDate){
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestModel.create({firstQuestionTitle, title, quantityQuestion, descriptionEditor: description, createDate})
    }

    async createFolder(name){
        const folderModel = await FolderModel.create({name});
        return folderModel;
    }

    async updateFolder(id, name) {
        const folder  = await FolderModel.findById(id);
        folder.name = name;
        await folder.save();
    }

    async getAllFolder() {
        const allFolder =  await FolderModel.find()
        return allFolder;
    }


    async putOneTestInFolder(testId, id) {
        const testOne  = await TestModel.findById(testId)
        if (testOne) {
            testOne.folderId = id;
            testOne.updateDate = new Date();
            testOne.save();
            return
        }
        const testsCustomOne  = await TestCustomModel.findById(testId)
        if (testsCustomOne) {
            testsCustomOne.folderId = id;
            testOne.updateDate = new Date();
            testsCustomOne.save();
        }
    }

    async actionOnManyTest(testsId, action, folderId) {
        for await (let testId of testsId) {
            if (action === 'clearResults') {
                await this.clearResults(testId)
                continue
            }

            if (action === 'delete') {
                await this.deleteOne(testId);
                continue
            }

            let testOne = await TestModel.findById(testId)
            if (!testOne) testOne = await TestCustomModel.findById(testId);
            if (!testOne) continue

            switch (action) {
                case 'open':
                    testOne.status = 'Open'
                    break
                case 'close':
                    testOne.status = 'Close'
                    break
                case 'addInFolder':
                    testOne.folderId = folderId;
                    break
            }

            testOne.updateDate = new Date();
            await testOne.save();
        }
    }

    async updateStatusInAllTest (status) {
        const testsAll  = await TestModel.find()
        if (testsAll) {
            testsAll.forEach((el, index) => {
                testsAll[index].status = status;
                testsAll.updateDate = new Date();
                el.save()
            })
        }
        const testsCustomAll  = await TestCustomModel.find()
        if (testsCustomAll) {
            testsCustomAll.forEach((el, index) => {
                testsCustomAll[index].status = status;
                testsCustomAll.updateDate = new Date();
                el.save()
            })
        }
    }

    async clearAllResults() {
        await TestUserModel.deleteMany()
    }

    async createCustom(createDate){
        const firstTest = await TestModel.findOne()
        const firstCustomTest = await TestCustomModel.findOne()
        const firstQuestionTitle = firstTest?.firstQuestionTitle || firstCustomTest?.firstQuestionTitle || 'Фамилия, номер группы'
        return await TestCustomModel.create({firstQuestionTitle, title: 'Тест с отдельным описанием вопросов', questions: [], createDate})
    }

    async getAll({filterByCreateId, filterByFolderId, status}){
        const testsAll  = await (async () => {
            if (filterByFolderId && status) {
                return TestModel.find({folderId: filterByFolderId, status});
            }
            if (filterByFolderId) {
                return TestModel.find({folderId: filterByFolderId});
            }
            if (status) {
                return TestModel.find({status});
            }
            return TestModel.find();
        })()
        const testsCustom  = await (async () => {
            if (filterByFolderId && status) {
                return TestCustomModel.find({folderId: filterByFolderId, status});
            }
            if (filterByFolderId) {
                return TestCustomModel.find({folderId: filterByFolderId});
            }
            if (status) {
                return TestCustomModel.find({status});
            }
            return TestCustomModel.find();
        })()
        const allTestDataArray = [
            ...testsAll,
            ...testsCustom
        ]
        let allTestArray = []

        if (filterByCreateId === '0' || !filterByCreateId) {
            allTestArray = allTestDataArray.sort((a, b) => {
                const dateA = new Date(a.createDate);
                const dateB = new Date(b.createDate);
                if (dateA < dateB)
                    return 1
                if (dateA > dateB)
                    return -1
                return 0
            });
        }

        if (filterByCreateId === '1') {
            allTestArray = allTestDataArray.sort((a, b) => {
                const dateA = new Date(a.createDate);
                const dateB = new Date(b.createDate);
                if (dateA > dateB)
                    return 1
                if (dateA < dateB)
                    return -1
                return 0
            });
        }


        if (filterByCreateId === '2') {
            allTestArray = allTestDataArray.sort((a, b) => {
                if (!a?.updateDate && b?.updateDate) {
                    return 1
                }
                if (a?.updateDate && !b?.updateDate) {
                    return -1
                }
                const dateA = new Date(a.updateDate);
                const dateB = new Date(b.updateDate);
                if (dateA < dateB)
                    return 1
                if (dateA > dateB)
                    return -1
                return 0
            });
        }

        if (filterByCreateId === '3') {
            allTestArray = allTestDataArray.sort((a, b) => {
                if (!a?.updateDate && b?.updateDate) {
                    return 1
                }
                if (a?.updateDate && !b?.updateDate) {
                    return -1
                }
                const dateA = new Date(a.updateDate);
                const dateB = new Date(b.updateDate);
                if (dateA > dateB)
                    return 1
                if (dateA < dateB)
                    return -1
                return 0
            });
        }

        return [...allTestArray]
    }

    async getAllQuestion(){
        const questionsAll  = await TestCustomQuestionModel.find()
        return [
            ...questionsAll
        ]
    }


    async getAllStudents(search, pageN, lim, sortId) {
        const testsAll  = await TestModel.find()
        const testsCustom = await TestCustomModel.find()
        const allTestDataArray = [
            ...testsAll,
            ...testsCustom
        ]

        const page = parseInt(pageN) || 0;
        const limit = parseInt(lim) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const testUserModel = await TestUserModel.find()
        const data = testUserModel.filter(it => natural.PorterStemmerRu.stem(JSON.stringify(it.FIOGroup)).includes(natural.PorterStemmerRu.stem(search)))
        const newData = data.map(el => ({
            test: allTestDataArray.find(test => test._id.toString() === el.testId),
            userInfo: el
        }))

        const resultsData = newData?.slice(startIndex, endIndex);

        // sortId
        // 0 - по алфавиту
        // 1 - по дате создания (сначала новые)
        // 2 - по дате создания (сначала старые)
        let resultsSort = (() => {
            switch (sortId) {
                case '0':
                    return resultsData.sort((a, b) =>
                        a.userInfo.FIOGroup.toLowerCase().localeCompare(b.userInfo.FIOGroup.toLowerCase()));
                case '1':
                    // Сортировка по дате создания (сначала новые)
                    return resultsData.sort((a, b) => {
                        if (!a.userInfo.createDate && !b.userInfo.createDate) return 0; // Оба undefined
                        if (!a.userInfo.createDate) return 1; // A без даты, B с датой
                        if (!b.userInfo.createDate) return -1; // B без даты, A с датой
                        return new Date(b.userInfo.createDate) - new Date(a.userInfo.createDate); // Оба с датами
                    });
                case '2':
                    // Сортировка по дате создания (сначала старые)
                    return resultsData.sort((a, b) => {
                        if (!a.userInfo.createDate && !b.userInfo.createDate) return 0; // Оба undefined
                        if (!a.userInfo.createDate) return 1; // A без даты, B с датой
                        if (!b.userInfo.createDate) return -1; // B без даты, A с датой
                        return new Date(a.userInfo.createDate) - new Date(b.userInfo.createDate); // Оба с датами
                    });
                default:
                    return resultsData;
            }
        })();


        return {
            data: resultsSort,
            totalCount: data.length
        };
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

        const allTestDataArray = [...newTests, ...newCustomTests]

        const allTestArray = allTestDataArray.sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
            if (dateA < dateB)
                return 1
            if (dateA > dateB)
                return -1
            return 0
        });

        return [...allTestArray]
    }

    async deleteOne(id){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        if (testCustomModel) {
            await TestCustomModel.deleteOne({_id: new ObjectId(id)})
        } else {
            await TestModel.deleteOne({_id: new ObjectId(id)})
        }
        await TestUserModel.deleteMany({testId: id});
    }

    async deleteOneFolder(id){
        const folderId = new ObjectId(id)
        const testsAll  = await TestModel.find({folderId})
        if (testsAll) {
            testsAll.forEach((el, index) => {
                testsAll[index].folderId = undefined;
                testsAll.updateDate = new Date();
                el.save()
            })
        }

        const testsCustomAll  = await TestCustomModel.find()
        if (testsCustomAll) {
            testsCustomAll.forEach((el, index) => {
                testsCustomAll[index].folderId = undefined;
                testsCustomAll.updateDate = new Date();
                el.save()
            })
        }

        await FolderModel.deleteOne({_id: new ObjectId(id)})
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
        await testCustomModel.save()
        return {
            ...testCustomModel
        }
    }

    async updateTitleCustomTest(id, title){
        const testCustomModel  = await TestCustomModel.findOne({_id: new ObjectId(id)})
        testCustomModel.title = title;
        testCustomModel.updateDate = new Date();
        await testCustomModel.save()
        return {
            ...testCustomModel
        }
    }

    async changeInfoTest(id, title, quantityQuestion, description){
        const testModel  = await TestModel.findOne({_id: new ObjectId(id)})
        if (title) {
            testModel.title = title;

        }
        if (quantityQuestion) {
            testModel.quantityQuestion = quantityQuestion;
        }
        if (description) {
            testModel.descriptionEditor = description;
        }
        testModel.updateDate = new Date();
        await testModel.save()
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
            testModel.updateDate = new Date();
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
            testCustomModel.updateDate = new Date();
            const newQuestions = testCustomModel.questions.reduce((acc, el, index) => {
                if (el._id.equals(new ObjectId(id))) {
                    acc.push({ ...el, answers, description})
                } else acc.push(el)
                return acc
            }, [])

            testCustomModel.questions = newQuestions;
            await testCustomModel.save()
            return {
                ...testCustomModel
            }
        } catch (e) {
            throw ApiError.BadRequest(`Что-то пошло не так...`)
        }
    }
}
module.exports = new TestService();
