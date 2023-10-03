import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {getOneTestInfo} from "../api/test";
import {Button, Spin} from "antd";
import AdminTestInfoTable from "../components/AdminTestInfoTable";

const AdminTestInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const testId = location.pathname.split('/')[3]

    const {
        data: testInfoData,
        isLoading: isTestInfoLoading
    } = useQuery(['adminTestInfo', testId], () => getOneTestInfo(testId))


    if (!testInfoData || isTestInfoLoading) {
        return <Spin size={'large'}/>
    }

    const currentTest = testInfoData.test
    const testInfoUsersResult = testInfoData.usersInfo

    return (
        <div className={"admin__test__info container"}>
            <h1 className={'title'}>
                {currentTest.title}
            </h1>
            <div className={'admin__test__info__changeKey'}>
                Ключ {testInfoData.testKey || 'не установлен'}
                <Button type={'primary'} onClick={() => navigate(`/admin/testInfo/key/${currentTest._id}`)}>Изменить ключ</Button>
            </div>
            {
                testInfoUsersResult.length === 0
                    ? <p>Результов по тесту нет</p>
                    :  <AdminTestInfoTable
                        usersTestInfo={testInfoUsersResult}
                        countAnswers={currentTest.quantityQuestion}
                        testKey={testInfoData.testKey}
                    />
            }
        </div>
    );
};

export default AdminTestInfo;
