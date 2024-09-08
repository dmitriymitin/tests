'use client';
import s from './ChangeCustomTestWithDescriptionCountQuestion.module.scss';
import React, {FC, memo, useState} from 'react';
import {useMutation} from 'react-query';
import {onUpdateCustomTestTitle, onUpdateTestInfo} from '../../../api/test';
import {Button, Form, Input, InputNumber, message} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';

interface ChangeCustomTestWithDescriptionCountQuestionProps {
    testId: string;
    refetch: () => void;
    getFieldTestQuantityQuestion: () => number;
    count: number;
}

const ChangeCustomTestWithDescriptionCountQuestion: FC<ChangeCustomTestWithDescriptionCountQuestionProps> = ({testId, count, getFieldTestQuantityQuestion, refetch}) => {
  const [isChangeTitle, setIsChangeTitle] = useState(true);

  // const {
  //     mutateAsync: onUpdateCustomTestTitleTrigger,
  //     isLoading: onUpdateCustomTestTitleLoading
  // } = useMutation(onUpdateTestInfo)

  // const onSave = async () => {
  //     try {
  //         const quantityQuestion = getFieldTestQuantityQuestion();
  //         await onUpdateCustomTestTitleTrigger({
  //             testId:testId,
  //             quantityQuestion,
  //         })
  //         refetch()
  //         setIsChangeTitle(false)
  //     } catch (e) {
  //         message.error('Произошла ошибка при обновлении названия теста')
  //     }
  // }

  if (isChangeTitle) {
    return (
      <div className={s.title__wrapper}>
        <Form.Item
                    className={s.formTestTitle}
                    name={'quantityQuestion'}
                    label={'Кол-во вопросов'}
        >
          <InputNumber
                        className={s.text__area__title}
                        placeholder={`${count}`}
          />
        </Form.Item>
        {/* <Button */}
        {/*    loading={onUpdateCustomTestTitleLoading} */}
        {/*    onClick={onSave} */}
        {/*    className={s.clearBtn} */}
        {/*    icon={<CheckOutlined/>} */}
        {/* /> */}
        {/* <Button */}
        {/*    loading={onUpdateCustomTestTitleLoading} */}
        {/*    onClick={() => setIsChangeTitle(false)} */}
        {/*    className={s.clearBtn} */}
        {/*    icon={<CloseOutlined/>} */}
        {/* /> */}
      </div>
    );
  }

  return (
    <div className={s.title__block}>
      <h2 className={s.title}>Кол-во вопросов теста</h2>
      <div className={s.title__wrapper}>
        <p className={s.test__title}>{count}</p>
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

export default memo(ChangeCustomTestWithDescriptionCountQuestion);

