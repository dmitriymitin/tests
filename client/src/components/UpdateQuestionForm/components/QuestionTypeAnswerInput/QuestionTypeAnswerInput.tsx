import React, {useEffect, useState} from 'react';
import {Input} from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {AnswerType} from '../../../../models/question';
import {useIsMounted} from '../../../../http/hooks/useIsMounted';

const QuestionTypeAnswerInput = () => {
  const [keys, setKeys] = useState('');
  const formInstance = useFormInstance();

  useEffect(() => {
    formInstance.submit();
    formInstance.setFieldValue('answerFieldsData', {
      [AnswerType.Text]: {
        keys: keys ? [keys] : []
      }
    });
  }, [formInstance, keys]);

  return (
    <>
      <Input className="boxShadow1" style={{maxWidth: 400}} value={keys} onChange={(e) => setKeys(e.target.value)}/>
    </>
  );
};

export default QuestionTypeAnswerInput;
