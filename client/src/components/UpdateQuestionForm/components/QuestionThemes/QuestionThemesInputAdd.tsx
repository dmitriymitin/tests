import React, {useRef, useState} from 'react';
import {Button, Form, Input, InputRef, message, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useAllGroupQuestion} from '../../../../http/hooks/useAllGroupQuestion';
import AddNewThemeModalDrawer from '../../../AllQuestions/AddNewThemeModalDrawer/AddNewThemeModalDrawer';
import {useMutation} from 'react-query';
import {createGroupQuestion} from '../../../../api/questionGroup';

const QuestionThemesInputAdd = ({isLoading}: {isLoading: boolean}) => {
  const {invalidate} = useAllGroupQuestion();

  const {
    mutateAsync: addQuestionGroupTrigger,
    isLoading: isAddQuestionGroupLoading
  } = useMutation(createGroupQuestion);

  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    try {
      e.preventDefault();
      await addQuestionGroupTrigger({name});
      await invalidate();
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (e) {
      message.error('Ошибка при добавлении темы');
    }
  };

  return (
    <Space style={{padding: '0 8px 4px'}}>
      <Form.Item
        noStyle
        name={'groupsIdInput'}
      >
        <Input
        placeholder="Введите название"
        ref={inputRef}
        value={name}
        onChange={onNameChange}
        onKeyDown={(e) => e.stopPropagation()}
        />
      </Form.Item>
      <Button disabled={isLoading} loading={isLoading} type="text" className="fs-12" icon={<PlusOutlined />} onClick={addItem}>
        Добавить тему
      </Button>
    </Space>
  );
};

export default QuestionThemesInputAdd;
