import s from "./CreateCustomTestDescriptionPage.module.scss";
import React, {FC, memo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Form, Layout, Spin} from "antd";
import CreateCustomTestForm from "../../components/CreateCustomTestForm/CreateCustomTestForm";
import CreateCustomTestDescriptionForm
    from "../../components/CreateCustomTestDescriptionForm/CreateCustomTestDescriptionForm";
import ChangeCustomTestTitle from "../../components/CreateCustomTestForm/ChangeCustomTestTitle/ChangeCustomTestTitle";
import {useForm} from "antd/es/form/Form";
import {getOneTest} from "../../api/test";
import {useQuery} from "react-query";
import ChangeTestTitleWithDescription
    from "../../components/CreateCustomTestForm/ChangeTestTitleWithDescription/ChangeTestTitleWithDescription";
import ChangeCustomTestWithDescriptionCountQuestion
    from "../../components/CreateCustomTestForm/ChangeCustomTestWithDescriptionCountQuestion/ChangeCustomTestWithDescriptionCountQuestion";

interface CreateCustomTestDescriptionProps {}

const CreateCustomTestDescriptionPage: FC<CreateCustomTestDescriptionProps> = ({}) => {
    const location = useLocation();
    const testId = location.pathname.split('/')[5]
    const navigate = useNavigate()
    const [form] = useForm();

    const {
        data: testData,
        isLoading: testDataLoading,
        isFetching: testDataFetching,
        refetch: tefetchTestData
    } = useQuery(['testDescription', testId], () => getOneTest(testId), {
        refetchOnWindowFocus: false,
        cacheTime: 0
    })

    const getFieldTestTitle = (): string => {
        return form.getFieldValue('testTitle')
    }

    const getFieldTestQuantityQuestion = (): number => {
        return form.getFieldValue('quantityQuestion')
    }

    const getForm = () => {
        return (
            <Form
                form={form}
                className={s.custom__test__form}
                initialValues={{
                    testTitle: testData?.title || 'Название теста' ,
                    quantityQuestion: testData?.quantityQuestion || 0
            }}
            >
                <h1 className="title">
                    Страница создания теста только с описанием
                </h1>
                <div className={s.btns}>
                    <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/key/${testId}`)}>Ввести ключ</Button>
                    <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/${testId}`)}>Перейти к результатам</Button>
                </div>

                <div className={s.test__block}>
                    <ChangeTestTitleWithDescription
                        testId={testId}
                        refetch={tefetchTestData}
                        getFieldTestTitle={getFieldTestTitle}
                        title={testData?.title || 'Название теста'}
                    />
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
                <CreateCustomTestDescriptionForm
                    id={testId}
                    description={testData?.descriptionEditor}
                    refetch={tefetchTestData}
                />
            </Form>
        )
    }

    return (
        <Layout>
            <div className="container">
                {testDataLoading && testDataFetching
                    ?
                    <div className={s.spin}>
                        <Spin size={'large'}/>
                    </div>
                    : testData ? getForm() : <div>Ошибка при получении теста</div>
                }
            </div>
        </Layout>
    );
};

export default memo(CreateCustomTestDescriptionPage);
