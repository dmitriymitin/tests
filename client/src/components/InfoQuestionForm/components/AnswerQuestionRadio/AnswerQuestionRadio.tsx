import React, {useEffect, useState} from 'react';
import {IQuestionAnswer} from '../../../../api/question/type';
import {Button, Form, GetProp, Input, Radio, Row, Space} from 'antd';
import s from '../../../UpdateQuestionForm/components/QuestionTypeAnswerChecbox/QuestionTypeAnswerChecbox.module.scss';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {useForm} from 'antd/es/form/Form';
import sC from './AnswerQuestionRadio.module.scss';
import clsx from 'clsx';
import {AnswerType} from '../../../../models/question';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import IsVisible from '../../../ui/isVisibleWrapper';

interface IAnswerQuestionRadioProps {
  lastValue?: string;
  questionId?: string;
  answers: IQuestionAnswer;
  shuffleArraysIds: string[];
  statusAnswer?: 'error' | 'warning';
  isAnswer?: boolean;
  disabled?: boolean;
  isAnswerForVariant?: boolean;
}

const AnswerQuestionRadio = ({lastValue, isAnswerForVariant, questionId, statusAnswer, shuffleArraysIds, answers, isAnswer, disabled}: IAnswerQuestionRadioProps) => {
  const formInstance = useFormInstance();
  const defaultValue = formInstance?.getFieldValue('answerFieldsData/' + questionId)?.[0];
  const [checked, setChecked] = useState<string | undefined>(defaultValue || undefined);
  const [formRadio] = useForm();

  useEffect(() => {
    formInstance?.setFieldValue('answerFieldsData/' + questionId, {
      [AnswerType.Radio]: {
        keys: checked ? [checked] : []
      }
    });
    formInstance?.submit();
  }, [formInstance, checked]);

  const oRadioChange: GetProp<typeof Radio.Group, 'onChange'> = (e) => {
    if (disabled) {
      return;
    }

    setChecked(e.target.value);
  };

  const arrayValues = Object.values(answers?.radio?.values).sort((a, b) => a.rang - b.rang);

  return (
    <Radio.Group value={checked} onChange={oRadioChange} className="pv-10">
      <Form form={formRadio}>
        <Space direction="vertical" className="gap-10">
          {shuffleArraysIds.map((id, index) => {
            const isLast = id === lastValue;
            const isChecked = checked === id;
            return (
              <div
                key={id}
                className={clsx('flex-row flex-middle flex-center gap-20', {['cursor-pointer']: !disabled})}
                onClick={() => {
                  if (disabled) {
                    return;
                  }

                  setChecked(id);
                }}
                // style={{
                //   borderRadius: 12,
                //   border: isLast && '1px solid ' + (statusAnswer === 'error' ? 'red' : statusAnswer === 'warning' ? 'green' : '')
                // }}
              >
                <div className={clsx('flex-row flex-middle flex-center gap-20 testBackground boxShadow1', {['hover']: !disabled})}>
                  <Row wrap={false} className={clsx(s.row, sC.row)}>
                    <div className="flex-row flex-middle flex-center gap-5">
                      <Radio value={id}/>
                      <div>{arrayValues?.[index]?.key})</div>
                    </div>
                    <div>{answers?.radio?.values?.[id]?.title}</div>
                  </Row>
                </div>
                <div className="w30p">
                  <IsVisible isVisible={isAnswerForVariant ? isChecked : isLast}>
                    {statusAnswer === 'error' && <CloseOutlined className="red"/>}
                    {statusAnswer === 'warning' && <CheckOutlined className="green"/>}
                  </IsVisible>
                </div>
              </div>
            );
          })}
        </Space>
      </Form>
    </Radio.Group>
  );
};

export default AnswerQuestionRadio;
