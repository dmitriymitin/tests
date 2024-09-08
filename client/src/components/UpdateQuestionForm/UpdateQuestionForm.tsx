import React, {useState} from 'react';
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
import {useMutation} from 'react-query';
import {createQuestion} from '../../api/question';
import {EditorDescriptionTest} from '../../api/test/type';
import {IQuestionAnswer} from '../../api/question/type';

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
}

interface IUpdateQuestionForm {}

interface IFormFields {
  questionKey?: string;
  descriptionParse?: string;
  answerType?: TAnswerType;
}

const UpdateQuestionForm = ({}: IUpdateQuestionForm) => {
  const [form] = useForm<IFormData>();
  const [errors, setErrors] = useState([]);
  const [fieldsData, setFieldsDate] = useState<IFormFields>({});

  const {
    mutateAsync: createNewQuestionTrigger,
    isLoading: isCreateNewQuestionLoading
  } = useMutation(createQuestion);

  const initialValuesForm = {
    questionKey: null,
    descriptionParse: exampleQuestionData
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
    console.log('save', formData);
    try {
      const res = await createNewQuestionTrigger({
        answerType: formData.answerType,
        answers: formData.answerFieldsData,
        setting: {
          timeForAnswer: formData?.timeForAnswer?.toString(),
          isPublicAnswer: Boolean(formData?.isPublicAnswer),
          isPublicQuestion: Boolean(formData?.isPublicQuestion),
          isRandomAnswers: Boolean(formData?.isRandomAnswers)
        }
      });
      console.log('res', res);
    } catch (e) {
      message.error('Ошибка при создании вопроса');
    }
  };

  return (
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
        <div className={sC.title_block}> Описание </div>
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
            Создать вопрос
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
  );
};

export default UpdateQuestionForm;
