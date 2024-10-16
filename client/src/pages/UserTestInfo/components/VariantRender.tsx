import React, {Fragment} from 'react';
import s from './VariantRender.module.scss';
import {useTestUserResult} from '../../../http/hooks/useTestUserResult';
import InfoQuestionForm from '../../../components/InfoQuestionForm/InfoQuestionForm';
import {Form} from 'antd';
import {useForm} from 'antd/es/form/Form';

interface IVariantRender {
  userAnswerId?: string;
}

const VariantRender = ({userAnswerId}: IVariantRender) => {
  const [form] = useForm();
  const {data} = useTestUserResult(userAnswerId);
  const initQuestionsData = Object.entries(data?.userInfo?.answersCustom.values)
    ?.reduce((acc, [idQuest, {keys}]) => {
      acc['answerFieldsData/' + idQuest] = keys;
      return acc;
    }, {});
  console.log(initQuestionsData);
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
      </div>
      <Form
        form={form}
        disabled={true}
        className="flex-col gap-20"
        initialValues={initQuestionsData}
      >
        {
          data?.testInfo?.questions?.map((el) =>
            <InfoQuestionForm questionData={el} key={el._id} isQuestionTitle isAnswer/>
          )
        }
      </Form>
    </div>
  );
};

export default VariantRender;
