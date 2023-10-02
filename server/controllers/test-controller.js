const TestService = require('../service/test-service')
const ApiError = require("../exceptions/api-error");

class TestController{
    async create(req, res, next){
        try {
            const {title, quantityQuestion} = req.body;
            const testData = await TestService.create(title, quantityQuestion);
            return res.json(testData)
        } catch (e){
            next(e);
        }
    }

    async getAll(req, res, next){
        try{
            const eventsData = await TestService.getAll();
            return res.json(eventsData)
        } catch (e){
            next(e)
        }
    }

    async getUsersAll(req, res, next){
        try{
            const eventsData = await TestService.getUsersAll();
            return res.json(eventsData)
        } catch (e){
            next(e)
        }
    }

    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getUserOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getUserOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getOneInfo(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.getOneInfo(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async changeStatusOne(req, res, next){
        try{
            const {id, status} = req.body;
            const response = await TestService.changeStatusOne(id, status);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async changeKeyOne(req, res, next){
        try{
            const {id, key} = req.body;
            const response = await TestService.changeKeyOne(id, key);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async deleteOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await TestService.deleteOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TestController();
