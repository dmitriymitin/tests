import React, {useEffect, useState} from 'react';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {useForm} from 'antd/es/form/Form';
import {AnswerType} from '../../../../models/question';
import {Checkbox, Form, GetProp, Radio, Row, Space} from 'antd';
import clsx from 'clsx';
import s from '../../../UpdateQuestionForm/components/QuestionTypeAnswerChecbox/QuestionTypeAnswerChecbox.module.scss';
import sC from '../AnswerQuestionRadio/AnswerQuestionRadio.module.scss';
import {IQuestionAnswer} from '../../../../api/question/type';
import IsVisible from '../../../ui/isVisibleWrapper';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';

interface IAnswerQuestionCheckboxProps {
  lastValue?: string;
  questionId?: string;
  answers: IQuestionAnswer;
  shuffleArraysIds: string[];
  statusAnswer?: 'error' | 'warning';
  disabled?: boolean;
  isAnswerForVariant?: boolean;
}

const AnswerQuestionCheckbox = ({lastValue, disabled, questionId, isAnswerForVariant, statusAnswer, shuffleArraysIds, answers}: IAnswerQuestionCheckboxProps) => {
  const formInstance = useFormInstance();
  const defaultValue = formInstance?.getFieldValue('answerFieldsData/' + questionId);
  const [checkedList, setCheckedList] = useState<string[] | undefined>(defaultValue || undefined);
  const [formRadio] = useForm();

  useEffect(() => {
    formInstance?.setFieldValue('answerFieldsData/' + questionId, {
      [AnswerType.Checkbox]: {
        keys: checkedList && checkedList.length ? checkedList : []
      }
    });
    formInstance?.submit();
  }, [formInstance, checkedList]);

  const onCheckboxChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    if (disabled) {
      return;
    }

    setCheckedList(checkedValues as any);
  };

  const arrayValues = Object.values(answers?.checkbox?.values).sort((a, b) => a.rang - b.rang);

  return (
    <Checkbox.Group value={checkedList} onChange={onCheckboxChange} className="pv-10">
      <Form form={formRadio}>
        <Space direction="vertical" className="gap-10">
          {shuffleArraysIds.map((id, index) => {
            const isLast = lastValue.includes(id);
            const isChecked = checkedList.includes(id);
            const isRightAnswer = answers?.checkbox?.keys?.includes(id);
            return (
              <div
                key={id}
                className={clsx('flex-row flex-middle flex-center gap-20', {['cursor-pointer']: !disabled})}
                onClick={() => {
                  if (disabled) {
                    return;
                  }

                  setCheckedList(prev => {

                    const newArr = [...(prev || [])];
                    if (newArr.includes(id)) {
                      return newArr.filter(el => el !== id);
                    }

                    return [...newArr, id];
                  });
                }}
              >
                <div
                  className={clsx('flex-row flex-middle flex-center gap-20 testBackground boxShadow1', {['hover']: !disabled})}>
                  <Row wrap={false} className={clsx('flex-row flex-middle', sC.row)}>
                    <div className="flex-row flex-middle flex-center gap-10">
                      <Checkbox value={id}/>
                      <div>{arrayValues?.[index]?.key})</div>
                    </div>
                    <div>{answers?.checkbox?.values?.[id]?.title}</div>
                  </Row>
                </div>
                <div className="w30p">
                  <IsVisible isVisible={isAnswerForVariant ? isChecked : isLast}>
                    {!isRightAnswer && <CloseOutlined className="red"/>}
                    {isRightAnswer && <CheckOutlined className="green"/>}
                  </IsVisible>
                </div>
              </div>
            );
          })}
        </Space>
      </Form>
    </Checkbox.Group>
  );
};

export default AnswerQuestionCheckbox;
