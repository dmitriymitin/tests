import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import { useMutation, useQuery} from "react-query";
import {getOneTestInfo, updateAdminKeyTest} from "../api/test";
import {Button, Input, message, Spin} from "antd";

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

    const handleSaveKey = async () => {
        if (testKey.length !== testInfoData?.test?.quantityQuestion) {
            message.error(`Необходимо ввести ключ размером ${testInfoData?.test?.quantityQuestion}`)
            return
        }
        try {
            await updateAdminKeyTestTrigger({id: testId, key: testKey})
            await refetch()
        } catch (e) {
            message.error('Ошибка при сохранении ключа')
        }
    }


    if (!testInfoData || isTestInfoLoading || isTestInfoFetching) {
        return <Spin size={'large'}/>
    }

    const currentTest = testInfoData.test
    const dataTestKey = testInfoData.testKey

    return (
        <div className={"admin__test__info container"}>
            <h1 className={'title'}>
                {currentTest.title}
            </h1>
            <div className={'admin__test__info__testKeyWrapper'}>
                <p className={'testKey'}>Ключ к тесту</p>
                <Input
                    maxLength={currentTest.quantityQuestion}
                    placeholder={'Введите ключ'}
                    className={'testKeyInput'}
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                />
                <Button loading={updateAdminKeyTestTriggerLoading} type={'primary'} onClick={handleSaveKey}>Сохранить</Button>
                <Button loading={updateAdminKeyTestTriggerLoading} type={'primary'} onClick={() => navigate(`/admin/testInfo/${currentTest._id}`)}>Перейти к результатам теста</Button>
            </div>

            {
                dataTestKey &&
                <div className={'keyBlock'}>
                    <h2 className={'title'}>
                        Подробная ифнормация
                    </h2>
                    <div className={'keyBlockWrapper'}>
                        {
                            new Array(currentTest.quantityQuestion).fill('1').map((_, index) =>
                                <div className={'item'}>
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
