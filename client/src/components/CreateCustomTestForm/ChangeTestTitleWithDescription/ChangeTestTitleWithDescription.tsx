import s from "./ChangeTestTitleWithDescription.module.scss";
import React, {FC, memo, useState} from "react";
import {useMutation} from "react-query";
import {onUpdateTestInfo} from "../../../api/test";
import {Button, Form, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

interface ChangeTestTitleWithDescriptionProps {
    title: string
}

const ChangeTestTitleWithDescription: FC<ChangeTestTitleWithDescriptionProps> = ({ title}) => {
    const [isChangeTitle, setIsChangeTitle] = useState(true)

    if (isChangeTitle) {
        return (
            <div className={s.title__wrapper}>
                <Form.Item
                    className={s.formTestTitle}
                    name={'testTitle'}
                    label={'Название теста'}
                >
                    <TextArea
                        className={s.text__area__title}
                        rows={2}
                        placeholder={title}
                    />
                </Form.Item>
            </div>
        );
    }

    return (
        <div className={s.title__block}>
            <h2 className={s.title}>Название теста</h2>
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

export default memo(ChangeTestTitleWithDescription);
