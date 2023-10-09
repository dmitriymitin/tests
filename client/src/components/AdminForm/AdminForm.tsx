import React, {useState} from 'react';
import s from './AdminForm.module.scss'
import {Button, message} from "antd";
import ChangePasswordModalDrawer from "../ChangePasswordModalDrawer";
import NewTestModalDrawer from "../NewTestModalDrawer";
import AllAdminTestsList from "../AllAdminTestsList/AllAdminTestsList";
import {AuthActionCreators} from "../../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import {createNewCustomTest, createNewTest, createNewTestWithDescription} from "../../api/test";
import ChangeCustomTestTitle from "../CreateCustomTestForm/ChangeCustomTestTitle/ChangeCustomTestTitle";
import ChangeAllTestFirstQuestion from "../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";
import NewTestModalDrawerWithDescription from "../NewTestModalDrawerWithDescription";

const AdminForm = () => {
    const navigate = useNavigate()
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();
    const [newTestOpen, setNewTestOpen] = useState(false)
    const [newTestDescriptionOpen, setNewTestDescriptionOpen] = useState(false)
    const {
        mutateAsync: createCustomTestTrigger,
        isLoading: createCustomTestLoading,
    } = useMutation(createNewCustomTest)

    const handleCreateCustomTest = async () => {
        try {
            const res = await createCustomTestTrigger();
            navigate(`/admin/testInfo/customTest/${res._id}`)
        } catch (e) {
            message.error('Ошибка при создании теста')
        }
    }

    const handleCreateCustomTestWithDescription = async () => {
        setNewTestDescriptionOpen(true)
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
                        className={s.btn}
                        type={"primary"}
                        onClick={() => setChangePasswordModal(true)}
                    >
                        Изменить пароль
                    </Button>
                    <Button
                        className={s.btn}
                        type={"primary"}
                        onClick={() => setNewTestOpen(true)}
                    >
                        Создать новый тест
                    </Button>
                    <Button
                        className={s.btn}
                        loading={createCustomTestLoading}
                        type={"primary"}
                        onClick={handleCreateCustomTest}
                    >
                        Создать новый тест со своими вопросами
                    </Button>
                    <Button
                        className={s.btn}
                        type={"primary"}
                        onClick={handleCreateCustomTestWithDescription}
                    >
                        Создать новый тест только с описанием
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
