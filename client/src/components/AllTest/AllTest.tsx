import React from 'react';
import {useQuery} from "react-query";
import {getAdminAllTests, getUsersAllTests} from "../../api/test";
import {Button, Spin} from "antd";
import {useNavigate} from "react-router-dom";
import s from './AllTest.module.scss'
import clsx from "clsx";
import {ITestModelResponse} from "../../api/test/type";

const AllTest = () => {
    const navigate = useNavigate();

    const {
        data: allTest,
        isLoading: isAllTestLoading,
        isFetching
    } = useQuery('allUsersTests', getUsersAllTests, {
        refetchOnWindowFocus: false
    });


    if (!allTest || isAllTestLoading || isFetching) {
        return (
            <div style={{
                height: '500px',
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Spin size={'large'}/>
            </div>
            )
    }

    const allTestDataArray = Object.values(allTest)
    const allTestArray = allTestDataArray.sort((a: ITestModelResponse, b: ITestModelResponse) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        if (dateA < dateB)
            return 1
        if (dateA > dateB)
            return -1
        return 0
    });

    if (allTestArray.length === 0) {
        return (
            <div className={s.all__tests__list__empty}>
                Тестов пока нет
            </div>
        )
    }

    return (
        <div className={s.all__tests__list__users}>
            <h1>
                Список тестов
            </h1>
            <div className={s.all__tests__list}>
                {allTestArray.map(el =>
                    <div key={el._id} className={clsx(s.all__tests__list__test__item, 'testBackground')}>
                        <p className={s.title}>
                            {el.title}
                        </p>

                        <div className={s.btns}>
                                <Button
                                    type={'primary'}
                                    onClick={() => navigate(`/tests/${el._id}`)}
                                >
                                    Пройти
                                </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default AllTest;
