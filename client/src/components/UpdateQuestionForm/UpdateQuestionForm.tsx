import React, {useState} from 'react';
import sC from './UpdateQuestionForm.module.scss';
import exampleQuestionData from "../EditorWrapper/Editor/exampleQuestionData";
import s from "../../pages/CreateCustomTestDescriptionPage/CreateCustomTestDescriptionPage.module.scss";
import {Button, Form} from "antd";
import {useForm} from "antd/es/form/Form";
import EditorWrapperForm from "../EditorWrapper/EditorWrapperForm";
import {QuestionTypeAnswerList} from "./components/QuestionTypeAnswerList/QuestionTypeAnswerList";
import QuestionTypeAnswerInfo from "./components/QuestionTypeAnswerInfo/QuestionTypeAnswerInfo";
import {TAnswerType} from "../../models/question";
import IsVisibleWrapper from "../ui/isVisibleWrapper";

interface IUpdateQuestionForm {}

interface IFormFields {
  questionKey?: string,
  descriptionParse?: string,
  answerType?: TAnswerType,
}

const UpdateQuestionForm = ({}: IUpdateQuestionForm) => {
  const [form] = useForm();
  const [fieldsData, setFieldsDate] = useState<IFormFields>({});

  const initialValuesForm = {
    questionKey: null,
    descriptionParse: exampleQuestionData
  }

  const onSubmit = () => {
    // form.validateFields();
    console.log('save', form.getFieldsValue());
  }

  return (
    <Form
      form={form}
      className={s.custom__test__form}
      onFieldsChange={(_, allFields) => {
        const fieldsData = allFields.reduce((acc, el) => {
          if (!el || !el?.name[0]) {
            return acc;
          }

          return {...acc, [el.name[0]]: el.value}
        }, {} as IFormFields)
        setFieldsDate(fieldsData);
      }}
      initialValues={initialValuesForm}
    >
      <div className={sC.wrapper}>
        {/*<ChangeQuestionKey/>*/}
        <div className={sC.title_block}> Настройки вопроса</div>
        <div className={sC.title_block}> Описание вопроса</div>
        <EditorWrapperForm/>
        <div className={sC.title_block}>Способ ответа</div>
        <QuestionTypeAnswerList isInfoBlock/>
        <IsVisibleWrapper isVisible={!!fieldsData?.answerType}>
          <QuestionTypeAnswerInfo answerType={fieldsData.answerType!}/>
        </IsVisibleWrapper>
        <Button onClick={onSubmit}>Сохранить</Button>
      </div>
    </Form>
  );
};

export default UpdateQuestionForm;