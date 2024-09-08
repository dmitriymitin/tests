import React, {useState} from 'react';
import s from './ChangeCustomTestTitle.module.scss';
import {Button, Form, message} from 'antd';
import {CheckOutlined, CloseOutlined, EditOutlined, SaveOutlined} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import {useMutation} from 'react-query';
import {onUpdateCustomTestTitle} from '../../../api/test';

interface ChangeCustomTestTitleProps {
    testId: string;
    refetch: () => void;
    getFieldTestTitle: () => string;
    title: string;
}

const ChangeCustomTestTitle = ({testId, title, getFieldTestTitle, refetch}: ChangeCustomTestTitleProps) => {
  const [isChangeTitle, setIsChangeTitle] = useState(true);

  const {
    mutateAsync: onUpdateCustomTestTitleTrigger,
    isLoading: onUpdateCustomTestTitleLoading
  } = useMutation(onUpdateCustomTestTitle);

  const onSave = async () => {
    try {
      const newTitle = getFieldTestTitle();
      await onUpdateCustomTestTitleTrigger({
        testId: testId,
        title: newTitle,
      });
      await refetch();
      setIsChangeTitle(false);
    } catch (e) {
      message.error('Произошла ошибка при обновлении названия теста');
    }
  };

  if (isChangeTitle) {
    return (
      <div className={s.title__wrapper}>
        <Form.Item
                    className={s.formTestTitle}
                    name={'testTitle'}
        >
          <TextArea
                        className={s.text__area__title}
                        rows={2}
                        placeholder={title}
          />
        </Form.Item>
        <Button
                    loading={onUpdateCustomTestTitleLoading}
                    onClick={onSave}
                    className={s.clearBtn}
                    icon={<CheckOutlined/>}
        />
        <Button
                    loading={onUpdateCustomTestTitleLoading}
                    onClick={() => setIsChangeTitle(false)}
                    className={s.clearBtn}
                    icon={<CloseOutlined/>}
        />
      </div>
    );
  }

  return (
    <div className={s.title__block}>
      <h2 className={s.title}>Название теста</h2>
      <div className={s.title__wrapper}>
        <p className={s.test__title}>{title}</p>
      </div>
      <div className={s.btnWrapper}>
        <Button
                    type={'primary'}
                    onClick={() => setIsChangeTitle(true)}
        >
          Редактировать
        </Button>
      </div>
    </div>
  );
};

export default ChangeCustomTestTitle;
