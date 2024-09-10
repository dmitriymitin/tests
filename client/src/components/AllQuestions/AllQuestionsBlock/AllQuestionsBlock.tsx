import React, {Fragment} from 'react';
import {useAllQuestion} from '../../../http/hooks/useAllQuestion';
import IsVisible from '../../ui/isVisibleWrapper';
import AllQuestionsSpins from '../AllQuestionsSpins';
import clsx from 'clsx';
import s from '../../../pages/Test/Test.module.scss';
import parse from 'html-react-parser';
import edjsHTML from 'editorjs-html';
import {useAllGroupsStore} from '../../../store/groups/useAllGroups';
import {Link} from 'react-router-dom';
import {CLIENT_URL} from '../../../http';
import {RouteNames} from '../../../router';
import {convertIdToCustomFormat} from "../../../utils/helpers";
import AllQuestionBlockBtn from "./AllQuestionBlockBtn";
import {useTypedSelector} from "../../../hooks/useTypedSelector";

const edjsParser = edjsHTML();



const AllQuestionsBlock = () => {
  const currentActiveGroups = useAllGroupsStore(store => store.currentActiveGroups);
  const {data: allQuestion, isLoading: isAllQuestionLoading, isFetching: isAllQuestionFetching} = useAllQuestion();
  const isLoadingQuestions = !allQuestion || isAllQuestionLoading || isAllQuestionFetching;
  return (
    <Fragment>
      <IsVisible isVisible={isLoadingQuestions}>
        <AllQuestionsSpins/>
      </IsVisible>
      <IsVisible isVisible={!isLoadingQuestions && !!allQuestion?.length}>
        <div className="flex-wrap flex-col gap-20">
          {allQuestion
            ?.filter(el => el?.descriptionEditor)
            ?.map((question, index) => (
              <div key={question._id} className={clsx('text-container px-20 py-15', s.descriptionBg)}>
                <div className="flex-row gap-10 mb-10">
                  <span className="bold fs-16">{index + 1}. Вопрос</span>
                  <Link className="fs-16" to={`${CLIENT_URL}` + RouteNames.ADMIN_QUESTION_INFO + `/${question._id}`}>
                    {convertIdToCustomFormat(question._id)}
                  </Link>
                </div>
                {parse(edjsParser.parse(question?.descriptionEditor).join(''))}
                <AllQuestionBlockBtn questionId={question._id}/>
              </div>
            ))}
        </div>
      </IsVisible>
    </Fragment>
  );
};

export default AllQuestionsBlock;
