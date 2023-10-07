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
import {createNewCustomTest} from "../../api/test";

const AdminForm = () => {
    const navigate = useNavigate()
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();
    const [newTestOpen, setNewTestOpen] = useState(false)
    const {
        mutateAsync: createCustomTestTrigger,
        isLoading: createCustomTestLoading
    } = useMutation(createNewCustomTest)

    const handleCreateCustomTest = async () => {
        try {
            const res = await createCustomTestTrigger();
            navigate('/test/createCustom')
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
                    <Button type={"primary"} onClick={() => setChangePasswordModal(true)}>Изменить пароль</Button>
                    <Button type={"primary"} onClick={() => setNewTestOpen(true)}>Создать новый тест</Button>
                    <Button
                        loading={createCustomTestLoading}
                        type={"primary"}
                        onClick={handleCreateCustomTest}
                    >
                        Создать новый тест со своими вопросами
                    </Button>
                </div>
                <h2>Список всех тестов</h2>
                <AllAdminTestsList/>
                <ChangePasswordModalDrawer open={changePasswordOpen} setOpen={setChangePasswordModal}/>
                <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
            </div>
        </>

    );
};

export default AdminForm;
