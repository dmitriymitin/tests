import React, {memo, useEffect, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getAdminAllTests, onUpdateCustomTestTitle, updateTitleFirstQuestion} from "../../../api/test";
import s from "./ChangeAllTestFirstQuestion.module.scss";
import {Button, Form, message, Spin} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface ChangeAllTestFirstQuestionProps{}

const ChangeAllTestFirstQuestion = () => {
    const [newTitle, setNewTitle] = useState( '')
    const [isChangeTitle, setIsChangeTitle] = useState(false)
    const queryClient = useQueryClient()

    const {
        data: allTest,
        isLoading: isAllTestLoading
    } = useQuery('allTests', getAdminAllTests, {
        refetchOnWindowFocus: false
    });

    const {
        mutateAsync: onUpdateTitleFirstQuestionTrigger,
        isLoading: onUpdateTitleFirstQuestionLoading
    } = useMutation(updateTitleFirstQuestion)

    useEffect(() => {
        if (!allTest)
            return
        setNewTitle(allTest[0].firstQuestionTitle || 'Фамилия, номер группы')
    }, [allTest]);

    if (!allTest || isAllTestLoading) {
        return <Spin size={'large'}/>
    }

    const title= allTest[0].firstQuestionTitle || 'Фамилия, номер группы'


    const onSave = async () => {
        try {
            await onUpdateTitleFirstQuestionTrigger(newTitle)
            setIsChangeTitle(false)
        } catch (e) {
            message.error('Произошла ошибка при обновлении названия')
        }
    }

    if (isChangeTitle) {
        return (
            <div className={s.title__wrapper}>
                <TextArea
                    defaultValue={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                        className={s.text__area__title}
                        rows={2}
                        placeholder={title}
                />
                <Button
                    loading={onUpdateTitleFirstQuestionLoading}
                    onClick={onSave}
                    className={s.clearBtn}
                    icon={<CheckOutlined/>}
                />
                <Button
                    loading={onUpdateTitleFirstQuestionLoading}
                    onClick={() => setIsChangeTitle(false)}
                    className={s.clearBtn}
                    icon={<CloseOutlined/>}
                />
            </div>
        );
    }

    return (
        <div className={s.title__block}>
            <h2 className={s.title}>Информация для студента: формат подписи</h2>
            <div className={s.title__wrapper}>
                <p className={s.test__title}>{newTitle}</p>
            </div>
            <div className={s.btnWrapper}>
                <Button
                    type={'primary'}
                    onClick={() => setIsChangeTitle(true)}
                >
                    Редактировать
                </Button>
            </div>
        </div>
    );
};

export default memo(ChangeAllTestFirstQuestion);
