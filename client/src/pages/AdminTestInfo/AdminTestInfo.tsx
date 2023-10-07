import React, {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {clearTestResults, getOneTestInfo} from "../../api/test";
import {Button, message, Popconfirm, Spin} from "antd";
import AdminTestInfoTable from "../../components/AdminTestInfoTable/AdminTestInfoTable";
import s from './AdminTestInfo.module.scss'
import clsx from "clsx";
import ChangeCustomQuestion from "../../components/CreateCustomTestForm/ChangeCustomQuestion/ChangeCustomQuestion";
import {ICustomTestQuestion} from "../../api/test/type";

const AdminTestInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const testId = location.pathname.split('/')[3]
    const [currentQuestion, setCurrentQuestion] = useState<{
        openModal: boolean,
        question: ICustomTestQuestion & { name: string }
    }>({
        openModal: false,
        question: {} as ICustomTestQuestion & { name: string }
    })


    const {
        data: testInfoData,
        isLoading: isTestInfoLoading,
        refetch
    } = useQuery(['adminTestInfo', testId], () => getOneTestInfo(testId))

    const {
        mutateAsync: clearTestResultsTrigger,
        isLoading: clearTestResultsLoading
    } = useMutation(clearTestResults)


    if (!testInfoData || isTestInfoLoading) {
        return <div className={s.spin}>
            <Spin size={'large'}/>
        </div>
    }

    const setModal = (val: boolean) => {
        setCurrentQuestion(prev => ({...prev, openModal: val}))
    }

    const handleClearResults = async () => {
        try {
            await clearTestResultsTrigger(testId)
            refetch()
        } catch (e) {
            message.error('Ошибка при удалении результатов')
        }
    }

    const currentTest = testInfoData.test
    const testInfoUsersResult = testInfoData.usersInfo

    return (
        <div className={clsx(s.admin__test__info, 'container')}>
            <h1 className={"title"}>
                {currentTest.title}
            </h1>
            <Popconfirm
                title="Очистка рузльтатов"
                description="Вы уверены, что хотите очистить результаты?"
                onConfirm={handleClearResults}
                okText="Да"
                cancelText="Нет"
            >
                <Button style={{width: 200}} type={'primary'} danger>Очистить результаты</Button>
            </Popconfirm>
            <div className={s.admin__test__info__changeKey}>
                Ключ {testInfoData.testKey || 'не установлен'}
                <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/key/${currentTest._id}`)}>Изменить ключ</Button>
                {testInfoData.test.questions &&
                    <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/customTest/${currentTest._id}`)}>Редакитровать тест</Button>
                }
            </div>
            {
                testInfoUsersResult.length === 0
                    ? <p>Результов по тесту нет</p>
                    :  <AdminTestInfoTable
                        firstQuestionTitle={currentTest.firstQuestionTitle || 'Фамилия, номер группы'}
                        usersTestInfo={testInfoUsersResult}
                        questions={currentTest.questions}
                        countAnswers={currentTest.quantityQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        testKey={testInfoData.testKey}
                    />
            }
            {testInfoData.test.questions &&
                <ChangeCustomQuestion
                    refetchTest={refetch}
                    testId={testId}
                    question={currentQuestion.question}
                    open={currentQuestion.openModal}
                    setOpen={setModal}
                />
            }
        </div>
    );
};

export default AdminTestInfo;
