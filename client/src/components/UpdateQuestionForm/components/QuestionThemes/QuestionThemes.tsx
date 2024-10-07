import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Empty, Form, Input, InputRef, Select, Space, Spin} from 'antd';
import {useAllGroupQuestion} from '../../../../http/hooks/useAllGroupQuestion';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {PlusOutlined} from '@ant-design/icons';
import QuestionThemesInputAdd from './QuestionThemesInputAdd';
import IsVisible from '../../../ui/isVisibleWrapper';

const QuestionThemes = () => {
  const {
    data: allGroupQuestion,
    isFetching: isAllGroupQuestionFetching,
    isLoading: isAllGroupQuestionLoading
  } = useAllGroupQuestion();

  const formInstase = useFormInstance();
  const defaultValue = formInstase.getFieldValue('groupsId');

  const isLoading = !allGroupQuestion || isAllGroupQuestionFetching || isAllGroupQuestionLoading;

  const handleChange = (value: string) => {
    console.log('value', value);
    formInstase.setFieldValue('groupsId', value ? [value] : []);
  };

  return (
    <>
      <IsVisible isVisible={isAllGroupQuestionLoading}>
        <div className="status-block h40p">
          <Spin size={'default'}/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isAllGroupQuestionLoading}>
        <Form.Item noStyle name={'groupsId'}/>
        <div className="flex-row flex-middle gap-10 fs-16">
          Тема:
          <Select
            notFoundContent={
              <Empty imageStyle={{height: 70}} description={'Темы не найдены'}/>
            }
            defaultValue={defaultValue}
            style={{
              maxWidth: 300,
              width: '100%',
              height: 30,
            }}
            loading={isLoading}
            onChange={handleChange}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{margin: '8px 0'}}/>
                <QuestionThemesInputAdd isLoading={isLoading}/>
              </>
            )}
            options={allGroupQuestion?.map((el, index) => ({
              label: el.name,
              value: el._id
            }))}
          />
        </div>
      </IsVisible>
    </>
  );
};

export default QuestionThemes;
