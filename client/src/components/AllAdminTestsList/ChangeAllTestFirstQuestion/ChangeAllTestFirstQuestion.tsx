import React, {useState} from 'react';
import {useMutation} from "react-query";
import {onUpdateCustomTestTitle, updateTitleFirstQuestion} from "../../../api/test";
import s from "./ChangeAllTestFirstQuestion.module.scss";
import {Button, Form, message} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface ChangeAllTestFirstQuestionProps{
    title: string;
    refetch: () => void
}

const ChangeAllTestFirstQuestion = ({refetch, title}: ChangeAllTestFirstQuestionProps) => {
    const [newTitle, setNewTitle] = useState(title || '')
    const [isChangeTitle, setIsChangeTitle] = useState(false)

    const {
        mutateAsync: onUpdateTitleFirstQuestionTrigger,
        isLoading: onUpdateTitleFirstQuestionLoading
    } = useMutation(updateTitleFirstQuestion)

    const onSave = async () => {
        try {
            await onUpdateTitleFirstQuestionTrigger(newTitle)
            refetch()
            setIsChangeTitle(false)
        } catch (e) {
            message.error('Произошла ошибка при обновлении названия')
        }
    }

    if (isChangeTitle) {
        return (
            <div className={s.title__wrapper}>
                <TextArea
                    defaultValue={title}
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
            <h2 className={s.title}>Название первого вопроса во всех тестах</h2>
            <div className={s.title__wrapper}>
                <p className={s.test__title}>{title}</p>
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

export default ChangeAllTestFirstQuestion;
