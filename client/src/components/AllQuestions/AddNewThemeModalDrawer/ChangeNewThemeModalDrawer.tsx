import React, {useEffect} from 'react';
import {useMedia} from 'react-use';
import {useMutation} from 'react-query';
import s from './AddNewThemeModalDrawer.module.scss';
import {Button, Drawer, Form, Input, message, Modal} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {createGroupQuestion, updateGroupQuestion} from '../../../api/questionGroup';
import {useAllGroupQuestion} from '../../../http/hooks/useAllGroupQuestion';
import {IQuestionGroup} from "../../../api/questionGroup/type";

interface IFormData {
  name: string;
}

interface UpdateNewQuestionModalDrawerProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  group?: IQuestionGroup;
}

const ChangeNewThemeModalDrawer = ({open, setOpen, group}: UpdateNewQuestionModalDrawerProps) => {
  const [form] = useForm<IFormData>();
  const isPC = useMedia('(min-width: 768px)');

  const {
    mutateAsync: changeQuestionGroupTrigger,
    isLoading: isChangeQuestionGroupLoading
  } = useMutation(updateGroupQuestion);

  const {invalidate} = useAllGroupQuestion();

  useEffect(() => {
    form.setFieldValue('name', group?.name);
  }, []);

  const onOk = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }

    try {
      const formData = form.getFieldsValue();
      await changeQuestionGroupTrigger({_id: group?._id, name: formData.name});
      await invalidate();
      setOpen(false);
      message.success('Тема была успешно изменена!');
    } catch (e) {
      message.error('Ошибка при изменении темы');
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  const content = (
    <Form
      onSubmitCapture={onOk}
      layout={'vertical'}
      form={form}
      className={s.test__body}
    >
      <Form.Item
        className={s.description}
        label={'Название темы: '}
        rules={[{
          required: true,
          message: 'Пожалуйста, введите название темы'
        }]}
        name={'name'}
      >
        <Input/>
      </Form.Item>
    </Form>
  );

  const btns = (
    <>
      <Button onClick={onCancel}>Отмена</Button>
      <Button
        loading={isChangeQuestionGroupLoading}
        type={'primary'}
        onClick={onOk}>
        Изменить тему
      </Button>
    </>
  );

  return (
    <>
      {isPC &&
      <Modal
              open={open}
              title="Изменение темы"
              onCancel={() => setOpen(false)}
              onOk={onOk}
              width={600}
              className={'modalWrapper'}
              footer={btns}
      >
        {content}
      </Modal>
      }

      {!isPC &&
      <Drawer
              placement={'bottom'}
              onClose={() => setOpen(false)}
              open={open}
              width={500}
              height={'auto'}
              className={s.drawer}
              destroyOnClose
      >
        <div className={s.drawerWrapper}>
          {content}
        </div>
        <div className={s.btns}>
          {btns}
        </div>
      </Drawer>
      }
    </>
  );
};

export default ChangeNewThemeModalDrawer;
