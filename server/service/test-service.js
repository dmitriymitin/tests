const TestModel = require('../models/test-model')
const TestUserModel = require('../models/test-user-model')
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

    async getAll(){
        const tests  = await TestModel.find()
        return {...tests}
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
        await TestModel.deleteOne({_id: new ObjectId(id)})
    }
}
module.exports = new TestService();
