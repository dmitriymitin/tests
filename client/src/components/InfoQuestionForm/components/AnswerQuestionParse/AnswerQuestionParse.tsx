import React from 'react';
import {IQuestion, IQuestionAnswer} from '../../../../api/question/type';
import {AnswerType, TAnswerType} from '../../../../models/question';
import {Form} from "antd";
import QuestionTypeAnswerInput
  from "../../../UpdateQuestionForm/components/QuestionTypeAnswerInput/QuestionTypeAnswerInput";
import QuestionTypeAnswerRadio
  from "../../../UpdateQuestionForm/components/QuestionTypeAnswerRadio/QuestionTypeAnswerRadio";
import QuestionTypeAnswerCheckbox
  from "../../../UpdateQuestionForm/components/QuestionTypeAnswerChecbox/QuestionTypeAnswerChecbox";
import AnswerQuestionText from "../AnswerQuestionText/AnswerQuestionText";
import AnswerQuestionRadio from "../AnswerQuestionRadio/AnswerQuestionRadio";
import AnswerQuestionCheckbox from "../AnswerQuestionCheckbox/AnswerQuestionCheckbox";
import useFormInstance from "antd/es/form/hooks/useFormInstance";

const FormWrapper = ({questionId, children}: {questionId: string, children: any}) => {
  return (
    <Form.Item
      noStyle
      style={{width: '100%'}}
      name={'answerFieldsData/' + questionId}
    >
      {children}
    </Form.Item>
  );
};

interface IAnswerQuestionParseProps {
  lastValue?: string;
  questionId?: string;
  answerType?: TAnswerType;
  answers: IQuestionAnswer;
  shuffleArraysIds: string[];
  statusAnswer?: 'error' | 'warning';
}

const AnswerQuestionParse = ({questionId, lastValue, answerType, answers, shuffleArraysIds, statusAnswer}: IAnswerQuestionParseProps) => {
  if (answerType === AnswerType.Text) {
    return (
      <FormWrapper key={'1'} questionId={questionId}>
        <AnswerQuestionText questionId={questionId} statusAnswer={statusAnswer}/>
      </FormWrapper>
    );
  }

  if (answerType === AnswerType.Radio) {
    return (
      <FormWrapper key={'2'} questionId={questionId}>
        <AnswerQuestionRadio lastValue={lastValue} questionId={questionId} answers={answers} shuffleArraysIds={shuffleArraysIds} statusAnswer={statusAnswer}/>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper key={'3'} questionId={questionId}>
      <AnswerQuestionCheckbox lastValue={lastValue} questionId={questionId} answers={answers} shuffleArraysIds={shuffleArraysIds} statusAnswer={statusAnswer}/>
    </FormWrapper>
  );
};

export default AnswerQuestionParse;
