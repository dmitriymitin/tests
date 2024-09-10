import React from 'react';
import {Form, Select} from 'antd';
import {useAllGroupQuestion} from '../../../../http/hooks/useAllGroupQuestion';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

const QuestionThemes = () => {
  const {
    data: allGroupQuestion,
    isFetching: isAllGroupQuestionFetching,
    isLoading: isAllGroupQuestionLoading
  } = useAllGroupQuestion();

  const formInstase = useFormInstance();

  const isLoading = !allGroupQuestion || isAllGroupQuestionFetching || isAllGroupQuestionLoading;

  const handleChange = (value: string) => {
    formInstase.setFieldValue('groupsId', value ? [value] : []);
  };

  return (
    <Form.Item
      noStyle
      name={'groupsId'}
    >
      <div className="flex-row flex-middle gap-10 fs-16">
        Тема:
        <Select
          style={{
            maxWidth: 200,
            width: '100%',
            height: 30,
          }}
          disabled={isLoading}
          loading={isLoading}
          onChange={handleChange}
          options={allGroupQuestion?.map((el, index) => ({
            label: el.name,
            value: el._id
          }))}
        />
      </div>
    </Form.Item>
  );
};

export default QuestionThemes;
