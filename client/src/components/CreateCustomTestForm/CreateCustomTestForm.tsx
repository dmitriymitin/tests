import React, {useEffect, useState} from 'react';
import s from "./CreateCustomTestForm.module.scss";
import TextArea from "antd/es/input/TextArea";
import {Button, message, Popconfirm, Spin} from "antd";
import {useMutation, useQuery} from "react-query";
import {getOneCustomTest, getOneTestInfo, onDeleteQuestionCustomTest} from "../../api/test";
import {useNavigate} from "react-router-dom";
import {ICustomTestQuestion, TypeCustomTestQuestionAnswer} from "../../api/test/type";
import AddNewQuestionModalDrawer from "./AddNewQuestionModalDrawer/AddNewQuestionModalDrawer";
import ChangePasswordModalDrawer from "../ChangePasswordModalDrawer";
import ChangeCustomQuestion from "./ChangeCustomQuestion/ChangeCustomQuestion";


interface CreateCustomTestFormProps {
    testId: string;
}

const CreateCustomTestForm = ({testId}:CreateCustomTestFormProps) => {
    const navigate = useNavigate();

    const [questionForAdd, setQuestionForAdd] = useState<{
        openModal: boolean,
        question: ICustomTestQuestion & { name: string } | Omit<ICustomTestQuestion & { name: string }, '_id'> | null
    }>({
        openModal: false,
        question: null
    })

    const [currentQuestion, setCurrentQuestion] = useState<{
        openModal: boolean,
        question: ICustomTestQuestion & { name: string }
    }>({
        openModal: false,
        question: {} as ICustomTestQuestion & { name: string }
    })

    const {
        mutateAsync: deleteQuestionCustomTEstTrigger,
        isLoading: deleteCustomTestLoading
    } = useMutation(onDeleteQuestionCustomTest)

    const {
        data: customTestData,
        isLoading: customTestLoading,
        isFetching: customTestFetching,
        refetch: refetchCustomTestData
    } = useQuery(['customTestInfo', testId], () => getOneCustomTest(testId), {
        refetchOnWindowFocus: false
    })

    if (customTestLoading || customTestFetching)
        return <Spin size={'large'}/>

    if (!customTestData) {
        message.error('произошла ошибка при получении информации о тесте')
        navigate('/admin')
        return null
    }

    const onDeleteQuestion = async (id: string | null) => {
        try {
            await deleteQuestionCustomTEstTrigger({id, testId})
            refetchCustomTestData();
        } catch (e) {
            message.error('Ошибка при удалении вопроса')
        }
    }

    const setAddOpenModal = (val: boolean) => {
        setQuestionForAdd(prevState => ({
            ...prevState,
            openModal: val
        }))
    }

    const setChangeOpenModal = (val: boolean) => {
        setCurrentQuestion(prevState => ({
            ...prevState,
            openModal: val
        }))
    }

    return (
        <>
            <div className={s.custom__test__form}>
                <h1 className="title">
                    Страница создания теста со своими вопросами
                </h1>

                <div className={s.test__block}>
                    <TextArea
                        className={s.item}
                        rows={2}
                        placeholder={'Введите название теста'}
                    />
                    {customTestData.test.questions?.length > 0 &&
                        customTestData.test.questions.map((el, index) =>
                            <div key={index} className={s.item}>
                                <p>Вопрос {index + 1}</p>
                                <div> {el.description} </div>
                                <div className={s.action__wrapper}>
                                    <Button
                                        onClick={() =>
                                            setCurrentQuestion({
                                                openModal: true,
                                                question: {
                                                    _id: el._id,
                                                    name: `Вопрос ${(customTestData.test.questions?.length || 0) + 1}`,
                                                    description: el.description,
                                                    answers: el.answers
                                                }
                                            })
                                        }
                                        type={'primary'}
                                    >
                                        Изменить
                                    </Button>
                                    <Popconfirm
                                        title="Удаление вопроса"
                                        description="Вы уверены, что хотите удалить вопрос?"
                                        onConfirm={() => onDeleteQuestion(el._id)}
                                        okText="Да"
                                        cancelText="Нет"
                                    >
                                        <Button type={'primary'} danger>Удалить</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        )
                    }
                    <div className={s.btns}>
                        <Button className={s.addBtn} type={'primary'} onClick={() => {
                            setQuestionForAdd({
                                openModal: true,
                                question: {
                                    name: `Вопрос ${(customTestData.test.questions?.length || 0) + 1}`,
                                    description: '',
                                    answers: null
                                }
                            })
                        }}>
                            Добавитиь вопрос
                        </Button>
                    </div>
                </div>
            </div>
            <AddNewQuestionModalDrawer
                refetchTest={refetchCustomTestData}
                testId={testId}
                question={questionForAdd?.question}
                open={questionForAdd.openModal}
                setOpen={setAddOpenModal}
            />
            <ChangeCustomQuestion
                refetchTest={refetchCustomTestData}
                testId={testId}
                question={currentQuestion?.question}
                open={currentQuestion.openModal}
                setOpen={setChangeOpenModal}
            />
        </>
    );
};

export default CreateCustomTestForm;
