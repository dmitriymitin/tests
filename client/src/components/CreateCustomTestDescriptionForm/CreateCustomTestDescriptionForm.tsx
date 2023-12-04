import s from "./CreateCustomTestDescriptionForm.module.scss";
import React, {FC, memo, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import Editor from "./Editor/Editor";
import {EditorDescriptionTest} from "../../api/test/type";
import {Button, message} from "antd";
import {useMutation} from "react-query";
import {updateTestDescriptionEditor} from "../../api/test";
import exampleData from "./Editor/exampleData";

interface CreateCustomTestDescriptionFormProps {
    id: string;
    descriptionPARSE?: EditorDescriptionTest;
    refetch: () => void
    setDescriptionPARSE: (description: EditorDescriptionTest) => void
}

const CreateCustomTestDescriptionForm: FC<CreateCustomTestDescriptionFormProps> = ({id, setDescriptionPARSE, descriptionPARSE, refetch}) => {
    const navigate = useNavigate();
    const [form] = useForm()

    // const {
    // 		mutateAsync: updateTestDescriptionEditorTrigger,
    // 		isLoading: updateTestDescriptionEditorLoading,
    // 	} = useMutation(updateTestDescriptionEditor)

    // const handleSaveDescription = async () => {
    //     try {
    //         await updateTestDescriptionEditorTrigger({
    //             id,
    //             description: descriptionPARSE
    //         })
    //         navigate('/admin')
    //         message.success('Описание успешно сохранено!')
    //     } catch (e) {
    //         message.error('Ошибка при сохранении описания!')
    //     }
    // }


    return (
        <>
            <div className={s.editorContainer}>
                <Editor data={descriptionPARSE} setData={setDescriptionPARSE} />
            </div>
        </>

    );
};

export default memo(CreateCustomTestDescriptionForm);
