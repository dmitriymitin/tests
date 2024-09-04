import React, {useEffect, useState} from 'react';
import {Input} from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import {AnswerType} from "../../../../models/question";

const QuestionTypeAnswerInput = () => {
  const [value, setValue] = useState('');
  const formInstance = useFormInstance();

  useEffect(() => {
    formInstance.setFieldValue('answerFieldsData', {
      [AnswerType.Text]: {
        value
      }
    });
  }, [formInstance, value]);

  return (
    <>
      <Input style={{maxWidth: 400}} value={value} onChange={(e) => setValue(e.target.value)}/>
    </>
  );
};

export default QuestionTypeAnswerInput;