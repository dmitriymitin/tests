import React, {useState} from 'react';
import {Button} from "antd";
import ChangePasswordModalDrawer from "./ChangePasswordModalDrawer";
import NewTestModalDrawer from "./NewTestModalDrawer";
import AllAdminTestsList from "./AllAdminTestsList/AllAdminTestsList";
import {AuthActionCreators} from "../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";

const AdminForm = () => {
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();
    const [newTestOpen, setNewTestOpen] = useState(false)
    return (
        <>
            <div className={"admin__form"}>
                <h1 className="title">Страница администратора</h1>
                <div className="admin__form__btns">
                    <Button type={"primary"} onClick={() => setChangePasswordModal(true)}>Изменить пароль</Button>
                    <Button type={"primary"} onClick={() => setNewTestOpen(true)}>Создать новый тест</Button>
                    <Button type={"primary"} danger onClick={() => AuthActionCreators.logout()(dispatch)}>Выйти</Button>
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
