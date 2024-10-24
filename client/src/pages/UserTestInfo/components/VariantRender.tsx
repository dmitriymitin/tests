import React, {Fragment, useState} from 'react';
import s from './VariantRender.module.scss';
import {useTestUserResult} from '../../../http/hooks/useTestUserResult';
import InfoQuestionForm from '../../../components/InfoQuestionForm/InfoQuestionForm';
import {Form, Segmented} from 'antd';
import {useForm} from 'antd/es/form/Form';
import clsx from 'clsx';
import QuestionLink from '../../../components/AllQuestions/AllQuestionsBlock/QuestionLink';
import DeleteQuestionRender from './DeleteQuestionRender';
import IsVisible from "../../../components/ui/isVisibleWrapper";

interface IVariantRender {
  userAnswerId?: string;
}

const VariantRender = ({userAnswerId}: IVariantRender) => {
  const [isShowAnswer, setIsShowAnswer] = useState<number>();
  const [form] = useForm();
  const {data} = useTestUserResult(userAnswerId);
  const initQuestionsData = Object.entries(data?.userInfo?.answersCustom.values)
    ?.reduce((acc, [idQuest, {keys}]) => {
      acc['answerFieldsData/' + idQuest] = keys;
      return acc;
    }, {});

  return (
    <div className="flex-col gap-20">
      <div className="flex-col gap-10 py-15 px-30 testBackground">
        <div className="flex-row gap-10">
          <div> {data?.testInfo.firstQuestionTitle}:</div>
          <div>{data?.userInfo.FIOGroup}</div>
        </div>
        <div className="flex-row gap-10">
          <div>Кол-во верных ответов:</div>
          <div>{data?.userInfo.countCorrectAnswers}</div>
        </div>
        <IsVisible isVisible={data?.testInfo?.setting?.isPublicTestVariantsAnswers}>
          <div className={s.segmentedWrap}>
            Показать правильные ответы на вопросы ?
            <Segmented
              size={'small'}
              onChange={e => setIsShowAnswer(e)}
              defaultValue={0}
              block
              style={{maxWidth: 200, width: '100%'}}
              options={[
                {label: 'Да', value: 1},
                {label: 'Нет', value: 0}
              ]}
            />
          </div>
        </IsVisible>
      </div>
      <Form
        form={form}
        disabled={true}
        className="flex-col gap-20"
        initialValues={initQuestionsData}
      >
        {
          data?.userInfo?.answersCustom.questionsIdRanges?.map((el) => {
            const currentQuestion = data?.testInfo?.questions?.find(testQuest => testQuest?._id === el);
            if (!currentQuestion) {
              return (
                <DeleteQuestionRender
                  key={el}
                  id={el}
                  isShowAnswer={Boolean(isShowAnswer)}
                />
              );
            }

            return (
              <InfoQuestionForm
                isAnswerForVariant={Boolean(isShowAnswer)}
                disabled={true}
                questionData={currentQuestion}
                key={currentQuestion?._id}
                isQuestionTitle
                isAnswer
              />
            );
          }
          )
        }
      </Form>
    </div>
  );
};

export default VariantRender;
