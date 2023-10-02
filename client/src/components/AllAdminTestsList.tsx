import React from 'react';
import {Button, message, Spin} from "antd";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteTest, getAdminAllTests, updateAdminStatusTest} from "../api/test";
import {testStatusType} from "../type/test/type";
import {useNavigate} from "react-router-dom";


const getTestStatusText = (status: testStatusType) => {
    switch (status) {
        case "Start":
            return 'Открыть тест'
        case "Open":
            return 'Закрыть тест'
        case "Close":
            return 'Тест закрыт'
    }
}

const AllAdminTestsList = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {
        data: allTest,
        isLoading: isAllTestLoading,
        isFetching
    } = useQuery('allTests', getAdminAllTests);

    const {
        mutateAsync: deleteTestTrigger
    } = useMutation(deleteTest)

    const {
        mutateAsync: updateStatusTestTrigger
    } = useMutation(updateAdminStatusTest)

    const onDeleteTest = async (id: string) => {
        try {
            await deleteTestTrigger(id)
            await queryClient.invalidateQueries({ queryKey: ['allTests'] })
        } catch (e) {
            message.error('Ошибка при удалении теста')
        }
    }

    const onUpdateStatusTest = async (id: string, status: testStatusType) => {
        try {
            await updateStatusTestTrigger({id, status})
            await queryClient.invalidateQueries({ queryKey: ['allTests'] })
        } catch (e) {
            message.error('Ошибка при обвнолении статуса теста')
        }
    }

    if (!allTest || isAllTestLoading || isFetching) {
        return <Spin size={'large'}/>
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
        <div className="all__tests__list">
            {allTestArray.map(el =>
                <div key={el._id} className="all__tests__list__test">
                    <div className="title">
                        {el.title}
                    </div>

                    <div className={"info"}>
                        Кол-во вопросов: {el.quantityQuestion}
                    </div>

                    <div className="btns">
                        {
                            el.status === 'Close' &&
                            <Button
                                type={'primary'}
                                onClick={() => navigate(`/admin/testInfo/key/${el._id}`)}
                            >
                                Ввести ключ
                            </Button>
                        }
                        {
                            el.status === 'Close' &&
                                <Button
                                    onClick={() => navigate(`/admin/testInfo/${el._id}`)}
                                >
                                    Результаты
                                </Button>
                        }
                        <Button
                            type={'primary'}
                            onClick={() => onUpdateStatusTest(el._id, el.status)}
                            disabled={el.status === 'Close'}
                        >
                            {getTestStatusText(el.status)}
                        </Button>
                        <Button
                            type={'primary'}
                            onClick={() => onDeleteTest(el._id)}
                            danger
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAdminTestsList;
