import {useMedia} from 'react-use';
import {Button, Drawer, Form, Input, message, Modal} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {useMutation, useQueryClient} from 'react-query';
import {createNewTest} from '../api/test';
import {getFormateDate} from '../utils/getFormateDate';
import drawerStyle from '../DrawerStyles.module.scss';
import s from "./CreateCustomTestForm/CreateCustomTestForm.module.scss";
import SettingSegmented from "./ui/SettingSegmented/SettingSegmented";
import React from "react";
import {ISegmentedSetting} from "./UpdateQuestionForm/UpdateQuestionForm";

interface NewTestModalDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

const testSetting: ISegmentedSetting[] = [
  {
    formName: 'isPublicTestAnswers',
    text: 'Сделать результаты публчиными',
    description: 'Студенты смогут посмотреть результаты тестирования.',
  },
  {
    formName: 'isTestAnswersDetail',
    text: 'Сделать результаты детализированными',
  },
];

const NewTestModalDrawer = ({open, setOpen}: NewTestModalDrawerProps) => {
  const isPC = useMedia('(min-width: 768px)');
  const queryClient = useQueryClient();

  const {
    mutateAsync: createNewTestTrigger,
    isLoading: isCreateNewTestLoading
  } = useMutation(createNewTest);

  const [form] = useForm();

  const onOk = async () => {
    try {
      await form.validateFields();
      const testName = form.getFieldValue('testName');
      const testQuestionNumber = form.getFieldValue('testQuestionNumber');
      const isPublicTestAnswers = form.getFieldValue('isPublicTestAnswers');
      const isTestAnswersDetail = form.getFieldValue('isTestAnswersDetail');
      const date = new Date();
      const createDate = getFormateDate(date);
      await createNewTestTrigger({
        title: testName,
        quantityQuestion: testQuestionNumber,
        createDate,
        setting: {
          isPublicTestAnswers: Boolean(isPublicTestAnswers),
          isTestAnswersDetail: Boolean(isTestAnswersDetail),
        }
      });
      await queryClient.invalidateQueries({queryKey: ['allTests']});
      setOpen(false);
    } catch (e) {
      message.error('Ошибка при создании теста');
    }
  };

  const content = (
    <Form
      form={form}
      autoComplete="off"
      layout={'vertical'}
    >
      <Form.Item
        label={'Введите название теста'}
        name={'testName'}
        rules={[
          {
            required: true,
            message: 'Введите название теста'
          }
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label={'Введите кол-во вопросов'}
        rules={[
          {
            required: true,
            message: 'Введите кол-во вопросов'
          }
        ]}
        name={'testQuestionNumber'}
      >
        <Input type={'number'}/>
      </Form.Item>
      <div className={s.title_block}> Настройки</div>
      <div className="testBackground">
        {testSetting.map((el, index) => (
          <SettingSegmented
            key={index}
            formName={el.formName}
            text={el.text}
            type={el.type}
            description={el.description}
            isDev={el.isDev}
          />
        ))}
      </div>
    </Form>
  );

  return (
    <>
      {isPC &&
          <Modal
              open={open}
              title="Создание нового теста"
              onCancel={() => setOpen(false)}
              onOk={onOk}
              className={'modalWrapper'}
              footer={(
                <>
                  <Button onClick={() => setOpen(false)}>Отмена</Button>
                  <Button loading={isCreateNewTestLoading} type={'primary'} onClick={onOk}>Подтвердить</Button>
                </>
              )}
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
                    className={drawerStyle.drawer}
                    destroyOnClose
      >
        <div className={drawerStyle.drawerWrapper}>
          {content}
          <div className={drawerStyle.btns}>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button loading={isCreateNewTestLoading} type={'primary'} onClick={onOk}>Подтвердить</Button>
          </div>
        </div>
      </Drawer>
      }
    </>
  );
};

export default NewTestModalDrawer;

