import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {getOneTest, getOneUserTest, saveNewTest} from "../../api/test";
import {Button, Form, Input, message, Popconfirm, Spin} from "antd";
import {useForm} from "antd/es/form/Form";
import s from './Test.module.scss'
import clsx from "clsx";

const Test = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const testId = location.pathname.split('/')[2]

    const [form] = useForm()

    const {
        data: testData,
        isLoading: isTestLoading
    } = useQuery(['test', testId], () => getOneUserTest(testId))

    const {
        mutateAsync: saveAnswerTrigger,
        isLoading: isSaveAnswerLoading
    } = useMutation(saveNewTest)

    useEffect(() => {
        if (!isTestLoading && !testData) {
            navigate('/');
            message.error('Данного теста не существует')
        }
    }, [isTestLoading]);

    if (!testData || isTestLoading) {
        return <Spin size={'large'}/>
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

    const onSendForm = async () => {
        try {
            await form.validateFields()
        } catch (e) {
            message.error('Введите Ф.И.О и номер группы')
            return
        }

        try {
            const formData = await form.getFieldsValue();
            const FIOGroup = formData['FIOGroup']
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
            message.success('Ваши ответы сохранены!')
            navigate('/')
        } catch (e) {
            // @ts-ignore
            message.error('Ошибка при отправке формы')
        }
    }

    return (
        <div className={clsx(s.user__test, 'container')}>
            <h1 className={s.title}>
                {testData.title}
            </h1>
            <Form
                className={s.form}
                form={form}
                layout={'vertical'}
            >
                <div className={s.item}>
                    <div>Ф.И.О Группа</div>
                    <Form.Item
                        name={"FIOGroup"}
                        rules={[
                            {
                                required: true,
                                message: 'Введите Ф.И.О и номер группы'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </div>
                {
                    new Array(testData.quantityQuestion).fill('1').map((_, index) =>
                        <div key={index} className={s.item}>
                            <div>Вопрос {index + 1}</div>
                            <Form.Item
                                name={`${index + 1}`}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                    )
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
