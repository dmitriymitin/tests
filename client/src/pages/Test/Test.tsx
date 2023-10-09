import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {getOneTest, getOneUserTest, saveNewTest} from "../../api/test";
import {Button, Form, Input, message, Popconfirm, Radio, Space, Spin} from "antd";
import {useForm} from "antd/es/form/Form";
import s from './Test.module.scss'
import clsx from "clsx";
import {ICustomTestQuestion} from "../../api/test/type";
import edjsHTML from "editorjs-html";
import parse from "html-react-parser";

const edjsParser = edjsHTML();

const Test = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const testId = location.pathname.split('/')[2]

    const [form] = useForm()

    const {
        data: testData,
        isLoading: isTestLoading,
        isFetching: isTestFetching
    } = useQuery(['test', testId], () => getOneUserTest(testId), {
        refetchOnWindowFocus: false
    })

    const {
        mutateAsync: saveAnswerTrigger,
        isLoading: isSaveAnswerLoading
    } = useMutation(saveNewTest)


    if (isTestLoading || isTestFetching) {
        return <div className={s.spin}>
            <Spin size={'large'}/>
        </div>
    }

    if (!testData) {
        navigate('/');
        message.error('Данного теста не существует')
        return null
    }

    if (testData.status === 'Start' || testData.status === 'Close') {
        return (
            <div className={clsx(s.user__test, 'container')}>
                <h1 className={s.title}>
                    {testData.title}
                </h1>
                <div>
                    Тест закрыт
                </div>
            </div>
        )
    }

    const isTestWithDescription = !!testData.descriptionEditor

    const onSendForm = async () => {
        try {
            await form.validateFields()
        } catch (e) {
            message.error('Заполните все обязательные поля!')
            return
        }

        try {
            const formData = await form.getFieldsValue();
            const FIOGroup = formData['FIOGroup']
            if (!isTestWithDescription) {
                const answer = Object.keys(formData)
                    .reduce((obj, key) => {
                        if (key !== "FIOGroup") {
                            obj[key] = formData[key];
                        }
                        return obj;
                    }, {} as {
                        [key: string]: string;
                    });
                await saveAnswerTrigger({
                    FIOGroup,
                    answer,
                    testId
                })
            } else {
                const testKey = formData['testKey']
                const newArray = new Array(testData.quantityQuestion).fill('1')
                const answer = newArray.reduce((obj, key, index) => {
                        obj[index + 1] = testKey[index];
                        return obj;
                    }, {} as {
                        [key: string]: string;
                    });
                await saveAnswerTrigger({
                    FIOGroup,
                    answer,
                    testId
                })
            }
            message.success('Ваши ответы сохранены!')
            navigate('/')
        } catch (e) {
            message.error('Ошибка при отправке формы')
        }
    }

    return (
        <div className={clsx(s.user__test, 'container')}>
            <h1 className="title">
                {testData.title}
            </h1>
            <Form
                className={s.form}
                form={form}
                layout={'vertical'}
            >
                <div className={s.item}>
                    <div className={s.title}>{testData.firstQuestionTitle || 'Фамилия, номер группы'}</div>
                    <Form.Item
                        name={"FIOGroup"}
                        rules={[
                            {
                                required: true,
                                message: 'Обязательный вопрос'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </div>
                {!testData.descriptionEditor
                ?  testData.questions
                        ? testData?.questions?.map((el, index) =>
                            <div key={el._id} className={s.item}>
                                <div className={s.title}>Вопрос {index + 1}</div>
                                <div className={s.description}>
                                    {el.description}
                                </div>
                                <Form.Item
                                    name={`${index + 1}`}
                                >
                                    {el.answers && Object.keys(el.answers).length > 0
                                        ? <Radio.Group>
                                            <Space direction="vertical">
                                                {Object.values(el.answers).map((el, index) =>
                                                    <Radio key={index} value={el.value}>{el.name}</Radio>
                                                )}
                                            </Space>
                                        </Radio.Group>
                                        : <Input className={s.customQuestionInput}/>
                                    }
                                </Form.Item>
                            </div>)
                        : new Array(testData.quantityQuestion).fill('1').map((_, index) =>
                            <div key={index} className={s.item}>
                                <div className={s.title}>Вопрос {index + 1}</div>
                                <Form.Item
                                    name={`${index + 1}`}
                                >
                                    <Input/>
                                </Form.Item>
                            </div>
                        )
                : <div className={s.testWithDescription}>
                        <div className={clsx( "text-container", s.descriptionBg)}>{parse(edjsParser.parse(testData.descriptionEditor).join(""))}</div>
                        <div className={s.item}>
                            <div className={s.title}>Введите свои ответы:</div>
                            <Form.Item
                                name={`testKey`}
                            >
                                <Input
                                    maxLength={testData.quantityQuestion}
                                />
                            </Form.Item>
                        </div>
                </div>
                }
            </Form>
            <div className={s.confirmBtnWrapper}>
                <Popconfirm
                    title="Завершение теста"
                    description="Вы уверены, что хотите завершить тест?"
                    onConfirm={onSendForm}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        className={s.confirmBtn}
                        loading={isSaveAnswerLoading}
                        size={'large'}
                        type={'primary'}
                    >
                        Завершить тест
                    </Button>
                </Popconfirm>
            </div>
        </div>
    );
};

export default Test;
