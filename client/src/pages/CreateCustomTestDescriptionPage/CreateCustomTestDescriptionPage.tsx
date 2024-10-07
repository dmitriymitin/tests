import s from './CreateCustomTestDescriptionPage.module.scss';
import React, {FC, memo, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Button, Form, Layout, message, Spin} from 'antd';
import CreateCustomTestForm from '../../components/CreateCustomTestForm/CreateCustomTestForm';
import EditorWrapper
  from '../../components/EditorWrapper/EditorWrapper';
import ChangeCustomTestTitle from '../../components/CreateCustomTestForm/ChangeCustomTestTitle/ChangeCustomTestTitle';
import {useForm} from 'antd/es/form/Form';
import {getOneTest, onUpdateTestInfo} from '../../api/test';
import {useMutation, useQuery} from 'react-query';
import ChangeTestTitleWithDescription
  from '../../components/CreateCustomTestForm/ChangeTestTitleWithDescription/ChangeTestTitleWithDescription';
import ChangeCustomTestWithDescriptionCountQuestion
  from '../../components/CreateCustomTestForm/ChangeCustomTestWithDescriptionCountQuestion/ChangeCustomTestWithDescriptionCountQuestion';
import exampleData from '../../components/EditorWrapper/Editor/exampleData';
import {RouteNames} from "../../router";


const CreateCustomTestDescriptionPage = () => {
  const {testId} = useParams();
  const navigate = useNavigate();
  const [form] = useForm();

  const {
    data: testData,
    isLoading: testDataLoading,
    isFetching: testDataFetching,
    refetch: tefetchTestData
  } = useQuery(['testDescription', testId], () => getOneTest(testId), {
    refetchOnWindowFocus: false,
    cacheTime: 0
  });

  const [descriptionPARSE, setDescriptionPARSE] = useState(testData?.descriptionEditor || exampleData);

  const {
    mutateAsync: onUpdateTestInfoTrgiier,
    isLoading: updateTestInfoLoading
  } = useMutation(onUpdateTestInfo);

  const getFieldTestTitle = (): string => {
    return form.getFieldValue('testTitle');
  };

  const getFieldTestQuantityQuestion = (): number => {
    return form.getFieldValue('quantityQuestion');
  };

  const handleSaveTestInfo = async () => {
    try {
      const title = getFieldTestTitle();
      const quantityQuestion = getFieldTestQuantityQuestion();
      await onUpdateTestInfoTrgiier({
        testId,
        title,
        quantityQuestion,
        description: descriptionPARSE
      });
      message.success('Тест успешно сохранен');
      navigate('/admin');
    } catch (e) {
      message.error('Ошибка при сохранении теста');
    }
  };

  const getForm = () => {
    return (
      <Form
                form={form}
                className={s.custom__test__form}
                initialValues={{
                  testTitle: testData?.title || 'Название теста',
                  quantityQuestion: testData?.quantityQuestion || 0
                }}
      >
        <h1 className="title">
          Страница создания теста только с описанием
        </h1>
        <div className={s.btns}>
          <Button type={'primary'} onClick={() => navigate(RouteNames.ADMIN_TEST_KEY_INFO + `/${testId}`)}>Ввести ключ</Button>
          <Button type={'primary'} onClick={() => navigate(RouteNames.ADMIN_TEST_INFO + `/${testId}`)}>Перейти к результатам</Button>
        </div>

        <div className={s.test__block}>
          <ChangeTestTitleWithDescription title={testData?.title || 'Название теста'}/>
          <ChangeCustomTestWithDescriptionCountQuestion
                        testId={testId}
                        refetch={tefetchTestData}
                        getFieldTestQuantityQuestion={getFieldTestQuantityQuestion}
                        count={testData?.quantityQuestion || 0}
          />
        </div>
        <h2>
          Описание теста
        </h2>
        <EditorWrapper
                    descriptionPARSE={testData?.descriptionEditor || exampleData}
                    setDescriptionPARSE={setDescriptionPARSE}
        />
        <div className={s.btnSaveWrapper}>
          <Button
                        onClick={handleSaveTestInfo}
                        size={'large'}
                        type={'primary'}
                        // loading={updateTestDescriptionEditorLoading}
          >
            Сохранить изменения
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <Layout className={'layout'}>
      <div className="container">
        {testDataLoading || testDataFetching || updateTestInfoLoading
          ? <div className={s.spin}>
            <Spin size={'large'}/>
          </div>
          : testData ? getForm() : <div>Ошибка при получении теста</div>
        }
      </div>
    </Layout>
  );
};

export default memo(CreateCustomTestDescriptionPage);
