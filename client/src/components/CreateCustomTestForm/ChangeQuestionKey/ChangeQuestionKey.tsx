import s from './ChangeQuestionKey.module.scss';
import React, {FC, memo, useState} from 'react';
import {Button, Form, Input} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

interface ChangeTestTitleWithDescriptionProps {}

const ChangeQuestionKey: FC<ChangeTestTitleWithDescriptionProps> = () => {
  const [isChangeKey, setIsChangeKey] = useState(true);
  const form = useFormInstance();

  const defaultKey = form.getFieldValue('questionKey');

  if (isChangeKey) {
    return (
      <div className={s.title__wrapper}>
        <Form.Item
                    className={s.form}
                    name={'questionKey'}
                    label={'Ключ: '}
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста, введите ключ'
                      }
                    ]}
        >
          <Input
                        className={s.text__area__title}
                        placeholder={defaultKey}
          />
        </Form.Item>
      </div>
    );
  }

  return (
    <div className={s.title__block}>
      <h2 className={s.title}>Ключ к вопросу</h2>
      <div className={s.title__wrapper}>
        <p className={s.test__title}>{defaultKey}</p>
      </div>
      <div className={s.btnWrapper}>
        <Button
                    type={'primary'}
                    onClick={() => setIsChangeKey(true)}
        >
          Редактировать
        </Button>
      </div>
    </div>
  );
};

export default memo(ChangeQuestionKey);
