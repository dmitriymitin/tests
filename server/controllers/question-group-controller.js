const QuestionGroupService = require("../service/question-group-service");

class QuestionGroupController{
    async create(req, res, next){
        try {
            const data = req.body;
            const questionGroupData = await QuestionGroupService.create({...data});
            return res.json(questionGroupData)
        } catch (e){
            next(e);
        }
    }

    async getAllGroupQuestion(req, res, next){
        try {
            const questions = await QuestionGroupService.getAll();
            return res.json(questions)
        } catch (e){
            next(e);
        }
    }
}

module.exports = new QuestionGroupController();
