import React, {Fragment} from 'react';
import InfoQuestionForm from '../../../components/InfoQuestionForm/InfoQuestionForm';
import {ITestModelResponse} from '../../../api/test/type';

interface IRenderCustomTestWithQuestionsProps {
  testData?: ITestModelResponse;
}

const RenderCustomTestWithQuestions = ({testData}: IRenderCustomTestWithQuestionsProps) => {
  return (
    <Fragment>
      {
        testData?.questions?.map((el, index) =>
          <InfoQuestionForm questionData={el} key={el._id} isQuestionTitle isAnswer/>
        )
      }
    </Fragment>
  );
};

export default RenderCustomTestWithQuestions;
