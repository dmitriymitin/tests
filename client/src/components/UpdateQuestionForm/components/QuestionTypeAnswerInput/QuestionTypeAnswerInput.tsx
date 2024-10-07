import React, {useEffect, useState} from 'react';
import {Input, Popover} from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {AnswerType} from '../../../../models/question';
import {useIsMounted} from '../../../../http/hooks/useIsMounted';
import {InfoCircleOutlined} from '@ant-design/icons';

const QuestionTypeAnswerInput = () => {
  const formInstance = useFormInstance();
  const defaultFieldForm = formInstance.getFieldValue('answerFieldsData');
  const [keys, setKeys] = useState(defaultFieldForm?.text?.keys?.[0] || '');

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
      <Input className="boxShadow1"
             style={{maxWidth: 400}}
             value={keys}
             onChange={(e) => setKeys(e.target.value.replace(/\s+/g, ''))}
             addonAfter={
               <div className="flex-row flex-center flex-middle gap-10">
                 <Popover className="cursor-pointer fs-18 mxw-100" content={'Ответ записывайте без пробелов — например, 97531 или яблокорябина.'}>
                   <InfoCircleOutlined />
                 </Popover>
               </div>
             }
      />
    </>
  );
};

export default QuestionTypeAnswerInput;
