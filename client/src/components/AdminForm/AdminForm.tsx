import React, {useState} from 'react';
import s from './AdminForm.module.scss'
import {Button, message} from "antd";
import ChangePasswordModalDrawer from "../ChangePasswordModalDrawer";
import NewTestModalDrawer from "../NewTestModalDrawer";
import AllAdminTestsList from "../AllAdminTestsList/AllAdminTestsList";
import {AuthActionCreators} from "../../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import {createNewCustomTest, createNewTest, createNewTestWithDescription} from "../../api/test";
import ChangeCustomTestTitle from "../CreateCustomTestForm/ChangeCustomTestTitle/ChangeCustomTestTitle";
import ChangeAllTestFirstQuestion from "../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";
import NewTestModalDrawerWithDescription from "../NewTestModalDrawerWithDescription";
import {getFormateDate} from "../../utils/getFormateDate";

const AdminForm = () => {
    const navigate = useNavigate()
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();
    const [newTestOpen, setNewTestOpen] = useState(false)
    const [newTestDescriptionOpen, setNewTestDescriptionOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        mutateAsync: createCustomTestTrigger,
        isLoading: createCustomTestLoading,
    } = useMutation(createNewCustomTest)

    const {
        mutateAsync: createNewTestTrigger,
        isLoading: isCreateNewTestLoading
    } = useMutation(createNewTestWithDescription);

    const handleCreateCustomTest = async () => {
        try {
            const date = new Date();
            const createDate = getFormateDate(date)
            const res = await createCustomTestTrigger(createDate);
            navigate(`/admin/testInfo/customTest/${res._id}`)
        } catch (e) {
            message.error('Ошибка при создании теста')
        }
    }

    const handleCreateCustomTestWithDescription = async () => {
        try {
            const date = new Date();
            const createDate = getFormateDate(date)
            const res = await createNewTestTrigger({
                title: 'Тест с описанием',
                quantityQuestion: 1,
                createDate
            });
            navigate(`/admin/testInfo/customTest/description/${res._id}`)
            await queryClient.invalidateQueries({ queryKey: ['allTests'] })
        } catch (e) {
            message.error('Ошибка при создании теста')
        }
    }

    return (
        <>
            <div className={s.admin__form}>
                <div className={s.title__wrapper}>
                    <h1 className="title">
                        Страница администратора
                    </h1>
                    <Button className={s.exitBtn} danger onClick={() => AuthActionCreators.logout()(dispatch)}>Выйти</Button>
                </div>

                <div className={s.admin__form__btns}>
                    <Button
                        size={'large'}
                        className={s.btn}
                        type={"primary"}
                        onClick={() => setNewTestOpen(true)}
                    >
                        Тест без описания
                    </Button>
                    <Button
                        size={'large'}
                        className={s.btn}
                        loading={isCreateNewTestLoading}
                        type={"primary"}
                        onClick={handleCreateCustomTestWithDescription}
                    >
                        Тест с описанием
                    </Button>
                    <Button
                        size={'large'}
                        className={s.btn}
                        loading={createCustomTestLoading}
                        type={"primary"}
                        onClick={handleCreateCustomTest}
                    >
                        Тест с отдельным описанием вопросов
                    </Button>
                    <Button
                        size={'large'}
                        className={s.btn}
                        type={"primary"}
                        onClick={() => setChangePasswordModal(true)}
                    >
                        Изменить пароль
                    </Button>
                </div>
                <AllAdminTestsList/>
                <ChangePasswordModalDrawer open={changePasswordOpen} setOpen={setChangePasswordModal}/>
                <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
                <NewTestModalDrawerWithDescription open={newTestDescriptionOpen} setOpen={setNewTestDescriptionOpen}/>
            </div>
        </>

    );
};

export default AdminForm;
