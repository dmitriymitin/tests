import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {clearTestResults, getOneTestInfo} from "../../api/test";
import {Button, Input, message, Popconfirm, Radio, Spin} from "antd";
import AdminTestInfoTable from "../../components/AdminTestInfoTable/AdminTestInfoTable";
import s from './AdminTestInfo.module.scss'
import clsx from "clsx";
import ChangeCustomQuestion from "../../components/CreateCustomTestForm/ChangeCustomQuestion/ChangeCustomQuestion";
import {ICustomTestQuestion} from "../../api/test/type";
import {DownloadOutlined} from "@ant-design/icons";
import {API_URL} from "../../http";

const AdminTestInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const testId = location.pathname.split('/')[3]
    const fio = localStorage.getItem('FIO')
    const [isFullInfo, setIsFullInfo] = useState(false);
    const [search, setSearch] = useState(fio || '');
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
        isFetching: isTestInfoFetching,
        refetch
    } = useQuery(['adminTestInfo', testId], () => getOneTestInfo(testId), {
        refetchOnWindowFocus: false
    })
    const [testInfoUsersResult, setTestInfoUsersResult] = useState(testInfoData?.usersInfo)

    const {
        mutateAsync: clearTestResultsTrigger,
        isLoading: clearTestResultsLoading
    } = useMutation(clearTestResults)

    useEffect(() => {
        setTestInfoUsersResult(testInfoData?.usersInfo)
    }, [testInfoData])

    useEffect(() => {
        if (!search) {
            setTestInfoUsersResult(testInfoData?.usersInfo)
            return
        }
        setTestInfoUsersResult(prev =>
            {
                console.log(search)
                const test = testInfoData?.usersInfo?.filter((el) => el.FIOGroup.toLowerCase().includes((search || fio || '').toLowerCase()))
                return test
            }
        )
    }, [search, fio, testInfoData])


    if (isTestInfoLoading || isTestInfoFetching) {
        return <div className={s.spin}>
            <Spin size={'large'}/>
        </div>
    }

    if (!testInfoData) {
        message.error('Ошибка при получении теста')
        navigate('/admin')
        return null
    }
    const setModal = (val: boolean) => {
        setCurrentQuestion(prev => ({...prev, openModal: val}))
    }

    const handleClearResults = async () => {
        try {
            await clearTestResultsTrigger(testId)
            await refetch()
        } catch (e) {
            message.error('Ошибка при удалении результатов')
        }
    }

    const handleChangeFullInfo = () => {
        if (isFullInfo) setIsFullInfo(false);
        else setIsFullInfo(true)
    }

    const currentTest = testInfoData.test

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
                <Button
                    loading={clearTestResultsLoading}
                    style={{width: 200}}
                    type={'primary'}
                    danger
                >
                    Очистить результаты
                </Button>
            </Popconfirm>
            <div className={s.admin__test__info__changeKey}>
                Ключ {testInfoData.testKey || 'не установлен'}
                <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/key/${currentTest._id}`)}>Изменить ключ</Button>
                {testInfoData.test.questions &&
                    <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/customTest/${currentTest._id}`)}>Редакитровать тест</Button>
                }
            </div>
            <Input placeholder={'Введите ФИО студента для поиска'} value={search} onChange={e => setSearch(e.target.value)}/>
            <div className={s.change__status__wrapper}>
                <Radio.Group value={isFullInfo} onChange={handleChangeFullInfo}>
                    <Radio.Button value={false}>Краткая информация</Radio.Button>
                    <Radio.Button value={true}>Подробная информация</Radio.Button>
                </Radio.Group>
            </div>
            {
                testInfoUsersResult?.length === 0
                    ? <p>Результов по тесту нет</p>
                    :  <div className={s.test__info__wrapper}>
                        {isFullInfo && (
                            <div className={s.downloadBtnWrapper}>
                                <Link
                                    to={`${API_URL}/test/downloadTest/${testId}`}
                                    className={s.downloadBtn}
                                ><DownloadOutlined/></Link>
                            </div>
                        )}
                        {testInfoUsersResult &&
                            <AdminTestInfoTable
                                isFullInfo={isFullInfo}
                                firstQuestionTitle={currentTest.firstQuestionTitle || 'Фамилия, номер группы'}
                                usersTestInfo={testInfoUsersResult}
                                questions={currentTest.questions}
                                countAnswers={currentTest.quantityQuestion || currentTest.questions.length}
                                setCurrentQuestion={setCurrentQuestion}
                                testKey={testInfoData.testKey}
                            />
                        }
                    </div>
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
