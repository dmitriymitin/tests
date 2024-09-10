const QuestionService = require("../service/question-service");

class QuestionController{
    async create(req, res, next){
        try {
            const data = req.body;
            const questionData = await QuestionService.create({...data});
            return res.json(questionData)
        } catch (e){
            next(e);
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            const response = await QuestionService.deleteOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getAllQuestion(req, res, next){
        try {
            const questions = await QuestionService.getAll();
            return res.json(questions)
        } catch (e){
            next(e);
        }
    }
}

module.exports = new QuestionController();
