import React, {useEffect, useState} from 'react';
import sC from './UpdateQuestionForm.module.scss';
import exampleQuestionData from '../EditorWrapper/Editor/exampleQuestionData';
import s from '../../pages/CreateCustomTestDescriptionPage/CreateCustomTestDescriptionPage.module.scss';
import {Button, Form, FormInstance, message} from 'antd';
import {useForm} from 'antd/es/form/Form';
import EditorWrapperForm from '../EditorWrapper/EditorWrapperForm';
import {QuestionTypeAnswerList} from './components/QuestionTypeAnswerList/QuestionTypeAnswerList';
import QuestionTypeAnswerInfo from './components/QuestionTypeAnswerInfo/QuestionTypeAnswerInfo';
import {TAnswerType} from '../../models/question';
import IsVisible from '../ui/isVisibleWrapper';
import QuestionSettingSegmented, {TQuestionType} from './components/QuestionSettingSegmented/QuestionSettingSegmented';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {createQuestion, getQuestion, updateQuestion} from '../../api/question';
import {EditorDescriptionTest} from '../../api/test/type';
import {IQuestionAnswer} from '../../api/question/type';
import QuestionThemes from './components/QuestionThemes/QuestionThemes';
import {RouteNames} from '../../router';
import {useNavigate} from 'react-router-dom';

interface IQuestionSetting {
  formName: string;
  text: string;
  type?: TQuestionType;
  description?: string;
}

const questionSetting: IQuestionSetting[] = [
  {
    formName: 'isRandomAnswers',
    text: 'Перемшивать варианты ответов ',
    description: 'У двух студентов порядок овтетов будет разный. Если способ ответа - текстовый, то настройка работать не будет.'
  },
  {
    formName: 'timeForAnswer',
    text: 'Время на прохождение ',
    type: 'time',
    description: 'Без значения, время не учитывается'
  },
  {
    formName: 'isPublicQuestion',
    text: 'Сделать вопрос публчиным ',
    description: 'Если выбрать да, то по уникальному id, пользователи смогут посмотреть вопрос, отдельно от теста'
  },
  {
    formName: 'isPublicAnswer',
    text: 'Сделать ответ публчиным ',
    description: 'Если выбрать да, то пользователи смогут посмотреть ответ на вопрос сами.'
  }
];

interface IFormData {
  answerFieldsData: IQuestionAnswer;
  answerType: TAnswerType;
  descriptionParse: EditorDescriptionTest;
  isPublicAnswer: 0 | 1;
  isPublicQuestion: 0 | 1;
  isRandomAnswers: 0 | 1;
  timeForAnswer: string;
  groupsId: string[];
}

interface IUpdateQuestionForm {
  questionId?: string;
}

interface IFormFields {
  questionKey?: string;
  descriptionParse?: string;
  answerType?: TAnswerType;
}

const UpdateQuestionForm = ({questionId}: IUpdateQuestionForm) => {
  const [form] = useForm<IFormData>();
  const [errors, setErrors] = useState([]);
  const [fieldsData, setFieldsDate] = useState<IFormFields>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryKey = `question${questionId}`;

  const {data: questionData, isLoading: isLoadingQuestiondata} = useQuery({
    queryKey,
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
    retry: false
  });

  const {
    mutateAsync: createNewQuestionTrigger,
    isLoading: isCreateNewQuestionLoading
  } = useMutation(createQuestion);

  const {
    mutateAsync: updateQuestionTrigger
  } = useMutation(updateQuestion);

  const initialValuesForm: IFormData = {
    answerFieldsData: questionData?.answers,
    answerType: questionData?.answerType,
    timeForAnswer: questionData?.setting.timeForAnswer,
    groupsId: questionData?.groupsId,
    isPublicQuestion: questionData?.setting?.isPublicQuestion ? 1 : 0,
    isRandomAnswers: questionData?.setting?.isRandomAnswers ? 1 : 0,
    isPublicAnswer: questionData?.setting?.isPublicAnswer ? 1 : 0,
    descriptionParse: questionData?.descriptionEditor || exampleQuestionData
  };

  const getKeys = (isError = true) => {
    const formData = form.getFieldsValue();
    const answerFieldsData = formData?.answerFieldsData;
    const checkboxKeys: string[] = answerFieldsData?.checkbox?.keys;
    const radioKeys: string[] = answerFieldsData?.radio?.keys;
    const textKeys: string[] = answerFieldsData?.text?.keys;
    return checkboxKeys?.length || radioKeys?.length || textKeys?.length;
  };

  const getErrors = () => {
    const fieldErrors = form.getFieldsError();
    const errorsNew: string[] = [];
    fieldErrors.forEach(error => {
      if (error.errors[0]) {
        errorsNew.push(error.errors[0]);
      }
    });

    if (errorsNew.length === 0) {
      const isValidKeys = getKeys();
      if (!isValidKeys) {
        errorsNew.push('Выберите/введите правильный ответ на вопрос.');
      }
    }

    setErrors(errorsNew);

    return errorsNew.length === 0;
  };

  const onSubmit = async () => {
    const isValidErrors = getErrors();
    if (!isValidErrors) {
      return;
    }

    const formData = form.getFieldsValue();
    try {
      const dataToResponse = {
        answerType: formData.answerType,
        answers: formData.answerFieldsData,
        groupsId: formData.groupsId,
        descriptionEditor: formData.descriptionParse,
        setting: {
          timeForAnswer: formData?.timeForAnswer?.toString(),
          isPublicAnswer: Boolean(formData?.isPublicAnswer),
          isPublicQuestion: Boolean(formData?.isPublicQuestion),
          isRandomAnswers: Boolean(formData?.isRandomAnswers)
        }
      };
      if (!questionId) {
        await createNewQuestionTrigger(dataToResponse);
      } else {
        await updateQuestionTrigger({id: questionId, data: dataToResponse});
        await queryClient.invalidateQueries(queryKey);
      }

      message.success('Вопрос успешно создан');
      navigate(RouteNames.ADMIN_QUESTIONS_LIST);
    } catch (e) {
      message.error('Ошибка при создании вопроса');
    }
  };

  return (
    <IsVisible isVisible={!isLoadingQuestiondata}>
      <Form
        form={form}
        className={s.custom__test__form}
        onFieldsChange={(_, allFields) => {
          getErrors();
          const fieldsData = allFields.reduce((acc, el) => {
            if (!el || !el?.name[0]) {
              return acc;
            }

            return {...acc, [el.name[0]]: el.value};
          }, {} as IFormFields);
          setFieldsDate(fieldsData);
        }}
        initialValues={initialValuesForm}
      >
        <div className={sC.wrapper}>
          {/* <ChangeQuestionKey/> */}
          <div className="testBackground mb-20">
            <QuestionThemes />
          </div>
          <div className="testBackground">
            {questionSetting.map((el, index) => (
              <QuestionSettingSegmented
                key={index}
                formName={el.formName}
                text={el.text}
                type={el.type}
                description={el.description}
              />
            ))}
          </div>
          <div className={sC.title_block}> Описание</div>
          <EditorWrapperForm/>
          <div className={sC.title_block}>Способ ответа</div>
          <div className="testBackground flex-center">
            <QuestionTypeAnswerList isInfoBlock/>
            <IsVisible isVisible={!!fieldsData?.answerType}>
              <div className="mt-30">
                <QuestionTypeAnswerInfo answerType={fieldsData.answerType!}/>
              </div>
            </IsVisible>
          </div>
          <div className="btnSaveWrapper mt-20 flex-middle gap-10">
            <Button
              loading={isCreateNewQuestionLoading}
              disabled={errors.length !== 0}
              onClick={onSubmit}
              size={'large'}
              type={'primary'}
            >
              {questionId ? 'Редактировать вопрос' : 'Создать вопрос'}
            </Button>
            {!!errors.length &&
            <div className="flex-wrap gap-10 flex-middle">
              {errors
                .filter(error => error)
                .map((error, index) => (
                  <div key={index} className="customErrorBox fs-14">
                    {error}
                  </div>
                ))}
            </div>
            }
          </div>
        </div>
      </Form>
    </IsVisible>
  );
};

export default UpdateQuestionForm;
