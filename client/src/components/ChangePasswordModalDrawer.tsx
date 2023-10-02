import React, {useCallback, useState} from 'react';
import {useMedia} from "react-use";
import {Button, Drawer, Input, message, Modal} from "antd";
import AuthService from "../services/AuthService";
import {useMutation} from "react-query";
import {updateUserPassword} from "../api/user";

interface ChangePasswordModalDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void
}

const ChangePasswordModalDrawer = ({open, setOpen}: ChangePasswordModalDrawerProps) => {
    const [newPassword, setNewPassword] = useState('')
    const isPC = useMedia('(min-width: 768px)');

    const {
        mutateAsync: updateUserPasswordTrigger,
        isLoading: isUpdateUserPasswordLoading
    } = useMutation(updateUserPassword)

    const onOk = async () => {
        try {
            await updateUserPasswordTrigger({newPassword})
            setOpen(false)
            message.success('Пароль успешно обновлен')
        } catch (e) {
            message.error('Ошибка при обновлении пароля')
        }
    }

    return (
        <>
            {isPC &&
                <Modal
                    open={open}
                    title="Изменение пароля"
                    onCancel={() => setOpen(false)}
                    onOk={onOk}
                    className={"modalWrapper"}
                    footer={(
                        <>
                            <Button onClick={() => setOpen(false)}>Отмена</Button>
                            <Button type={'primary'} onClick={onOk}>Подтвердить</Button>
                        </>
                    )}
                >
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Введите новый пароль"
                    />
                </Modal>
            }

            {!isPC &&
                <Drawer
                    placement={"bottom"}
                    onClose={() => setOpen(false)}
                    open={open}
                    width={500}
                    height={'auto'}
                    className={"drawer"}
                    destroyOnClose
                >
                    <div className={"drawerWrapper"}>
                        <Input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Введите новый пароль"
                        />
                        <div className={'btns'}>
                            <Button onClick={() => setOpen(false)}>Отмена</Button>
                            <Button type={'primary'} onClick={onOk}>Подтвердить</Button>
                        </div>
                    </div>
                </Drawer>
            }
        </>
    )
};

export default ChangePasswordModalDrawer;
