import React, {FC, useEffect, useState} from 'react';
import {AnswerType, TAnswerType} from '../../../../models/question';
import {Form, FormInstance, Input} from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import QuestionTypeAnswerRadio from '../QuestionTypeAnswerRadio/QuestionTypeAnswerRadio';
import QuestionTypeAnswerCheckbox from '../QuestionTypeAnswerChecbox/QuestionTypeAnswerChecbox';
import QuestionTypeAnswerInput from '../QuestionTypeAnswerInput/QuestionTypeAnswerInput';

interface IQuestionTypeAnswerSettingProps {
  answerType: TAnswerType;
}

const FormWrapper = (props: any) => {
  const rules = [];
  if (props.message) {
    rules.push({
      required: true,
      message: props.message
    });
  }

  return (
    <Form.Item
      noStyle
      name="answerFieldsData"
      rules={rules}
    >
      {props.children}
    </Form.Item>
  );
};

const QuestionTypeAnswerInfo: FC<IQuestionTypeAnswerSettingProps> = ({answerType}) => {
  if (answerType === AnswerType.Text) {
    return (
      <FormWrapper key={'1'}>
        <QuestionTypeAnswerInput/>
      </FormWrapper>
    );
  }

  if (answerType === AnswerType.Radio) {
    return (
      <FormWrapper key={'2'} message={'Все ключи должны быть уникальны'}>
        <QuestionTypeAnswerRadio />
      </FormWrapper>
    );
  }

  return (
    <FormWrapper key={'3'} message={'Все ключи должны быть уникальны'}>
      <QuestionTypeAnswerCheckbox />
    </FormWrapper>
  );
};

export default QuestionTypeAnswerInfo;
