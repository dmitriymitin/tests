import React, {useEffect, useState} from 'react';
import {Input, Popover} from 'antd';
import {InfoCircleOutlined, InfoOutlined, SettingOutlined} from '@ant-design/icons';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {AnswerType} from '../../../../models/question';
import s from './AnswerQuestionText.module.scss';
import IsVisible from "../../../ui/isVisibleWrapper";
import clsx from "clsx";

const AnswerQuestionText = ({questionId, statusAnswer, isAnswerForVariant}: {questionId: string; statusAnswer?: 'error' | 'warning'; isAnswerForVariant?: boolean}) => {
  const formInstance = useFormInstance();
  const defaultValue = formInstance?.getFieldValue('answerFieldsData/' + questionId)?.[0];
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    formInstance?.setFieldValue('answerFieldsData/' + questionId, {
      [AnswerType.Text]: {
        keys: value ? [value] : []
      }
    });
    formInstance?.submit();
  }, [formInstance, value]);

  return (
    <Input
      className={clsx({
        [s.input]: statusAnswer === 'warning',
        [s.inputRed]: statusAnswer === 'error',
        [s.inputBorderNone]: isAnswerForVariant != null && !statusAnswer,
      })}
      value={value}
      prefixCls={clsx({
        [s.inputWrapper]: statusAnswer === 'warning',
        [s.inputWrapperRed]: !isAnswerForVariant && statusAnswer === 'error',
        [s.inputWrapperRedAnswer]: isAnswerForVariant && statusAnswer === 'error',
      })}
      status={statusAnswer}
      placeholder={'Ответ'}
      onChange={(e) => setValue(e.target.value.replace(/\s+/g, ''))}
      addonAfter={
        <div className="flex-row flex-center flex-middle gap-10">
          {statusAnswer === 'error' ? 'Неверно' : statusAnswer === 'warning' && 'Верно'}
          <IsVisible isVisible={isAnswerForVariant == null}>
            <Popover className="cursor-pointer fs-18 mxw-100" content={'Ответ записывайте без пробелов — например, 97531.'}>
              <InfoCircleOutlined />
            </Popover>
          </IsVisible>
        </div>
      }/>
  );
};

export default AnswerQuestionText;
