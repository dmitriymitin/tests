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

    async update(req, res, next){
        try {
            const data = req.body;
            const groupData = await QuestionGroupService.update({...data});
            return res.json(groupData)
        } catch (e){
            next(e);
        }
    }

    async deleteOne(req, res, next){
        try{
            const {id} = req.params;
            const response = await QuestionGroupService.deleteOne(id);
            return res.json(response);
        } catch (e) {
            next(e)
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
