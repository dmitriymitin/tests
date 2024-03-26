import React, {FC, useState} from 'react';
import {Button, Form, Input, message, theme} from "antd";
import {useDispatch} from "react-redux";
import {AuthActionCreators} from "../../store/reducers/auth/action-creators";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import s from './AuthForm.module.scss'

const AuthFormDev: FC = () => {
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const { isLoading} = useTypedSelector(state => state.auth)

    const submit = () => {
        try {
            AuthActionCreators.loginDev(password)(dispatch)
        } catch (e) {
            message.error('Ошибка при авторизации')
        }
    }
    

    return (
        <div className={s.login__box}>
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={'Введите пароль'}
            />
            <div className={s.login__box__content__item}>
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

export default AuthFormDev;
