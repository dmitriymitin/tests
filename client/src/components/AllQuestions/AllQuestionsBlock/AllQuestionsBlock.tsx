import React, {Fragment} from 'react';
import {useAllQuestion} from '../../../http/hooks/useAllQuestion';
import IsVisible from '../../ui/isVisibleWrapper';
import AllQuestionsSpins from '../AllQuestionsSpins';
import clsx from 'clsx';
import s from '../../../pages/Test/Test.module.scss';
import sC from './AllQuestionsBlock.module.scss';
import parse from 'html-react-parser';
import edjsHTML from 'editorjs-html';
import {Link} from 'react-router-dom';
import {CLIENT_URL} from '../../../http';
import {RouteNames} from '../../../router';
import AllQuestionBlockBtn from './AllQuestionBlockBtn';
import {useAllGroupQuestion} from '../../../http/hooks/useAllGroupQuestion';
import {Badge, Empty} from 'antd';
import QuestionLink from "./QuestionLink";

const edjsParser = edjsHTML();

const AllQuestionsBlock = () => {
  const {isLoading: isAllQuestionGroupLoading, isFetching: isAllQuestionGroupFetching} = useAllGroupQuestion();
  const {data: allGroupQuestion} = useAllGroupQuestion();
  const {data: allQuestion, isLoading: isAllQuestionLoading, isFetching: isAllQuestionFetching} = useAllQuestion();
  const isLoadingQuestions = !allQuestion || isAllQuestionLoading || isAllQuestionFetching;
  const isLoadingGroup = isAllQuestionGroupLoading || isAllQuestionGroupFetching;
  const allGroupQuestionObject = allGroupQuestion?.reduce((acc, el) =>
    (acc[el._id] = el.name, acc)
  , {} as {[key: string]: string});

  return (
    <Fragment>
      <AllQuestionsSpins isLoading={isLoadingQuestions || isLoadingGroup}/>
      <IsVisible isVisible={!isLoadingQuestions && !isLoadingGroup && !allQuestion?.length}>
        <div className="status-block h220p">
          <Empty description={'Вопросов пока нет '}/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isLoadingQuestions && !isLoadingGroup && !!allQuestion?.length}>
        <div className="flex-wrap flex-col gap-20">
          {allQuestion
            ?.filter(el => el?.descriptionEditor)
            ?.map((question, index) => {
              const text = (question?.groupsId || [])?.map(id => allGroupQuestionObject?.[id]);
              const filterText = text?.filter(el => Boolean(el));
              return (
                <Badge.Ribbon
                  key={question._id}
                  text={filterText[0]}
                  color="#363e45"
                  style={{
                    display: filterText?.length ? 'block' : 'none',
                  }}>
                  <div key={question._id} className={clsx('text-container px-20 py-15', s.descriptionBg)}>
                    <div className="flex-row gap-10 mb-10">
                      <span className="bold fs-16">{index + 1}. Вопрос</span>
                      <QuestionLink id={question._id} convertId={question.convertId} isPublic={question.setting.isPublicQuestion}/>
                    </div>
                    <div className={sC.descriptionEditorBg}>{parse(edjsParser.parse(question?.descriptionEditor).join(''))}</div>
                    <AllQuestionBlockBtn questionId={question._id}/>
                  </div>
                </Badge.Ribbon>
              );
            })}
        </div>
      </IsVisible>
    </Fragment>
  );
};

export default AllQuestionsBlock;
