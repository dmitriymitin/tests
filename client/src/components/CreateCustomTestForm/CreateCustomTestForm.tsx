import React, {useEffect, useState} from 'react';
import s from './CreateCustomTestForm.module.scss';
import {Button, Form, message, Popconfirm, Radio, Space, Spin} from 'antd';
import {useMutation, useQuery} from 'react-query';
import {addQuestionToCustomTest, getOneCustomTest, onDeleteQuestionCustomTest, updateCustomTest} from '../../api/test';
import {useNavigate, useParams} from 'react-router-dom';
import {EditorDescriptionTest, ICustomTestQuestion, IGetTestInfoCustomModelResponse} from '../../api/test/type';
import AddNewQuestionModalDrawer from './AddNewQuestionModalDrawer/AddNewQuestionModalDrawer';
import ChangeCustomQuestion from './ChangeCustomQuestion/ChangeCustomQuestion';
import ChangeCustomTestTitle from './ChangeCustomTestTitle/ChangeCustomTestTitle';
import {useForm} from 'antd/es/form/Form';
import {RouteNames} from '../../router';
import QuestionColumn from './QuestionColumn/QuestionColumn';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import {useDragEnd} from './hooks/useDragEnd';
import AllQuestionColumn from './QuestionColumn/AllQuestionColumn';
import {useAllQuestion} from '../../http/hooks/useAllQuestion';
import {IQuestion, IQuestionAnswer} from '../../api/question/type';
import {useQuestionsEvent} from './hooks/useQuestionsEvent';
import {useAllGroupsStore} from '../../store/groups/useAllGroups';
import CreateCustomTestFormAllQuestions from './CreateCustomTestFormAllQuestions';
import IsVisible from '../ui/isVisibleWrapper';
import {ISegmentedSetting} from '../UpdateQuestionForm/UpdateQuestionForm';
import SettingSegmented from '../ui/SettingSegmented/SettingSegmented';
import {TAnswerType} from '../../models/question';
import exampleQuestionData from '../EditorWrapper/Editor/exampleQuestionData';

interface ICreateCustomTestFormProps {
  questionData?: IQuestion[];
  testData?: IGetTestInfoCustomModelResponse;
  refetchTest?: () => void;
  isTestLoading?: boolean;
  isAllQuestionsLoading?: boolean;
  isTestError?: boolean;
}

const testSetting: ISegmentedSetting[] = [
  {
    formName: 'isRandomQuestions',
    text: 'Перемешивать вопросы',
  },
  {
    formName: 'isPublicTestAnswers',
    text: 'Сделать результаты публчиными',
    description: 'Студенты смогут посмотреть результаты тестирования.',
  },
  {
    formName: 'isTestAnswersDetail',
    text: 'Сделать результаты детализированными',
  },
  {
    formName: 'isPublicTestVariants',
    text: 'Показывать в результатах варианты студентов',
  },
  {
    formName: 'isPublicTestVariantsAnswers',
    text: 'Показывать правильные ответы на вопросы в вариантах',
  },
  // {
  //   formName: 'timeForAnswer',
  //   text: 'Время на прохождение',
  //   type: 'time',
  //   description: 'Без значения, время не учитывается',
  //   isDev: true,
  // },
  // {
  //   formName: 'isPublicTest',
  //   text: 'Сделать тест публчиным',
  //   description: 'Тест будет доступен для просмотра',
  //   isDev: true,
  // }
];

interface IFormData {
  isPublicTest: 0 | 1;
  isPublicTestAnswers: 0 | 1;
  isPublicTestVariants: 0 | 1;
  isTestAnswersDetail: 0 | 1;
  isPublicTestVariantsAnswers: 0 | 1;
  isRandomQuestions: 0 | 1;
  testTitle: string;
  timeForAnswer: string;
}

const CreateCustomTestForm = ({questionData, testData, isAllQuestionsLoading, isTestError, refetchTest, isTestLoading}: ICreateCustomTestFormProps) => {
  const {testId} = useParams();
  const navigate = useNavigate();
  const [form] = useForm<IFormData>();

  const {
    mutateAsync: updateCustomTestTrigger,
    isLoading: isLoadingIpdateCustomTestTrigger
  } = useMutation(updateCustomTest);

  if (isTestError) {
    message.error('произошла ошибка при получении информации о тесте');
    navigate('/admin');
    return null;
  }

  const initialValuesForm = {
    isRandomQuestions: testData?.test?.setting?.isRandomQuestions ? 1 : 0,
    timeForAnswer: testData?.test?.setting?.timeForAnswer,
    isPublicTest: testData?.test?.setting?.isPublicTest ? 1 : 0,
    isPublicTestAnswers: testData?.test?.setting?.isPublicTestAnswers ? 1 : 0,
    isTestAnswersDetail: testData?.test?.setting?.isTestAnswersDetail ? 1 : 0,
    isPublicTestVariants: testData?.test?.setting?.isPublicTestVariants ? 1 : 0,
    isPublicTestVariantsAnswers: testData?.test?.setting?.isPublicTestVariantsAnswers ? 1 : 0,
  };

  useEffect(() => {
    if (testData?.test?.title) {
      form.setFieldValue('testTitle', testData.test.title);
    }
  }, [testData, initialValuesForm]);

  const getFieldTestTitle = (): string => {
    return form.getFieldValue('testTitle');
  };

  const handleSaveChange = async () => {
    const formData = form.getFieldsValue();
    try {
      await updateCustomTestTrigger(
        {
          id: testId,
          updateTest: {
            setting: {
              isRandomQuestions: Boolean(formData?.isRandomQuestions),
              timeForAnswer: formData?.timeForAnswer?.toString(),
              isPublicTest: Boolean(formData?.isPublicTest),
              isPublicTestAnswers: Boolean(formData?.isPublicTestAnswers),
              isTestAnswersDetail: Boolean(formData?.isTestAnswersDetail),
              isPublicTestVariants: Boolean(formData?.isPublicTestVariants),
              isPublicTestVariantsAnswers: Boolean(formData?.isPublicTestVariantsAnswers),
            }
          }
        });
      message.success('Настройки успешно сохранены');
    } catch (e) {
      message.error('Ошибка при сохранении настроек');
    }
  };

  return (
    <IsVisible isVisible={!isTestLoading}>
      <Form
        disabled={isTestLoading}
        form={form}
        className={s.custom__test__form}
        initialValues={initialValuesForm}
      >
        <h1 className="title">
          Страница создания теста с вопросами
        </h1>

        <div className={s.btns}>
          <Button type={'primary'} onClick={() => navigate(RouteNames.ADMIN_TEST_KEY_INFO + `/${testId}`)}>Ввести ключ</Button>
          <Button type={'primary'} onClick={() => navigate(RouteNames.TEST_INFO + `/${testId}`)}>Перейти к результатам</Button>
        </div>

        <div className={s.test__block}>
          <ChangeCustomTestTitle
            style={{
              marginBottom: 12
            }}
            testId={testId}
            refetch={refetchTest}
            getFieldTestTitle={getFieldTestTitle}
            isLoading={isTestLoading}
            title={testData?.test?.title || ''}
          />

          <div className={s.title_block}> Настройки </div>
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
            <div className="flex-row flex-end">
              <Button type="primary" onClick={handleSaveChange} loading={isLoadingIpdateCustomTestTrigger}>Сохранить измненения</Button>
            </div>
          </div>

          <IsVisible isVisible={isTestLoading}>
            <div className="status-block h220p">
              <Spin size={'large'}/>
            </div>
          </IsVisible>
          <IsVisible isVisible={!isTestLoading}>
            <CreateCustomTestFormAllQuestions
              questionData={questionData}
              testData={testData}
              isTestLoading={isTestLoading}
              isAllQuestionsLoading={isAllQuestionsLoading}
            />
          </IsVisible>
        </div>
      </Form>
    </IsVisible>

  // {/* ДОБАВЛЕНИЕ ВОПРОСА */}
  // {/* <AddNewQuestionModalDrawer */}
  // {/*          refetchTest={refetchCustomTestData} */}
  // {/*          testId={testId} */}
  // {/*          question={questionForAdd?.question} */}
  // {/*          open={questionForAdd.openModal} */}
  // {/*          setOpen={setAddOpenModal} */}
  // {/* /> */}
  //
  // {/* ОБНОВЛЕНИЕ ВОПРОСА */}
  // {/* <ChangeCustomQuestion */}
  // {/*          refetchTest={refetchCustomTestData} */}
  // {/*          testId={testId} */}
  // {/*          question={currentQuestion?.question} */}
  // {/*          open={currentQuestion.openModal} */}
  // {/*          setOpen={setChangeOpenModal} */}
  // {/* /> */}
  );
};

export default CreateCustomTestForm;
