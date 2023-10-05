import React from 'react';
import {Button, message, Popconfirm, Spin} from "antd";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteTest, getAdminAllTests, updateAdminStatusTest} from "../../api/test";
import {testStatusType} from "../../type/test/type";
import {useNavigate} from "react-router-dom";
import {CLIENT_URL} from "../../http";
import s from './AllAdminTestsList.module.scss'
import clsx from "clsx";
import {CopyOutlined} from "@ant-design/icons";
import CustomTooltip from "../CustomTooltip";

const getTestStatusTextForBtn = (status: testStatusType) => {
    switch (status) {
        case "Open":
            return 'Закрыть тест'
        default:
            return 'Открыть тест'
    }
}

const copyAddress = (value: string) => {
    navigator.clipboard.writeText(value);
};

const getTestStatusText = (status: testStatusType) => {
    switch (status) {
        case "Open":
            return <div className={clsx(s.body__status, 'statusOpen')}>Открыт</div>
        default:
            return <div className={clsx(s.body__status, 'statusClose')}>Закрыт</div>
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
            <div className={s.all__tests__list__empty}>
                Тестов пока нет
            </div>
        )
    }

    return (
        <div className={s.all__tests__list}>
            {allTestArray.map(el =>
                <div key={el._id} className={s.all__tests__list__wrapper}>
                    <div className={s.all__tests__list__test__item}>
                        <div className={s.title}>
                            {el.title}
                        </div>

                        <div className={s.infoWrapper}>
                            <p className={s.wrapperStatus}>Статус теста:</p>
                            {getTestStatusText(el.status)}
                        </div>

                        <div className={s.infoWrapper}>
                            <p>Адрес теста:</p>
                            <div className={clsx(s.body, s.addressTest)}>{CLIENT_URL + `/tests/${el._id}`}</div>
                            <CustomTooltip text={'Address has been successfully copied'}>
                                <button
                                    className={s.addressCopyButton}
                                    onClick={() => copyAddress(CLIENT_URL + `/tests/${el._id}`)}
                                >
                                    <CopyOutlined />
                                </button>
                            </CustomTooltip>
                        </div>

                        <div className={s.infoWrapper}>
                            <p>Кол-во вопросов:</p>
                            <div className={s.body}>{el.quantityQuestion}</div>
                        </div>

                    </div>
                    <div className={s.btnsWrapper}>
                        <div className={s.btns}>
                                <Button
                                    onClick={() => navigate(`/admin/testInfo/key/${el._id}`)}
                                >
                                    Ввести ключ
                                </Button>
                                <Button
                                    onClick={() => navigate(`/admin/testInfo/${el._id}`)}
                                >
                                    Результаты
                                </Button>
                        </div>
                        <div className={s.btns}>
                            <Button
                                type={'primary'}
                                onClick={() => onUpdateStatusTest(el._id, el.status)}
                            >
                                {getTestStatusTextForBtn(el.status)}
                            </Button>
                            <Popconfirm
                                title="Удаление теста"
                                description="Вы уверены, что хотите удалить тест?"
                                onConfirm={() => onDeleteTest(el._id)}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button
                                    className={s.deleteBtn}
                                    danger
                                >
                                    Удалить
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAdminTestsList;
