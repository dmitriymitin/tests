import React, {FC, memo} from 'react';
import {useMedia} from 'react-use';
import {useMutation, useQueryClient} from 'react-query';
import {onUpdateTestInfo} from '../api/test';
import {useForm} from 'antd/es/form/Form';
import {Button, Drawer, Form, Input, message, Modal} from 'antd';
import {useNavigate} from 'react-router-dom';
import drawerStyles from '../DrawerStyles.module.scss';
import s from "./CreateCustomTestForm/CreateCustomTestForm.module.scss";
import SettingSegmented from "./ui/SettingSegmented/SettingSegmented";
import {ISegmentedSetting} from "./UpdateQuestionForm/UpdateQuestionForm";

interface ChangeTitleOrQuestionCountModalDrawerProps {
    refetch: () => void;
    open: boolean;
    testId: string;
    title: string;
    quantityQuestion: number;
    setOpen: (val: boolean) => void;
    isPublicTestAnswers?: boolean;
}

const testSetting: ISegmentedSetting[] = [
  {
    formName: 'isPublicTestAnswers',
    text: 'Сделать результаты публчиными',
    description: 'Студенты смогут посмотреть результаты тестирования.',
  },
];

const ChangeTitleOrQuestionCountModalDrawer: FC<ChangeTitleOrQuestionCountModalDrawerProps> = ({refetch, open, isPublicTestAnswers, quantityQuestion, title, testId, setOpen}) => {
  const isPC = useMedia('(min-width: 768px)');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutateAsync: onUpdateCustomTestTitleTrigger,
    isLoading: onUpdateCustomTestTitleLoading
  } = useMutation(onUpdateTestInfo);

  const [form] = useForm();

  const onOk = async () => {
    try {
      await form.validateFields();
      const testName = form.getFieldValue('testName');
      const testQuestionNumber = form.getFieldValue('testQuestionNumber');
      const isPublicTestAnswers = form.getFieldValue('isPublicTestAnswers');
      await onUpdateCustomTestTitleTrigger({
        testId,
        title: testName,
        quantityQuestion: testQuestionNumber,
        setting: {
          isPublicTestAnswers: Boolean(isPublicTestAnswers)
        }
      });
      await refetch();
      setOpen(false);
    } catch (e) {
      message.error('Ошибка при обновлении информации о тесте');
    }
  };

  const content = (
    <Form
      form={form}
      autoComplete="off"
      layout={'vertical'}
      initialValues={{
        testName: title,
        testQuestionNumber: quantityQuestion,
        isPublicTestAnswers
      }}
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
              title="Изменение информации о тесте"
              onCancel={() => setOpen(false)}
              onOk={onOk}
              className={'modalWrapper'}
              footer={(
                <>
                  <Button onClick={() => setOpen(false)}>Отмена</Button>
                        <Button loading={onUpdateCustomTestTitleLoading} type={'primary'} onClick={onOk}>Изменить</Button>
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
                    className={drawerStyles.drawer}
                    destroyOnClose
      >
        <div className={drawerStyles.drawerWrapper}>
          {content}
          <div className={drawerStyles.btns}>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button loading={onUpdateCustomTestTitleLoading} type={'primary'} onClick={onOk}>Изменить</Button>
          </div>
        </div>
      </Drawer>
      }
    </>
  );
};

export default memo(ChangeTitleOrQuestionCountModalDrawer);
