import React, {Fragment} from 'react';
import clsx from 'clsx';
import s from './VariantRender.module.scss';
import QuestionLink from '../../../components/AllQuestions/AllQuestionsBlock/QuestionLink';
import InfoQuestionForm from '../../../components/InfoQuestionForm/InfoQuestionForm';
import {useQuery} from 'react-query';
import {getQuestion} from '../../../api/question';
import IsVisible from '../../../components/ui/isVisibleWrapper';
import {Spin} from 'antd';

interface IDeleteQuestionRender {
  id?: string;
  isShowAnswer?: boolean;
}

const DeleteQuestionRender = ({id, isShowAnswer}: IDeleteQuestionRender) => {
  const queryKey = `question${id}`;

  const {data: questionData, isLoading: isLoadingQuestionData} = useQuery({
    queryKey,
    queryFn: () => getQuestion(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    retry: false
  });

  return (
    <Fragment>
      <IsVisible isVisible={isLoadingQuestionData}>
        <div className={clsx('status-block h200p text-container', s.descriptionDeleteBg)}>
          <Spin/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isLoadingQuestionData && !!questionData}>
        <InfoQuestionForm
          isDeleteQuestion
          isAnswerForVariant={isShowAnswer}
          disabled={true}
          questionData={questionData}
          key={questionData?._id}
          isQuestionTitle
          isAnswer
        />
      </IsVisible>
    </Fragment>
  );
};

export default DeleteQuestionRender;
