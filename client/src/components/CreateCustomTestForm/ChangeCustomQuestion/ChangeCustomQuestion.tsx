import React, {useEffect, useState} from 'react';
import {useMutation} from "react-query";
import {addQuestionToCustomTest} from "../../../api/test";
import {useForm} from "antd/es/form/Form";
import {useMedia} from "react-use";
import {Button, Drawer, Form, Input, message, Modal} from "antd";
import {ICustomTestQuestion, TypeCustomTestQuestionAnswer} from "../../../api/test/type";
import s from "../AddNewQuestionModalDrawer/AddNewQuestionModalDrawer.module.scss";
import TextArea from "antd/es/input/TextArea";
import {CloseOutlined} from "@ant-design/icons";

interface answersInfoState {
    answers: {
        [key: string]: TypeCustomTestQuestionAnswer
    }
}

interface ChangeCustomQuestionProps {
    refetchTest: () => void
    testId: string;
    question: ICustomTestQuestion & { name: string }
    open: boolean,
    setOpen: (val: boolean) => void
}

const ChangeCustomQuestion = ({refetchTest, testId, question, open, setOpen}: ChangeCustomQuestionProps) => {
    const [answersInfo, setAnswersInfo] = useState<answersInfoState>({
        answers: question.answers || {}
    })

    useEffect(() => {
        if (!question.answers)
            return
        form.setFieldValue('description', question.description)
        setAnswersInfo({answers: question.answers})
    }, [question]);

    const {
        mutateAsync: addQuestionToCustomTestTrigger,
        isLoading: addQuestionToCustomTestLoading
    } = useMutation(addQuestionToCustomTest)

    const [form] = useForm()
    const isPC = useMedia('(min-width: 768px)');

    const onOk = async () => {
        try {
            await addQuestionToCustomTestTrigger({
                id: testId,
                question: {
                    description: form.getFieldValue('description'),
                    answers: answersInfo.answers
                }
            })
            refetchTest();
            setOpen(false)
            setAnswersInfo({answers: {}})
            message.success(question.name + ' был успешно добавлен!')
        } catch (e) {
            message.error('Ошибка при добавлении ' + question.name)
        }
    }

    const onCancel = () => {
        setAnswersInfo({answers: {}})
        setOpen(false)
    }

    const handleAddQuestion = () => {
        setAnswersInfo(prevState => {
            const newIndex = `${Object.keys(prevState.answers).length}`
            prevState.answers[newIndex] = {name: '', value: ''}
            return {
                answers: {...prevState.answers}
            }
        })
    }

    const handleDeleteAnswer = (index: string) => {
        setAnswersInfo(prevState => {
                const indexString = index.toString()
                prevState.answers = Object.entries(prevState.answers).reduce((acc, el) => {
                    if (el[0] !== indexString) {
                        acc[el[0]] = el[1]
                    }
                    return acc
                }, {} as {
                    [key: string]: TypeCustomTestQuestionAnswer
                })
                return {
                    answers: {...prevState.answers}
                }
            }
        )
    }

    const handleChangeNameAnswer = (index: string, name: string) => {
        setAnswersInfo(prevState => {
            const newIndex = `${index}`
            prevState.answers[newIndex] = {name, value: prevState.answers[newIndex].value}
            return {
                answers: {...prevState.answers}
            }
        })
    }

    const handleChangeValueAnswer = (index: string, value: string) => {
        setAnswersInfo(prevState => {
            const newIndex = `${index}`
            prevState.answers[newIndex] = {value, name: prevState.answers[newIndex].name}
            return {
                answers: {...prevState.answers}
            }
        })
    }

    const content = (
        <Form
            layout={'vertical'}
            form={form}
            className={s.test__body}
        >
            <p className={s.title}>{question.name}</p>
            <Form.Item
                className={s.description}
                label={'Описание вопроса:'}
                name={'description'}
            >
                <TextArea
                    rows={isPC ? 8 : 10}
                    autoSize={isPC ? undefined : {minRows: 10, maxRows: 10}}
                    value={question.description}
                />
            </Form.Item>
            {answersInfo.answers && Object.values(answersInfo.answers).length > 0 &&
                <div className={s.answer__wrapper}>
                    <div className={s.answer__block}>
                        {
                            Object.entries(answersInfo.answers).map((el) => {
                                    return (
                                        <div key={el[0]} className={s.answer__item}>
                                            <div className={s.closeWrapper}>
                                                <Button onClick={() => handleDeleteAnswer(el[0])} className={s.clearBtn}
                                                        icon={<CloseOutlined/>}/>
                                            </div>
                                            <div className={s.info__wrapper}>
                                                <div className={s.value}>
                                                    <p className={s.text}>Отображаемое название: </p>
                                                    <Input
                                                        value={answersInfo.answers[el[0]]?.name}
                                                        onChange={(e) => handleChangeNameAnswer(el[0], e.target.value)}
                                                    />
                                                </div>
                                                <div className={s.value}>
                                                    <p className={s.text}>Значение для ключа: </p>
                                                    <Input
                                                        value={answersInfo.answers[el[0]]?.value}
                                                        onChange={(e) => handleChangeValueAnswer(el[0], e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            }
            <Button
                className={s.addAnswerBtn}
                type={'primary'}
                onClick={handleAddQuestion}
            >
                Добавить ответ
            </Button>
        </Form>
    )

    return (
        <>
            {isPC &&
                <Modal
                    open={open}
                    title="Редактирование вопроса"
                    onCancel={() => setOpen(false)}
                    onOk={onOk}
                    width={800}
                    className={"modalWrapper"}
                    footer={(
                        <>
                            <Button onClick={onCancel}>Отмена</Button>
                            <Button type={'primary'} onClick={onOk}>Редактировать вопрос</Button>
                        </>
                    )}
                >
                    {content}
                </Modal>
            }

            {!isPC &&
                <Drawer
                    placement={"bottom"}
                    onClose={() => setOpen(false)}
                    open={open}
                    width={500}
                    height={'auto'}
                    className={s.drawer}
                    destroyOnClose
                >
                    <div className={s.drawerWrapper}>
                        {content}
                    </div>
                    <div className={s.btns}>
                        <Button onClick={onCancel}>Отмена</Button>
                        <Button type={'primary'} onClick={onOk}>Добавить вопрос</Button>
                    </div>
                </Drawer>
            }
        </>
    )
};

export default ChangeCustomQuestion;
