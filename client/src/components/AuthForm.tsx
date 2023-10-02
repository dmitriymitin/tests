import React, {FC, useState} from 'react';
import {Button, Form, Input, message, theme} from "antd";
import {useDispatch} from "react-redux";
import {AuthActionCreators} from "../store/reducers/auth/action-creators";
import {useTypedSelector} from "../hooks/useTypedSelector";

export type infoState = {
    email:  string,
    password:   string,
    name: string,
    surname: string,
    gender: string,
    patronymic: string
}

const AuthForm: FC = () => {
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const {error, isLoading} = useTypedSelector(state => state.auth)

    const submit = () => {
        try {
            AuthActionCreators.login(password)(dispatch)
        } catch (e) {
            message.error('Ошибка при авторизации')
        }
    }

    return (
        <div className="login__box">
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={'Введите пароль'}
            />
            <div className="login__box__content__item">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    onClick={submit}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    );
};

export default AuthForm;
