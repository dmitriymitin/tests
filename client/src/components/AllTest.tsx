import React from 'react';
import {useQuery} from "react-query";
import {getAdminAllTests, getUsersAllTests} from "../api/test";
import {Button, Spin} from "antd";
import {useNavigate} from "react-router-dom";

const AllTest = () => {
    const navigate = useNavigate();

    const {
        data: allTest,
        isLoading: isAllTestLoading,
        isFetching
    } = useQuery('allUsersTests', getUsersAllTests);


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

    const allTestArray = Object.values(allTest)

    if (allTestArray.length === 0) {
        return (
            <div className={"all__tests__list__empty"}>
                Тестов пока нет
            </div>
        )
    }

    return (
        <div className="all__tests__list__users">
            <h1 className={"h1"}>
                Список тестов
            </h1>
            <div className="all__tests__list">
                {allTestArray.map(el =>
                    <div key={el._id} className="all__tests__list__test__item testBackground">
                        <div className="title">
                            {el.title}
                        </div>

                        <div className="btns">
                            {
                                <Button
                                    type={'primary'}
                                    onClick={() => navigate(`/tests/${el._id}`)}
                                >
                                    Пройти
                                </Button>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default AllTest;
