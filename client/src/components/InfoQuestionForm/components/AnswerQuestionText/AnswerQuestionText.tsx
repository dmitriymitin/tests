import React, {useEffect, useState} from 'react';
import {Input, Popover} from 'antd';
import {InfoCircleOutlined, InfoOutlined, SettingOutlined} from '@ant-design/icons';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {AnswerType} from '../../../../models/question';
import s from './AnswerQuestionText.module.scss';

const AnswerQuestionText = ({questionId, statusAnswer}: {questionId: string; statusAnswer?: 'error' | 'warning'}) => {
  const formInstance = useFormInstance();
  const [value, setValue] = useState('');

  useEffect(() => {
    formInstance.setFieldValue('answerFieldsData/' + questionId, {
      [AnswerType.Text]: {
        keys: value ? [value] : []
      }
    });
    formInstance.submit();
  }, [formInstance, value]);

  return (
    <Input
      className={statusAnswer === 'warning' && s.input}
      value={value}
      prefixCls={statusAnswer === 'warning' && s.inputWrapper}
      status={statusAnswer}
      placeholder={'Ответ'}
      onChange={(e) => setValue(e.target.value.replace(/\s+/g, ''))}
      addonAfter={
        <div className="flex-row flex-center flex-middle gap-10">
          {statusAnswer === 'error' ? 'Неверно' : statusAnswer === 'warning' && 'Верно'}
          <Popover className="cursor-pointer fs-18 mxw-100" content={'Ответ записывайте без пробелов — например, 97531 или яблокорябина.'}>
            <InfoCircleOutlined />
          </Popover>
        </div>
      }/>
  );
};

export default AnswerQuestionText;
