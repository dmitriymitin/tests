import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import { useMutation, useQuery} from "react-query";
import {getOneTestInfo, updateAdminKeyTest} from "../../api/test";
import {Button, Input, message, Spin} from "antd";
import s from './AdminTestKeyInfo.module.scss'
import clsx from "clsx";

const AdminTestKeyInfo = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [testKey, setTestKey] = useState('')
    const testId = location.pathname.split('/')[4]

    const {
        data: testInfoData,
        isLoading: isTestInfoLoading,
        isFetching: isTestInfoFetching,
        refetch
    } = useQuery(['adminTestKeyInfo', testId], () => getOneTestInfo(testId))

    const {
        mutateAsync: updateAdminKeyTestTrigger,
        isLoading: updateAdminKeyTestTriggerLoading,
    } = useMutation(updateAdminKeyTest)

    useEffect(() => {
        setTestKey(testInfoData?.test?.testKey || '')
    }, [testInfoData]);


    if (isTestInfoLoading || isTestInfoFetching) {
        return <Spin size={'large'}/>
    }

    if (!testInfoData) {
        navigate('/admin');
        message.error('Тест не найден')
        return null
    }

    const quantityQuestion = testInfoData?.test?.quantityQuestion || testInfoData?.test?.questions?.length
    const currentTest = testInfoData.test
    const dataTestKey = testInfoData.testKey

    const handleSaveKey = async () => {
        if (testKey.length !== quantityQuestion) {
            message.error(`Необходимо ввести ключ размером ${quantityQuestion}`)
            return
        }
        try {
            await updateAdminKeyTestTrigger({id: testId, key: testKey})
            await refetch()
        } catch (e) {
            message.error('Ошибка при сохранении ключа')
        }
    }

    return (
        <div className={clsx(s.admin__test__info, 'container')}>
            <h1 className={"title"}>
                {currentTest.title}
            </h1>
            <div className={s.admin__test__info__testKeyWrapper}>
                <p className={s.testKey}>Ключ к тесту</p>
                <Input
                    maxLength={quantityQuestion}
                    placeholder={'Введите ключ'}
                    className={s.testKeyInput}
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                />
                <Button loading={updateAdminKeyTestTriggerLoading} type={'primary'} onClick={handleSaveKey}>Сохранить</Button>
                <Button loading={updateAdminKeyTestTriggerLoading} type={'primary'} onClick={() => navigate(`/admin/testInfo/${currentTest._id}`)}>Перейти к результатам теста</Button>
            </div>

            {
                dataTestKey &&
                <div className={s.keyBlock}>
                    <h2 className={s.title}>
                        Подробная ифнормация
                    </h2>
                    <div className={s.keyBlockWrapper}>
                        {
                            new Array(quantityQuestion).fill('1').map((_, index) =>
                                <div key={index} className={s.item}>
                                    <div>Вопрос {index + 1}</div>
                                    {dataTestKey[index]}
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default AdminTestKeyInfo;
